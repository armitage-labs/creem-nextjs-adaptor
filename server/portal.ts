import { NextRequest, NextResponse } from "next/server";

interface PortalRouteInstance {
  apiKey: string;
  testMode?: boolean;
}

interface PortalResponse {
  customer_portal_link: string;
}

export const Portal = ({ apiKey, testMode = false }: PortalRouteInstance) => {
  const serverURL = testMode
    ? "https://test-api.creem.io"
    : "https://api.creem.io";

  return async (req: NextRequest) => {
    const customerId = req.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(`${serverURL}/v1/customers/billing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          customer_id: customerId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Creem API error: ${response.statusText} - ${errorText}`
        );
      }

      const portal = (await response.json()) as PortalResponse;

      // Redirect to the portal URL
      if (!portal.customer_portal_link) {
        return NextResponse.json(
          { error: "Portal URL not available" },
          { status: 500 }
        );
      }

      return NextResponse.redirect(portal.customer_portal_link);
    } catch (error) {
      console.error("Portal creation failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return NextResponse.json(
        {
          error: "Failed to create portal",
          details: errorMessage,
        },
        { status: 500 }
      );
    }
  };
};
