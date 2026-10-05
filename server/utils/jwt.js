import crypto from "crypto";

const getSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in .env");
    }

    return secret;
};

// Base64 URL encode
const base64UrlEncode = (value) => {
    return Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

// Base64 URL decode
const base64UrlDecode = (value) => {
    let base64 = value.replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4) {
        base64 += "=";
    }

    return Buffer.from(base64, "base64").toString("utf8");
};

// Create signature
const createSignature = (header, payload) => {
    const data = `${header}.${payload}`;

    return crypto.createHmac("sha256", getSecret()).update(data).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

// Generate JWT
export const generateToken = (userId) => {
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    const currentTime = Math.floor(Date.now() / 1000);

    const payload = {
        id: userId,
        iat: currentTime,
        exp: currentTime + 7 * 24 * 60 * 60,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));

    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = createSignature(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Verify JWT
export const verifyToken = (token) => {
    try {
        if (!token) {
            return null;
        }

        const parts = token.split(".");

        if (parts.length !== 3) {
            return null;
        }

        const [encodedHeader, encodedPayload, receivedSignature] = parts;

        const expectedSignature = createSignature(encodedHeader, encodedPayload);

        const receivedBuffer = Buffer.from(receivedSignature);

        const expectedBuffer = Buffer.from(expectedSignature);

        if (receivedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)) {
            return null;
        }

        const header = JSON.parse(base64UrlDecode(encodedHeader));

        if (header.alg !== "HS256" || header.typ !== "JWT") {
            return null;
        }

        const payload = JSON.parse(base64UrlDecode(encodedPayload));

        // Check expiration
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return payload;
    } catch (error) {
        console.error("JWT verification error:", error.message);

        return null;
    }
};
