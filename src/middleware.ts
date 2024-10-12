import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname === "/" ||
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/reset-password") ||
      url.pathname.startsWith("/forgot-password"))
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (
    !token &&
    (url.pathname.startsWith("/studio") ||
      url.pathname.startsWith("/@") ||
      url.pathname.startsWith("/home") ||
      url.pathname.startsWith("/setting"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && url.pathname.startsWith("/studio")) {
    const userId = url.pathname.split("/")[3];
    if (userId !== token._id) {
      return NextResponse.redirect(
        new URL("/studio/invalid-user", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/:path*",
    "/studio/:path*",
    "/home/:path*",
    "/setting/:path*",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/reset-password/:path*",
    "/forgot-password/:path*",
  ],
};
