"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/molecules/FormField";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { trackEvent } from "@/lib/analytics";
import {
  dataRoomRequestSchema,
  type DataRoomDocumentAccess,
  type DataRoomRequestInput,
} from "@/lib/api/data-room";
import { cn } from "@/lib/utils";

export type DataRoomGateProps = {
  className?: string;
};

/**
 * The investor data-room gate (E11.1.3, gating per the E11.1.4 decision:
 * email-gated, instant unlock). Renders the access-request form; on success it
 * swaps in place to the document list, whose download links are time-limited
 * signed URLs minted by the API. Documents whose founder-supplied files are
 * still pending render as "In preparation" instead of a link. Copy per
 * `docs/product/copy.md` §7. Access is per-visit by design — a refresh
 * re-gates, and each new request re-mints fresh URLs.
 */
export function DataRoomGate({ className }: DataRoomGateProps) {
  const fieldId = useId();
  const [formError, setFormError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DataRoomDocumentAccess[] | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DataRoomRequestInput>({
    resolver: zodResolver(dataRoomRequestSchema),
    defaultValues: { name: "", email: "", firm: "", checkSize: "" },
  });

  // Conversion event: outcome only — never the name, email, or firm.
  const trackRequest = (status: "success" | "error") => {
    trackEvent({ name: "data_room_request", params: { status } });
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const response = await fetch("/api/data-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setFormError(data?.error ?? "Something went wrong. Please try again.");
        trackRequest("error");
        return;
      }

      const data = (await response.json()) as {
        documents: DataRoomDocumentAccess[];
      };
      trackRequest("success");
      setDocuments(data.documents);
    } catch {
      setFormError(
        "Couldn't reach the server. Please check your connection and try again.",
      );
      trackRequest("error");
    }
  });

  if (documents) {
    const anyAvailable = documents.some((doc) => doc.url !== null);
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <p role="status" aria-live="polite" className="text-body-md text-fg">
          Request received — the room is open below. A founder will follow up
          within 48 hours.
        </p>

        <ul className="flex flex-col gap-4">
          {documents.map((doc) => (
            <li
              key={doc.slug}
              className="border-border bg-surface flex flex-col gap-3 rounded-md border p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <p className="text-heading-md text-fg">{doc.title}</p>
                <p className="text-body-sm text-fg-muted">{doc.description}</p>
              </div>
              {doc.url ? (
                <Button
                  asChild
                  variant="secondary"
                  onClick={() =>
                    trackEvent({
                      name: "data_room_download",
                      params: { document: doc.slug },
                    })
                  }
                >
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    Download PDF
                  </a>
                </Button>
              ) : (
                <Badge variant="neutral" className="shrink-0 whitespace-nowrap">
                  In preparation
                </Badge>
              )}
            </li>
          ))}
        </ul>

        {!anyAvailable ? (
          <p className="text-body-sm text-fg-muted">
            The first documents are being finalized by the founding team. Your
            request is registered — a founder will follow up within 48 hours.
          </p>
        ) : (
          <p className="text-body-sm text-fg-subtle">
            Download links are valid for 15 minutes. Re-submit the form any time
            for fresh links.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("flex flex-col gap-4", className)}
    >
      <FormField
        label="Full name"
        htmlFor={`${fieldId}-name`}
        error={errors.name?.message}
      >
        {(control) => (
          <Input
            {...control}
            {...register("name")}
            type="text"
            autoComplete="name"
            placeholder="Your name"
          />
        )}
      </FormField>

      <FormField
        label="Work email"
        htmlFor={`${fieldId}-email`}
        hint="Enter your email and firm name — we'll follow up personally, not with an autoresponder."
        error={errors.email?.message}
      >
        {(control) => (
          <Input
            {...control}
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@fund.com"
          />
        )}
      </FormField>

      <FormField
        label="Firm / Fund"
        htmlFor={`${fieldId}-firm`}
        error={errors.firm?.message}
      >
        {(control) => (
          <Input
            {...control}
            {...register("firm")}
            type="text"
            autoComplete="organization"
            placeholder="Fund or firm name"
          />
        )}
      </FormField>

      <FormField
        label="Check size (optional)"
        htmlFor={`${fieldId}-check-size`}
        error={errors.checkSize?.message}
      >
        {(control) => (
          <Input
            {...control}
            {...register("checkSize")}
            type="text"
            placeholder="e.g. $250K–$1M"
          />
        )}
      </FormField>

      <Button type="submit" loading={isSubmitting}>
        Request Access
      </Button>

      {/* Form-level status (server/network errors). Field errors live inline
          in FormField above. Always in the DOM so it's a stable live region. */}
      <p
        role="status"
        aria-live="polite"
        className="text-body-sm text-danger min-h-5"
      >
        {formError}
      </p>
    </form>
  );
}
