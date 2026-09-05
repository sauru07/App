# Security checklist

Before production:
- Use a reviewed E2EE protocol implementation; do not invent cryptography.
- Store private keys only on device, protected by Android Keystore where applicable.
- Authenticate and authorize every WebSocket event.
- Replace development OTP with a real SMS provider and anti-abuse controls.
- Hash/HMAC phone identifiers at rest with a properly managed secret.
- Add short-lived access tokens + rotating refresh tokens.
- Add rate limits, device/session revocation and anomaly detection.
- Encrypt media client-side before upload.
- Avoid plaintext notification previews for private chats.
- Define secure encrypted backup semantics; server must not receive backup keys in plaintext.
- Perform dependency scanning, SAST/DAST, penetration testing and an independent cryptographic/security review.
