import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://484acd0a8129f1680a7a78d409099c68@o4511761614503936.ingest.de.sentry.io/4511761617453136",

  // This approach avoids the TypeScript "0 arguments" error
  // It looks at all default integrations and removes the MongoDB one
  integrations: (integrations) => {
    return integrations.filter((integration) => integration.name !== "Mongo");
  },

  // Define how likely traces are sampled.
  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  debug: false, 
});