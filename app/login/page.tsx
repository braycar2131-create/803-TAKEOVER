import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { loginAction } from "./actions";
import styles from "./login.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login | 803 TAKEOVER",
  description:
    "Secure 803 TAKEOVER administration login.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const adminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase() ?? "";

  const supabase = await createClient();

  const { data } =
    await supabase.auth.getClaims();

  const emailClaim = data?.claims?.email;

  const signedInEmail =
    typeof emailClaim === "string"
      ? emailClaim.trim().toLowerCase()
      : "";

  if (
    adminEmail &&
    signedInEmail === adminEmail
  ) {
    redirect("/admin");
  }

  const params = await searchParams;

  const error =
    typeof params.error === "string"
      ? params.error
      : undefined;

  return (
    <main className={styles.page}>
      <div className={styles.glow} />

      <section className={styles.card}>
        <Link
          href="/"
          className={styles.brand}
        >
          <span>803</span>
          <strong>TAKEOVER</strong>
        </Link>

        <div className={styles.heading}>
          <span>AUTHORIZED ACCESS ONLY</span>
          <h1>ADMIN LOGIN</h1>
          <p>
            Sign in to access orders,
            inventory, products, and store
            management.
          </p>
        </div>

        {error ? (
          <div
            className={styles.error}
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <form
          action={loginAction}
          className={styles.form}
        >
          <label>
            <span>ADMIN EMAIL</span>

            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </label>

          <label>
            <span>PASSWORD</span>

            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
            />
          </label>

          <button type="submit">
            ENTER CONTROL CENTER
          </button>
        </form>

        <Link
          href="/"
          className={styles.storeLink}
        >
          ← RETURN TO STOREFRONT
        </Link>
      </section>
    </main>
  );
}
