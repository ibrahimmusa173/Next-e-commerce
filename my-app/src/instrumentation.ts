// src/instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // If the files are in the root (outside src)
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // If the files are in the root (outside src)
    await import('../sentry.edge.config');
  }
}