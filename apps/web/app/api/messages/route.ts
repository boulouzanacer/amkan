import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ travelerId: user.id }, { hostId: user.id }] },
    include: { messages: { orderBy: { createdAt: "asc" } }, listing: true, traveler: true, host: true }
  });
  return NextResponse.json(conversations);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

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
      senderId: user.id,
      body: payload.data.body
    }
  });

  return NextResponse.json(message, { status: 201 });
}
