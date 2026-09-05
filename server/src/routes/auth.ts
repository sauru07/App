import { Router } from "express";
import { randomInt } from "crypto";
import { query } from "../db";
import { signToken } from "../auth";
import { config } from "../config";

const router = Router();
const otpStore = new Map<string, { otp: string; expires: number }>();

router.post("/request-otp", async (req, res) => {
  const phone = String(req.body?.phone ?? "").trim();
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) return res.status(400).json({ error: "Use international phone format" });

  const otp = config.devOtp ? "123456" : String(randomInt(100000, 1000000));
  otpStore.set(phone, { otp, expires: Date.now() + config.otpTtl * 1000 });

  // Production: send OTP through a verified SMS provider. Never log OTPs.
  res.json({ ok: true, ...(config.devOtp ? { developmentOtp: otp } : {}) });
});

router.post("/verify-otp", async (req, res) => {
  const phone = String(req.body?.phone ?? "").trim();
  const otp = String(req.body?.otp ?? "").trim();
  const record = otpStore.get(phone);
  if (!record || record.expires < Date.now() || record.otp !== otp) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }
  otpStore.delete(phone);

  const phoneHash = phone; // Replace with HMAC/hash at rest in production.
  const result = await query<{ id: string }>(
    `INSERT INTO users (phone_number_hash, phone_verified)
     VALUES ($1, true)
     ON CONFLICT (phone_number_hash)
     DO UPDATE SET phone_verified=true, updated_at=now()
     RETURNING id`,
    [phoneHash]
  );

  res.json({ token: signToken({ id: result.rows[0].id }), userId: result.rows[0].id });
});

router.post("/refresh", (_req, res) => res.status(501).json({ error: "Use short-lived access + refresh token rotation in production" }));
router.post("/logout", (_req, res) => res.json({ ok: true }));

export default router;
