import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { reduceStockWorker } from "@/lib/inngestWorkers";

// Serves the background workers via an API path
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [reduceStockWorker],
});
