# ChatX

Production-oriented Android + Node.js/TypeScript starter for a secure messaging platform.

## Included
- Android Kotlin + Jetpack Compose UI shell
- Mobile-number OTP authentication API (development OTP mode included)
- Node.js + TypeScript REST API
- WebSocket realtime gateway
- PostgreSQL schema/migrations
- Redis configuration
- Docker Compose
- E2EE-ready crypto boundary on Android
- Chat, contacts, groups, messages, reactions, devices and privacy API structure

## Important
This repository is a strong implementation foundation, not a claim of independently audited cryptographic security.
Do not ship an E2EE messenger to production until the cryptographic protocol/library integration, key management, push privacy, backups, metadata handling, abuse controls and infrastructure have undergone security review.

## Run backend
1. Copy `.env.example` to `.env`
2. `docker compose up -d postgres redis`
3. `cd server && npm install`
4. `npm run dev`

API: `http://localhost:8080`
WebSocket: `ws://localhost:8080/ws`

Development OTP is returned by the API when `DEV_OTP=true`.

## Android
Open `android/` in Android Studio and run the app on an emulator/device.
Set `BASE_URL` in `android/app/build.gradle.kts` for your environment.

Default emulator backend URL: `http://10.0.2.2:8080/`

## Database
Run:
`psql "$DATABASE_URL" -f server/sql/001_init.sql`

The schema stores ciphertext, public key material and delivery metadata. Private keys must remain on client devices.
