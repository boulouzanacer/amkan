import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");
  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ travelerId: userId ?? "" }, { hostId: userId ?? "" }] },
    include: { messages: { orderBy: { createdAt: "asc" } }, listing: true, traveler: true, host: true }
  });
  return NextResponse.json(conversations);
}

export async function POST(request: Request) {
  const payload = messageSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });

  const conversationId =
    payload.data.conversationId ??
    (
      await prisma.conversation.create({
        data: {
          travelerId: payload.data.travelerId,
          hostId: payload.data.hostId,
          listingId: payload.data.listingId
        }
      })
    ).id;

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: payload.data.senderId,
      body: payload.data.body
    }
  });

  return NextResponse.json(message, { status: 201 });
}
