import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function getAdminEmail() {
  return process.env.ADMIN_EMAIL
    ?.trim()
    .toLowerCase();
}

export async function updateSession(
  request: NextRequest
) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");
  const isLoginRoute = pathname === "/login";

  const adminEmail = getAdminEmail();
  const userEmail = user?.email
    ?.trim()
    .toLowerCase();

  const isAuthorizedAdmin =
    Boolean(user) &&
    Boolean(adminEmail) &&
    userEmail === adminEmail;

  if (isAdminRoute && !isAuthorizedAdmin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set(
      "next",
      pathname
    );

    if (user && !isAuthorizedAdmin) {
      loginUrl.searchParams.set(
        "error",
        "unauthorized"
      );
    }

    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isAuthorizedAdmin) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";

    return NextResponse.redirect(adminUrl);
  }

  return response;
}
