<div align="center">
  <h1>@creem_io/nextjs</h1>
  <p>The simplest way to integrate Creem payments into your Next.js application.</p>
  <p>Build beautiful checkout experiences with React components, handle webhooks with ease, and manage subscriptions without the headache.</p>
  
  <a href="#installation">Installation</a> · 
  <a href="#quick-start">Quick Start</a> · 
  <a href="#documentation">Documentation</a> · 
  <a href="#examples">Examples</a>
</div>

---

## Introduction

`@creem_io/nextjs` is the official Next.js integration for [Creem](https://creem.io) - a modern payment platform. This library provides:

- 🎨 **React Components** - Drop-in components for checkout and customer portal
- 🔐 **Type-Safe** - Full TypeScript support with comprehensive type definitions
- ⚡ **Zero Config** - Works out of the box with Next.js App Router
- 🪝 **Webhook Management** - Simple, type-safe webhook handlers with automatic verification
- 🔄 **Subscription Lifecycle** - Built-in access management for subscription-based products
- 🎯 **Developer Experience** - Intuitive API design with great DX

## Why?

Building payment integrations shouldn't be complicated. Most payment libraries require you to:

- Manage complex checkout flows
- Handle webhook signatures manually
- Write boilerplate for subscription management
- Deal with type inconsistencies

`@creem_io/nextjs` solves these problems by providing a seamless, type-safe integration that follows Next.js conventions and handles the complex parts for you.

---

## Installation

Install the package using your preferred package manager:

#### npm

```bash
npm install @creem_io/nextjs -E
```

#### yarn

```bash
yarn add @creem_io/nextjs -E
```

#### pnpm

```bash
pnpm install @creem_io/nextjs -E
```

### Requirements

- Next.js 13.0.0 or higher (App Router)
- React 18.0.0 or higher
- A [Creem account](https://creem.io) with API keys

---

## Quick Start

### 1. Set up your environment variables

Create a `.env.local` file in your project root:

```bash
CREEM_API_KEY=your_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here
```

### 2. Create a checkout route

Create `app/checkout/route.ts`:

```typescript
import { Checkout } from "@creem_io/nextjs";

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true, // Set to false for production
});
```

### 3. Add a checkout button to your page

In your `app/page.tsx` or any client component:

```typescript
"use client";

import { CreemCheckout } from "@creem_io/nextjs";

export default function Page() {
  return (
    <CreemCheckout productId="prod_abc123" successUrl="/thank-you">
      <button className="btn-primary">Subscribe Now</button>
    </CreemCheckout>
  );
}
```

### 4. Handle webhooks

Create `app/api/webhook/creem/route.ts`:

```typescript
import { Webhook } from "@creem_io/nextjs";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  onCheckoutCompleted: async ({ customer, product }) => {
    console.log(`${customer.email} purchased ${product.name}`);
  },

  onGrantAccess: async ({ reason, customer, metadata }) => {
    const userId = metadata?.referenceId as string;
    // Grant user access to your platform
  },

  onRevokeAccess: async ({ reason, customer, metadata }) => {
    const userId = metadata?.referenceId as string;
    // Revoke user access from your platform
  },
});
```

That's it! You now have a working payment integration in Next.js. 🎉

---

## Documentation

### Client Components

#### `<CreemCheckout />`

A React component that creates a checkout link. When clicked, redirects users to your checkout route handler which creates a Creem checkout session.

```typescript
import { CreemCheckout } from "@creem_io/nextjs";

<CreemCheckout
  productId="prod_abc123"
  units={2}
  discountCode="SUMMER2024"
  customer={{
    email: "user@example.com",
    name: "John Doe",
  }}
  successUrl="/thank-you"
  metadata={{
    orderId: "12345",
    source: "web",
  }}
  referenceId="user_123"
>
  <button>Buy Now</button>
</CreemCheckout>;
```

**Props:**

| Prop           | Type        | Required | Description                                     |
| -------------- | ----------- | -------- | ----------------------------------------------- |
| `productId`    | `string`    | ✅       | The Creem product ID from your dashboard        |
| `units`        | `number`    | ❌       | Number of units to purchase (default: 1)        |
| `discountCode` | `string`    | ❌       | Discount code to apply                          |
| `customer`     | `object`    | ❌       | Pre-fill customer information (`email`, `name`) |
| `successUrl`   | `string`    | ❌       | URL to redirect after successful payment        |
| `metadata`     | `object`    | ❌       | Custom metadata to attach to the checkout       |
| `referenceId`  | `string`    | ❌       | Your internal user/order ID                     |
| `children`     | `ReactNode` | ❌       | Custom button or link content                   |

---

#### `<CreemPortal />`

A React component that creates a customer portal link for managing subscriptions, payment methods, and billing history.

```typescript
import { CreemPortal } from "@creem_io/nextjs";

<CreemPortal
  customerId="cust_abc123"
  returnUrl="/dashboard"
  className="btn-secondary"
>
  Manage Subscription
</CreemPortal>;
```

**Props:**

| Prop         | Type                | Required | Description                                                |
| ------------ | ------------------- | -------- | ---------------------------------------------------------- |
| `customerId` | `string`            | ✅       | The Creem customer ID                                      |
| `returnUrl`  | `string`            | ❌       | URL to return to after portal session                      |
| `children`   | `ReactNode`         | ❌       | Custom button or link content                              |
| ...linkProps | `HTMLAnchorElement` | ❌       | Any standard anchor tag props (`className`, `style`, etc.) |

---

### Server Functions

#### `Checkout(options)`

Creates a Next.js route handler for checkout sessions.

```typescript
import { Checkout } from "@creem_io/nextjs";

// app/checkout/route.ts
export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true,
  defaultSuccessUrl: "/success",
});
```

**Options:**

| Option              | Type      | Required | Description                                      |
| ------------------- | --------- | -------- | ------------------------------------------------ |
| `apiKey`            | `string`  | ✅       | Your Creem API key                               |
| `testMode`          | `boolean` | ❌       | Use test environment (default: `false`)          |
| `defaultSuccessUrl` | `string`  | ❌       | Default success URL if not provided in component |

---

#### `Portal(options)`

Creates a Next.js route handler for customer portal sessions.

```typescript
import { Portal } from "@creem_io/nextjs";

// app/portal/route.ts
export const GET = Portal({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true,
});
```

**Options:**

| Option     | Type      | Required | Description                             |
| ---------- | --------- | -------- | --------------------------------------- |
| `apiKey`   | `string`  | ✅       | Your Creem API key                      |
| `testMode` | `boolean` | ❌       | Use test environment (default: `false`) |

---

#### `Webhook(options)`

Creates a Next.js route handler for processing Creem webhooks with automatic signature verification.

```typescript
import { Webhook } from "@creem_io/nextjs";

// app/api/webhook/creem/route.ts
export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  onCheckoutCompleted: async (data) => {
    // Handle one-time purchases
  },

  onGrantAccess: async (context) => {
    // Grant user access (subscription active/trialing/paid)
  },

  onRevokeAccess: async (context) => {
    // Revoke user access (subscription paused/expired)
  },
});
```

**Options:**

| Option                   | Type       | Required | Description                                          |
| ------------------------ | ---------- | -------- | ---------------------------------------------------- |
| `webhookSecret`          | `string`   | ✅       | Your Creem webhook secret for signature verification |
| `onCheckoutCompleted`    | `function` | ❌       | Called when checkout is completed                    |
| `onRefundCreated`        | `function` | ❌       | Called when refund is created                        |
| `onDisputeCreated`       | `function` | ❌       | Called when dispute is created                       |
| `onSubscriptionActive`   | `function` | ❌       | Called when subscription becomes active              |
| `onSubscriptionTrialing` | `function` | ❌       | Called when subscription is trialing                 |
| `onSubscriptionPaid`     | `function` | ❌       | Called when subscription payment succeeds            |
| `onSubscriptionExpired`  | `function` | ❌       | Called when subscription expires                     |
| `onSubscriptionCanceled` | `function` | ❌       | Called when subscription is canceled                 |
| `onSubscriptionUnpaid`   | `function` | ❌       | Called when subscription payment fails               |
| `onSubscriptionPastDue`  | `function` | ❌       | Called when subscription is past due                 |
| `onSubscriptionPaused`   | `function` | ❌       | Called when subscription is paused                   |
| `onSubscriptionUpdate`   | `function` | ❌       | Called when subscription is updated                  |
| `onGrantAccess`          | `function` | ❌       | Called when user should be granted access            |
| `onRevokeAccess`         | `function` | ❌       | Called when user access should be revoked            |

---

### Access Management

The `onGrantAccess` and `onRevokeAccess` callbacks provide a simple way to manage user access for subscription-based products.

#### `onGrantAccess`

Called when a user should be granted access. This happens when:

- Subscription becomes **active** (after payment)
- Subscription enters **trialing** period (free trial)
- Subscription payment is **paid** (renewal)

```typescript
onGrantAccess: async ({ reason, customer, product, metadata }) => {
  const userId = metadata?.referenceId as string;

  // Grant access in your database
  await db.user.update({
    where: { id: userId },
    data: { subscriptionActive: true },
  });

  console.log(`Granted ${reason} to ${customer.email}`);
};
```

**Context Properties:**

```typescript
{
  reason: "subscription_active" | "subscription_trialing" | "subscription_paid";
  customer: {
    id: string;
    email: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
  };
  subscription: {
    id: string;
    status: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
  };
  metadata?: Record<string, unknown>;
}
```

#### `onRevokeAccess`

Called when a user's access should be revoked. This happens when:

- Subscription is **paused** (manually by user or admin)
- Subscription is **expired** (trial ended or canceled subscription period ended)

```typescript
onRevokeAccess: async ({ reason, customer, product, metadata }) => {
  const userId = metadata?.referenceId as string;

  // Revoke access in your database
  await db.user.update({
    where: { id: userId },
    data: { subscriptionActive: false },
  });

  console.log(`Revoked access (${reason}) from ${customer.email}`);
};
```

**Context Properties:**

```typescript
{
  reason: "subscription_paused" | "subscription_expired";
  customer: { /* same as onGrantAccess */ };
  product: { /* same as onGrantAccess */ };
  subscription: { /* same as onGrantAccess */ };
  metadata?: Record<string, unknown>;
}
```

> **⚠️ Important:** Both callbacks may be called multiple times for the same user/subscription. Always implement these as **idempotent operations** (safe to call repeatedly).

---

## Examples

### Complete Subscription Flow

Here's a complete example of a subscription-based SaaS application:

**1. Environment Variables** (`.env.local`)

```bash
CREEM_API_KEY=sk_live_...
CREEM_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
```

**2. Checkout Route** (`app/checkout/route.ts`)

```typescript
import { Checkout } from "@creem_io/nextjs";

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: false,
  defaultSuccessUrl: "/dashboard",
});
```

**3. Portal Route** (`app/portal/route.ts`)

```typescript
import { Portal } from "@creem_io/nextjs";

export const GET = Portal({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: false,
});
```

**4. Webhook Handler** (`app/api/webhook/creem/route.ts`)

```typescript
import { Webhook } from "@creem_io/nextjs";
import { db } from "@/lib/db";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  onCheckoutCompleted: async ({ customer, product, order, metadata }) => {
    console.log(`Purchase completed: ${customer.email} bought ${product.name}`);

    // Store order in database
    await db.order.create({
      data: {
        userId: metadata?.referenceId as string,
        orderId: order.id,
        productId: product.id,
        amount: order.amount,
      },
    });
  },

  onGrantAccess: async ({
    reason,
    customer,
    product,
    subscription,
    metadata,
  }) => {
    const userId = metadata?.referenceId as string;

    // Update user subscription status
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "active",
        subscriptionId: subscription.id,
        creemCustomerId: customer.id,
        plan: product.name,
        subscriptionEndsAt: new Date(subscription.currentPeriodEnd * 1000),
      },
    });

    console.log(`✅ Access granted (${reason}) to ${customer.email}`);
  },

  onRevokeAccess: async ({ reason, customer, subscription, metadata }) => {
    const userId = metadata?.referenceId as string;

    // Revoke access
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "inactive",
        subscriptionEndsAt: new Date(subscription.currentPeriodEnd * 1000),
      },
    });

    console.log(`❌ Access revoked (${reason}) from ${customer.email}`);
  },

  onRefundCreated: async ({ refund, order, customer }) => {
    // Handle refund
    await db.order.update({
      where: { orderId: order.id },
      data: { refunded: true, refundAmount: refund.amount },
    });
  },
});
```

**5. Pricing Page** (`app/pricing/page.tsx`)

```typescript
"use client";

import { CreemCheckout } from "@creem_io/nextjs";
import { useSession } from "next-auth/react";

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Starter Plan */}
      <div className="border rounded-lg p-6">
        <h3 className="text-2xl font-bold">Starter</h3>
        <p className="text-4xl font-bold my-4">
          $29<span className="text-sm">/mo</span>
        </p>

        <CreemCheckout
          productId="prod_starter_123"
          customer={{
            email: session?.user?.email,
            name: session?.user?.name,
          }}
          referenceId={session?.user?.id}
          successUrl="/dashboard?welcome=true"
          metadata={{
            plan: "starter",
            source: "pricing_page",
          }}
        >
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Get Started
          </button>
        </CreemCheckout>
      </div>

      {/* Pro Plan */}
      <div className="border rounded-lg p-6">
        <h3 className="text-2xl font-bold">Pro</h3>
        <p className="text-4xl font-bold my-4">
          $99<span className="text-sm">/mo</span>
        </p>

        <CreemCheckout
          productId="prod_pro_456"
          customer={{
            email: session?.user?.email,
            name: session?.user?.name,
          }}
          referenceId={session?.user?.id}
          successUrl="/dashboard?welcome=true"
        >
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Get Started
          </button>
        </CreemCheckout>
      </div>
    </div>
  );
}
```

**6. Dashboard with Portal Link** (`app/dashboard/page.tsx`)

```typescript
import { CreemPortal } from "@creem_io/nextjs";
import { getCurrentUser } from "@/lib/auth";

export default async function Dashboard() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Plan: {user.plan}</p>
      <p>Status: {user.subscriptionStatus}</p>

      <CreemPortal
        customerId={user.creemCustomerId}
        returnUrl="/dashboard"
        className="btn-secondary"
      >
        Manage Subscription
      </CreemPortal>
    </div>
  );
}
```

---

### One-Time Payment

For one-time purchases (not subscriptions):

```typescript
"use client";

import { CreemCheckout } from "@creem_io/nextjs";

export default function ProductPage() {
  return (
    <div>
      <h1>Premium Course</h1>
      <p>One-time payment of $199</p>

      <CreemCheckout
        productId="prod_course_123"
        units={1}
        successUrl="/courses/premium/access"
        metadata={{
          courseId: "premium-nextjs-course",
          type: "one-time",
        }}
      >
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg">
          Buy Now - $199
        </button>
      </CreemCheckout>
    </div>
  );
}
```

Handle in webhook:

```typescript
onCheckoutCompleted: async ({ customer, product, order, metadata }) => {
  if (metadata?.type === "one-time") {
    // Grant lifetime access to course
    await db.courseAccess.create({
      data: {
        userId: metadata.referenceId as string,
        courseId: metadata.courseId as string,
        expiresAt: null, // lifetime access
      },
    });
  }
};
```

---

### Discount Codes

Apply discount codes to checkouts:

```typescript
<CreemCheckout
  productId="prod_abc123"
  discountCode="LAUNCH50"
  successUrl="/thank-you"
>
  <button>Subscribe with 50% off</button>
</CreemCheckout>
```

---

### Custom Metadata & Reference IDs

Track your internal IDs and custom data:

```typescript
<CreemCheckout
  productId="prod_abc123"
  referenceId={user.id} // Your user ID
  metadata={{
    orderId: generateOrderId(),
    source: "mobile_app",
    campaign: "summer_sale",
    affiliateId: "partner_123",
  }}
  successUrl="/thank-you"
>
  <button>Subscribe Now</button>
</CreemCheckout>
```

Access in webhooks:

```typescript
onCheckoutCompleted: async ({ metadata }) => {
  const { orderId, source, campaign, affiliateId } = metadata;
  // Use your custom data
};
```

---

## TypeScript Support

This library is written in TypeScript and provides comprehensive type definitions for all APIs.

### Webhook Event Types

All webhook callbacks receive fully-typed data:

```typescript
import type {
  FlatCheckoutCompleted,
  FlatRefundCreated,
  FlatSubscriptionEvent,
  GrantAccessContext,
  RevokeAccessContext,
} from "@creem_io/nextjs";

// Full autocomplete and type safety
onCheckoutCompleted: async (data: FlatCheckoutCompleted) => {
  data.customer.email; // ✅ string
  data.product.name; // ✅ string
  data.order.amount; // ✅ number
};
```

### Component Props

```typescript
import type { CreemPortalProps, CreateCheckoutInput } from "@creem_io/nextjs";
```

---

## Best Practices

### 1. Always Use Environment Variables

Never hardcode API keys or webhook secrets:

```typescript
// ✅ Good
apiKey: process.env.CREEM_API_KEY!;

// ❌ Bad
apiKey: "sk_live_abc123...";
```

### 2. Implement Idempotent Access Management

Access callbacks may be called multiple times. Always make them idempotent:

```typescript
// ✅ Good - idempotent
onGrantAccess: async ({ customer, metadata }) => {
  await db.user.upsert({
    where: { id: metadata.referenceId },
    update: { subscriptionActive: true },
    create: { id: metadata.referenceId, subscriptionActive: true },
  });
};

// ❌ Bad - not idempotent
onGrantAccess: async ({ customer, metadata }) => {
  await db.user.create({
    /* will fail on duplicate calls */
  });
};
```

### 3. Use Reference IDs

Always pass your internal user ID as `referenceId`:

```typescript
<CreemCheckout
  productId="prod_abc123"
  referenceId={session.user.id}
  // ...
/>
```

This allows you to easily map Creem customers to your users in webhooks.

### 4. Test in Test Mode

Always test your integration in test mode first:

```typescript
export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true, // Test mode
});
```

### 5. Handle Errors Gracefully

Webhook handlers should handle errors and return appropriate responses:

```typescript
onGrantAccess: async (context) => {
  try {
    await grantUserAccess(context);
  } catch (error) {
    console.error("Failed to grant access:", error);
    // Don't throw - webhook will retry
  }
};
```

---

## Webhook Configuration

### Setting Up Webhooks in Creem Dashboard

1. Go to your [Creem Dashboard](https://dashboard.creem.io)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add Endpoint**
4. Enter your webhook URL: `https://yourdomain.com/api/webhook/creem`
5. Select the events you want to receive
6. Copy the **Webhook Secret** to your `.env.local` file

### Testing Webhooks Locally

Use a tool like [ngrok](https://ngrok.com/) to expose your local server:

```bash
ngrok http 3000
```

Then use the ngrok URL in your Creem webhook settings:

```
https://abc123.ngrok.io/api/webhook/creem
```

---

## Migration Guide

### From Direct Creem SDK

If you're using the Creem SDK directly, migration is straightforward:

**Before:**

```typescript
import { Creem } from "creem";

const creem = new Creem({ apiKey: "..." });
const checkout = await creem.createCheckout({...});
```

**After:**

```typescript
import { Checkout } from "@creem_io/nextjs";

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
});
```

---

## Troubleshooting

### Webhooks Not Working

1. **Check webhook secret**: Ensure `CREEM_WEBHOOK_SECRET` is correct
2. **Verify URL**: Webhook URL must be publicly accessible
3. **Check logs**: Look for errors in your webhook handler
4. **Test signature**: Use Creem's webhook testing tool in the dashboard

### Checkout Redirect Not Working

1. **Verify API key**: Ensure `CREEM_API_KEY` is correct
2. **Check product ID**: Verify the product exists in your dashboard
3. **Test mode**: Ensure `testMode` matches your API key type
4. **Console errors**: Check browser console for JavaScript errors

### TypeScript Errors

If you're getting TypeScript errors, ensure you have the latest version:

```bash
npm install @creem_io/nextjs@latest -E
```

---

## FAQ

**Q: Do I need to set up CORS?**  
A: No, all API calls are made server-side through Next.js Route Handlers.

**Q: Can I use this with the Pages Router?**  
A: This library is designed for the App Router. For Pages Router, use the Creem SDK directly.

**Q: How do I handle refunds?**  
A: Use the `onRefundCreated` webhook callback to handle refund notifications.

**Q: Can I customize the checkout page?**  
A: The checkout page is hosted by Creem and customizable in your dashboard settings.

**Q: How do I test without real payments?**  
A: Use `testMode: true` and test API keys from your Creem dashboard.

**Q: Is this production-ready?**  
A: Yes! This library is used by production applications processing real payments.

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/creem-nextjs.git

# Install dependencies
npm install

# Build the library
npm run build

# Run example app
cd example
npm install
npm run dev
```

---

## Support

- 📧 **Email**: support@creem.io
- 💬 **Discord**: [Join our community](https://discord.gg/creem)
- 📚 **Documentation**: [docs.creem.io](https://docs.creem.io)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/creem-nextjs/issues)

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Authors

Built with ❤️ by the [Creem](https://creem.io) team.

---

<div align="center">
  <p>Made with ❤️ for the Next.js community</p>
  <p>
    <a href="https://creem.io">Website</a> · 
    <a href="https://docs.creem.io">Documentation</a> · 
    <a href="https://github.com/yourusername/creem-nextjs">GitHub</a>
  </p>
</div>
