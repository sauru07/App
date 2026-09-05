import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth";

declare global {
  namespace Express { interface Request { userId?: string } }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const value = req.header("authorization");
  if (!value?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.userId = verifyToken(value.slice(7)).id;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
