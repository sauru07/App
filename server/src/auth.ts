import jwt from "jsonwebtoken";
import { config } from "./config";

export type AuthUser = { id: string };

export function signToken(user: AuthUser) {
  return jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: "30d" });
}

export function verifyToken(token: string): AuthUser {
  const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
  if (!decoded.sub || typeof decoded.sub !== "string") throw new Error("Invalid token");
  return { id: decoded.sub };
}
