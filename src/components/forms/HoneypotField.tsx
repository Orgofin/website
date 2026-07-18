import { HONEYPOT_FIELD_NAME } from "@/lib/security/bot-protection";

/**
 * A hidden honeypot input for bot deterrence (see
 * `lib/security/bot-protection.ts`). Real users never see or fill it; naive
 * bots do, and the API routes reject any submission where it's non-empty.
 *
 * Hidden accessibly-and-from-autofill: off-screen (not `display:none`, which
 * some bots skip), `aria-hidden`, `tabIndex=-1`, `autoComplete="off"`, and a
 * field name chosen to dodge browser/password-manager autofill so it never
 * triggers a false positive for a legitimate user.
 *
 * The value is read at submit time from the form's `FormData` (see
 * `readHoneypot`), so no ref plumbing is needed.
 */
export function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD_NAME}>Leave this field empty</label>
      <input
        id={HONEYPOT_FIELD_NAME}
        name={HONEYPOT_FIELD_NAME}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

/**
 * Reads the honeypot value from the submitted form. Pass the submit event's
 * form element (`event?.target`). Returns "" when unavailable.
 */
export function readHoneypot(form: EventTarget | null | undefined): string {
  if (!(form instanceof HTMLFormElement)) return "";
  const value = new FormData(form).get(HONEYPOT_FIELD_NAME);
  return typeof value === "string" ? value : "";
}
