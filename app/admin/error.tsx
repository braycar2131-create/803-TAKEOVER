"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="admin-error">
      <span>ADMIN ERROR</span>
      <h1>SOMETHING BROKE.</h1>
      <p>{error.message || "The dashboard could not load."}</p>

      <button type="button" onClick={reset}>
        TRY AGAIN
      </button>
    </section>
  );
}
