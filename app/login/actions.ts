"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

const INVALID_LOGIN_MESSAGE =
  "Invalid admin email or password.";

function redirectWithError(
  message: string
): never {
  redirect(
    `/login?error=${encodeURIComponent(message)}`
  );
}

export async function loginAction(
  formData: FormData
) {
  const configuredAdminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  if (!configuredAdminEmail) {
    throw new Error(
      "ADMIN_EMAIL is not configured."
    );
  }

  const email = String(
    formData.get("email") ?? ""
  )
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? ""
  );

  if (!email || !password) {
    redirectWithError(
      "Enter your email and password."
    );
  }

  if (email !== configuredAdminEmail) {
    redirectWithError(
      INVALID_LOGIN_MESSAGE
    );
  }

  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  const authenticatedEmail =
    data.user?.email
      ?.trim()
      .toLowerCase();

  if (
    error ||
    authenticatedEmail !==
      configuredAdminEmail
  ) {
    if (data.user) {
      await supabase.auth.signOut();
    }

    redirectWithError(
      INVALID_LOGIN_MESSAGE
    );
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
