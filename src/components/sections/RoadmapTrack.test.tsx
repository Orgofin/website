import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LazyMotionProvider } from "@/components/motion/LazyMotionProvider";
import {
  RoadmapTrack,
  type RoadmapStage,
} from "@/components/sections/RoadmapTrack";

const TEASER_STAGES: readonly RoadmapStage[] = [
  { label: "HRMS", active: true },
  { label: "Books" },
  { label: "CRM" },
];

const FULL_STAGES: readonly RoadmapStage[] = [
  {
    label: "H1 — HRMS Wedge",
    timeframe: "0–12 months",
    target: "$2–5M ARR",
    active: true,
  },
  {
    label: "H2 — Full-Stack SMB OS",
    timeframe: "12–36 months",
    target: "$20–40M ARR",
  },
];

function renderTrack(ui: React.ReactElement) {
  return render(<LazyMotionProvider>{ui}</LazyMotionProvider>);
}

describe("RoadmapTrack", () => {
  it("renders the teaser variant as a labelled list of stages", () => {
    renderTrack(
      <RoadmapTrack
        variant="teaser"
        stages={TEASER_STAGES}
        aria-label="Product roadmap sequence"
      />,
    );

    const list = screen.getByRole("list", { name: "Product roadmap sequence" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(list).getByText("HRMS")).toBeInTheDocument();
    expect(within(list).getByText("CRM")).toBeInTheDocument();
  });

  it("renders the full variant with timeframes and mono targets", () => {
    renderTrack(
      <RoadmapTrack
        variant="full"
        stages={FULL_STAGES}
        aria-label="Roadmap horizons"
      />,
    );

    const list = screen.getByRole("list", { name: "Roadmap horizons" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(within(list).getByText("H1 — HRMS Wedge")).toBeInTheDocument();
    expect(within(list).getByText("0–12 months")).toBeInTheDocument();
    expect(within(list).getByText("$2–5M ARR")).toBeInTheDocument();
  });

  it("does not render timeframe/target rows the data omits", () => {
    renderTrack(
      <RoadmapTrack
        variant="teaser"
        stages={TEASER_STAGES}
        aria-label="Sequence"
      />,
    );
    expect(screen.queryByText(/ARR/)).not.toBeInTheDocument();
  });
});
