"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { waitlistSchema, type WaitlistInput } from "@/lib/api/waitlist";
import { cn } from "@/lib/utils";

export type WaitlistFormProps = {
  /** Origin tag stored with the signup, e.g. "home-hero" — powers attribution. */
  source?: string;
  /** Where to send the user after a successful signup. */
  successHref?: string;
  className?: string;
};

/**
 * The site's primary conversion form (E8.1.1). Validates client-side with the
 * *same* `waitlistSchema` the API route uses (one source of truth), submits
 * through the `lib/api` seam via `POST /api/waitlist`, announces failures in an
 * `aria-live` region, and redirects to the thank-you page on success.
 */
export function WaitlistForm({
  source,
  successHref = "/waitlist/thank-you",
  className,
}: WaitlistFormProps) {
  const router = useRouter();
  const fieldId = useId();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, source }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setFormError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(successHref);
    } catch {
      setFormError(
        "Couldn't reach the server. Please check your connection and try again.",
      );
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("flex flex-col gap-4", className)}
    >
      <FormField
        label="Work email"
        htmlFor={`${fieldId}-email`}
        hint="No spam. Just early access, beta invitations, and founder updates."
        error={errors.email?.message}
      >
        {(control) => (
          <Input
            {...control}
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
          />
        )}
      </FormField>

      <Button type="submit" loading={isSubmitting}>
        Join the Waitlist
      </Button>

      {/* Form-level status (server/network errors). Field errors live inline in
          FormField above. Always in the DOM so it's a stable live region. */}
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
