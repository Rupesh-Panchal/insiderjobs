// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: "https://eea70d70494fce7a65c78e67d876ab1f@o4510001867128832.ingest.us.sentry.io/4510001875451904",

    // Add integrations here
    integrations: [
        nodeProfilingIntegration(), // for profiling
        Sentry.mongooseIntegration(), // for mongoose DB monitoring
    ],

    // Send PII (like IP address, username) with events
    sendDefaultPii: true,
});
