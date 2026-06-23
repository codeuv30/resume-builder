import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export async function getCurrentUser() {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if(!token) throw new Error("Token not found");

    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
        throw new Error("Unauthorized");
    }

    return decoded.userId;
}