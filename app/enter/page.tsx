import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EntryGate from "../../components/entry/EntryGate";
import "./enter.css";

export const dynamic = "force-dynamic";

export default async function EnterPage() {
  const cookieStore = await cookies();

  if (
    cookieStore.get("takeover_access")?.value ===
    "granted"
  ) {
    redirect("/");
  }

  return (
    <main className="entry-page">
      <div className="entry-noise" />
      <div className="entry-glow entry-glow-left" />
      <div className="entry-glow entry-glow-right" />

      <section className="entry-shell">
        <div className="entry-mark">
          <span>803</span>
          <strong>TAKEOVER</strong>
        </div>

        <div className="entry-copy">
          <span>PRIVATE ACCESS</span>

          <h1>
            JOIN THE
            <br />
            MOVEMENT.
          </h1>

          <p>
            Get first access to private drops,
            restocks, release dates, and messages
            from 803 TAKEOVER.
          </p>
        </div>

        <EntryGate />

        <div className="entry-footer">
          <span>THE CITY WATCHING.</span>
          <span>THE MOVEMENT GROWING.</span>
        </div>
      </section>
    </main>
  );
}