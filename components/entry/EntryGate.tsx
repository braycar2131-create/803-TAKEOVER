"use client";

import { FormEvent, useState } from "react";

type Mode = "email" | "phone";

export default function EntryGate() {
  const [mode, setMode] = useState<Mode>("email");
  const [value, setValue] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [emailConsent, setEmailConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (mode === "phone" && !smsConsent) {
      setMessage("Check the SMS consent box before joining by phone.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/audience/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          value,
          smsConsent: mode === "phone" ? smsConsent : false,
          emailConsent: mode === "email" ? emailConsent : false,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to join right now.");
      }

      setMessage("YOU'RE IN. WELCOME TO THE TAKEOVER.");
      window.setTimeout(() => {
        window.location.href = "/";
      }, 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to join right now.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="entry-form-wrap">
      <div className="entry-tabs" role="tablist">
        <button type="button" className={mode === "email" ? "active" : ""}
          onClick={() => { setMode("email"); setValue(""); setMessage(""); }}>
          EMAIL
        </button>
        <button type="button" className={mode === "phone" ? "active" : ""}
          onClick={() => { setMode("phone"); setValue(""); setMessage(""); }}>
          SMS
        </button>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        <label>
          <span>{mode === "email" ? "EMAIL ADDRESS" : "MOBILE NUMBER"}</span>
          <input
            type={mode === "email" ? "email" : "tel"}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={mode === "email" ? "YOU@EXAMPLE.COM" : "(803) 555-0100"}
            autoComplete={mode === "email" ? "email" : "tel"}
            required
          />
        </label>

        {mode === "email" ? (
          <label className="entry-consent">
            <input type="checkbox" checked={emailConsent}
              onChange={(event) => setEmailConsent(event.target.checked)} />
            <span>Send me early-access announcements, restocks, and exclusive offers by email.</span>
          </label>
        ) : (
          <label className="entry-consent">
            <input type="checkbox" checked={smsConsent}
              onChange={(event) => setSmsConsent(event.target.checked)} required />
            <span>
              I agree to receive recurring automated promotional texts from 803 TAKEOVER.
              Message frequency varies. Message and data rates may apply. Reply STOP to
              unsubscribe and HELP for help. Consent is not a condition of purchase.
            </span>
          </label>
        )}

        <button className="entry-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "OPENING ACCESS..." : "ENTER THE TAKEOVER"}
        </button>

        {message ? <p className="entry-message" role="status">{message}</p> : null}

        <p className="entry-legal">
          By continuing, you agree to our <a href="/terms">Terms</a>, <a href="/privacy">Privacy Policy</a>, and <a href="/sms-terms">SMS Terms</a>.
        </p>
      </form>
    </div>
  );
}
