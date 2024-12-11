// import { headers } from "next/headers";
// import { WebhookReceiver } from "livekit-server-sdk";

// import { db } from "@/lib/db";

// const receiver = new WebhookReceiver(
//   process.env.LIVEKIT_API_KEY!,
//   process.env.LIVEKIT_API_SECRET!
// );

// export async function POST(req: Request) {
//   const body = await req.text();
//   const headerPayload = await headers();
//   const authorization = headerPayload.get("Authorization");

//   if (!authorization) {
//     return new Response("No authorization header", { status: 400 });
//   }

//   const event = receiver.receive(body, authorization);

//   if (event.event === "ingress_started") {
//     await db.stream.update({
//       where: {
//         ingressId: event.ingressInfo?.ingressId,
//       },
//       data: {
//         isLive: true,
//       },
//     });
//   }

//   if (event.event === "ingress_ended") {
//     await db.stream.update({
//       where: {
//         ingressId: event.ingressInfo?.ingressId,
//       },
//       data: {
//         isLive: false,
//       },
//     });
//   }
// }

import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";

import { db } from "@/lib/db";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headerPayload = await headers(); // Await headers
    const authorization = headerPayload.get("Authorization");

    if (!authorization) {
      return new Response("No authorization header", { status: 400 });
    }

    let event;
    try {
      event = receiver.receive(body, authorization);
    } catch (err) {
      return new Response("Invalid webhook signature", { status: 400 });
    }

    if (event.event === "ingress_started") {
      await db.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: true,
        },
      });
    } else if (event.event === "ingress_ended") {
      await db.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: false,
        },
      });
    }

    // Return success response for valid events
    return new Response("Webhook handled successfully", { status: 200 });

  } catch (error) {
    console.error("Error handling webhook:", error);
    // Return error response for unexpected errors
    return new Response("Internal Server Error", { status: 500 });
  }
}
