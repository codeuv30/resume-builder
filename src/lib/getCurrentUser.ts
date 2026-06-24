// lib/getCurrentUser.ts
import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getCurrentUser(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Token not found");

  const decoded = verifyToken(token);

  if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
    throw new Error("Unauthorized");
  }

  return decoded.userId as string;
}