import jwt from "jsonwebtoken";
import { createCombinedPayloadAtDepth } from "next/dist/server/app-render/instant-validation/instant-validation";
import { JWTPayload } from "@/types/user.types";

export const generateJWT = (payload: JWTPayload): string => {
    if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables.");

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export const verifyToken = (token: string) => {
    if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables.");

    return jwt.verify(token, process.env.JWT_SECRET);
}