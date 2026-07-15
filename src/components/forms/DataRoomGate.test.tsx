import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ trackEvent }));

import { DataRoomGate } from "@/components/forms/DataRoomGate";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText("Full name"), "Ada Lovelace");
  await userEvent.type(screen.getByLabelText("Work email"), "ada@fund.com");
  await userEvent.type(screen.getByLabelText("Firm / Fund"), "Analytical");
}

const PENDING_DOCUMENTS = [
  {
    slug: "pitch-deck",
    title: "Pitch Deck",
    description: "The full investor narrative.",
    url: null,
  },
  {
    slug: "one-pager",
    title: "One-Pager",
    description: "The executive summary on a single page.",
    url: null,
  },
];

describe("DataRoomGate", () => {
  it("shows inline errors and does not submit for missing fields", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<DataRoomGate />);
    await userEvent.click(
      screen.getByRole("button", { name: "Request Access" }),
    );

    expect(await screen.findByText("Enter your full name.")).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("unlocks the room in place with pending slots and fires the request event", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ documents: PENDING_DOCUMENTS }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<DataRoomGate />);
    await fillValidForm();
    await userEvent.click(
      screen.getByRole("button", { name: "Request Access" }),
    );

    expect(
      await screen.findByText(/the room is open below/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Pitch Deck")).toBeInTheDocument();
    expect(screen.getAllByText("In preparation")).toHaveLength(2);
    expect(
      screen.getByText(/documents are being finalized/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith({
      name: "data_room_request",
      params: { status: "success" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/data-room",
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse(
      (fetchMock.mock.calls[0]?.[1] as RequestInit).body as string,
    ) as Record<string, string>;
    expect(body.email).toBe("ada@fund.com");
  });

  it("renders signed download links and fires the download event on click", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        documents: [
          {
            ...PENDING_DOCUMENTS[0],
            url: "https://storage.example.com/signed/pitch-deck.pdf",
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<DataRoomGate />);
    await fillValidForm();
    await userEvent.click(
      screen.getByRole("button", { name: "Request Access" }),
    );

    const link = await screen.findByRole("link", { name: "Download PDF" });
    expect(link).toHaveAttribute(
      "href",
      "https://storage.example.com/signed/pitch-deck.pdf",
    );
    expect(screen.getByText(/valid for 15 minutes/i)).toBeInTheDocument();

    link.addEventListener("click", (event) => event.preventDefault());
    await userEvent.click(link);
    expect(trackEvent).toHaveBeenCalledWith({
      name: "data_room_download",
      params: { document: "pitch-deck" },
    });
  });

  it("announces a server error, stays gated, and fires the error event", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "We couldn't register your request." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<DataRoomGate />);
    await fillValidForm();
    await userEvent.click(
      screen.getByRole("button", { name: "Request Access" }),
    );

    expect(
      await screen.findByText("We couldn't register your request."),
    ).toBeVisible();
    expect(screen.queryByText("Pitch Deck")).not.toBeInTheDocument();
    await waitFor(() =>
      expect(trackEvent).toHaveBeenCalledExactlyOnceWith({
        name: "data_room_request",
        params: { status: "error" },
      }),
    );
  });
});
