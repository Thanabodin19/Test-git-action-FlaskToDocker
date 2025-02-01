import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { roleBasedRoutes } from "./utils/rbac";

const publicRoutes = ["/", "/public", "/login"];

export async function middleware(request: NextRequest) {
  // Allow public paths like the login page, API routes, or static files
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!user && !isPublicRoute) {
    console.log("Not authenticate");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const userRole = user?.role;

  if (user && isPublicRoute) {
    if (userRole === "user")
      return NextResponse.redirect(new URL("/starter-chat", request.url));
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  const allowedRoutes =
    roleBasedRoutes[userRole as keyof typeof roleBasedRoutes] || [];
  const isAllowedRoute = allowedRoutes.some((route: string) =>
    path.startsWith(route)
  );

  if (!isAllowedRoute && userRole) {
    console.log(`Access denied for role: ${userRole} on path: ${path}`);
    return NextResponse.redirect(new URL("/", request.url));
  }

  // console.log(`Access granted for role: ${userRole} on path: ${path}`);

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
