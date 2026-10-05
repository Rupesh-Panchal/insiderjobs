// api/webhooks.js
import { clerkWebhooks } from "../controller/webhooks.js";

export default async function handler(req, res) {
    if (req.method === "POST") {
        // Call your existing controller
        await clerkWebhooks(req, res);
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
