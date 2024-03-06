import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  adminRoutes,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";
import { currentRole, currentUserId } from "./lib/auth";
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  const role = await currentRole();

  if (isAdminRoute && role !== "ADMIN") {
    return Response.redirect(new URL("/", nextUrl));
  }

  const userId = await currentUserId();

  if (nextUrl.pathname.startsWith("/money")) {
    const urlSuffix = nextUrl.pathname.split("/")[3];
    if (urlSuffix !== userId) {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
