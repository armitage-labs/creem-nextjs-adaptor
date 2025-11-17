import React from "react";
import { CreateCheckoutInput } from "./types";

export const CreemCheckout = ({
  productId,
  units,
  discountCode,
  customer,
  successUrl,
  metadata,
  referenceId,
  children = "Creem Checkout",
}: CreateCheckoutInput & { children?: React.ReactNode }) => {
  // Build query params from checkout input
  const params = new URLSearchParams();
  if (productId) params.append("productId", productId);
  if (units) params.append("units", units.toString());
  if (discountCode) params.append("discountCode", discountCode);
  if (customer) params.append("customer", JSON.stringify(customer));
  if (successUrl) params.append("successUrl", successUrl);
  if (metadata) params.append("metadata", JSON.stringify(metadata));
  if (referenceId) params.append("referenceId", referenceId);

  const href = `/checkout?${params.toString()}`;

  return <a href={href}>{children}</a>;
};

export interface CreemPortalProps {
  /**
   * The Creem customer ID to create a portal session for.
   * @required
   * @example "cust_abc123"
   */
  customerId: string;

  children?: React.ReactNode;
}

export const CreemPortal = ({
  customerId,
  children = "Portal",
  ...linkProps
}: CreemPortalProps & Omit<React.ComponentProps<"a">, "href">) => {
  const params = new URLSearchParams();
  if (customerId) params.append("customerId", customerId);

  const href = `/portal?${params.toString()}`;

  return (
    <a href={href} {...linkProps}>
      {children}
    </a>
  );
};
