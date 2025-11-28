"use server";

import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "devadmin123";

export async function loginAdmin(password: string) {
    if (password !== ADMIN_PASSWORD) {
        return { success: false };
    }

    (await cookies()).set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return z{ success: true };
}
