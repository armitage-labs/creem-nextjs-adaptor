# @creem/nextjs

Official Creem integration for Next.js applications.

## Installation

npm install @creem/nextjs

# or

yarn add @creem/nextjs

# or

pnpm add @creem/nextjs

## Usage

### Server-side Checkout

import { Checkout } from "@creem/nextjs/server";

export const GET = Checkout({
apiKey: process.env.CREEM_API_KEY!,
testMode: process.env.NODE_ENV === "development",
defaultSuccessUrl: "/success",
});

### Client-side Component

import { CreemCheckout } from "@creem/nextjs/client";

export default function PricingPage() {
return (
<CreemCheckout
            productId="prod_abc123"
            units={1}
            successUrl="/thank-you"
        >
Buy Now
</CreemCheckout>
);
}

### Webhooks

import { Webhook } from "@creem/nextjs/server";

export const POST = Webhook({
webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
onCheckoutCompleted: async ({ product, customer }) => {
console.log(`${customer?.email} purchased ${product.name}`);
},
});

## License

MIT
