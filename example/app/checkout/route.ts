import { Checkout } from "@creem/nextjs";

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true,
});
