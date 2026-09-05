import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 8080),
  databaseUrl: process.env.DATABASE_URL ?? "",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret",
  devOtp: process.env.DEV_OTP === "true",
  otpTtl: Number(process.env.OTP_TTL_SECONDS ?? 300)
};
