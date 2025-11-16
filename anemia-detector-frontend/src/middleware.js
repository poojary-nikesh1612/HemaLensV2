import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

   

    if (token) {
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (!token) {
      if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/scan") ||
        pathname.startsWith("/campaign")
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/scan/:path*", "/campaign/:path*"],
};
