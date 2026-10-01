import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is missing."
    );
  }

  return url;
}

function getSupabasePublicKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error(
      "Supabase public key is missing."
    );
  }

  return key;
}

function copyResponseCookies(
  source: NextResponse,
  destination: NextResponse
): NextResponse {
  source.cookies.getAll().forEach((cookie) => {
    destination.cookies.set(cookie);
  });

  return destination;
}

export async function updateSession(
  request: NextRequest
) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options
              );
            }
          );

          Object.entries(headers).forEach(
            ([key, value]) => {
              supabaseResponse.headers.set(
                key,
                value
              );
            }
          );
        },
      },
    }
  );

  const { data, error } =
    await supabase.auth.getClaims();

  const emailClaim = data?.claims?.email;

  const signedInEmail =
    typeof emailClaim === "string"
      ? emailClaim.trim().toLowerCase()
      : "";

  const adminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase() ?? "";

  const isAdmin =
    !error &&
    adminEmail.length > 0 &&
    signedInEmail === adminEmail;

  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/admin") &&
    !isAdmin
  ) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/login";
    loginUrl.search = "";

    return copyResponseCookies(
      supabaseResponse,
      NextResponse.redirect(loginUrl)
    );
  }

  if (pathname === "/login" && isAdmin) {
    const adminUrl = request.nextUrl.clone();

    adminUrl.pathname = "/admin";
    adminUrl.search = "";

    return copyResponseCookies(
      supabaseResponse,
      NextResponse.redirect(adminUrl)
    );
  }

  return supabaseResponse;
}
