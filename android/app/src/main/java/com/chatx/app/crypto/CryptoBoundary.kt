package com.chatx.app.crypto

/**
 * Boundary for the production E2EE implementation.
 *
 * Do not replace this with home-grown crypto.
 * Integrate a reviewed, maintained messaging protocol/library here,
 * keep private identity/session keys in Android Keystore-backed storage,
 * and encrypt message/media payloads before they leave the device.
 */
interface CryptoEngine {
    fun encrypt(plaintext: ByteArray, recipient: String): ByteArray
    fun decrypt(ciphertext: ByteArray, sender: String): ByteArray
}
