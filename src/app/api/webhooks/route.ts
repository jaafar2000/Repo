// app/api/webhooks/route.ts
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    console.log("✅ Webhook verified:", evt.type, evt.data);

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}

// Block GET requests (important)
export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
