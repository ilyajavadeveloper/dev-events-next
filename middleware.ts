import { NextResponse } from "next/server";

export function middleware(req: Request) {
    const url = new URL(req.url);

    const protectedRoutes = [
        "/events/manage",
        "/events/create",
        "/events/",
        "/admin",
    ];

    const isProtected = protectedRoutes.some((route) =>
        url.pathname.startsWith(route)
    );

    if (!isProtected) return NextResponse.next();

    const cookie = req.headers.get("cookie") || "";
    const hasAccess = cookie.includes("admin_auth=true");

    if (!hasAccess) {
        return NextResponse.redirect(new URL("/admin-login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/events/:path*",
        "/admin/:path*",
        "/events/manage",
        "/events/create",
    ],
};
