import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ travelerId: user.id }, { hostId: user.id }] },
    include: {
      messages: {
        include: { sender: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: "asc" }
      },
      listing: { select: { id: true, title: true } },
      traveler: { select: { id: true, name: true, role: true } },
      host: { select: { id: true, name: true, role: true } }
    },
    orderBy: { updatedAt: "desc" }
  });
  return NextResponse.json(conversations);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const payload = messageSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });

  let conversation = payload.data.conversationId
    ? await prisma.conversation.findUnique({
        where: { id: payload.data.conversationId },
        include: { listing: { select: { id: true, title: true } }, traveler: true, host: true }
      })
    : null;

  if (payload.data.conversationId && !conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (!conversation) {
    let travelerId = payload.data.travelerId;
    let hostId = payload.data.hostId;

    if (payload.data.listingId) {
      const listing = await prisma.listing.findUnique({ where: { id: payload.data.listingId }, select: { hostId: true } });
      if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      hostId = listing.hostId;
      travelerId = user.id === listing.hostId ? travelerId : user.id;
    }

    if (!travelerId || !hostId) {
      return NextResponse.json({ error: "Conversation participants required" }, { status: 400 });
    }

    const canCreate = user.role === "ADMIN" || user.id === travelerId || user.id === hostId;
    if (!canCreate) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    conversation =
      (await prisma.conversation.findFirst({
        where: {
          travelerId,
          hostId,
          ...(payload.data.listingId ? { listingId: payload.data.listingId } : { listingId: null })
        },
        include: { listing: { select: { id: true, title: true } }, traveler: true, host: true }
      })) ??
      (await prisma.conversation.create({
        data: {
          travelerId,
          hostId,
          listingId: payload.data.listingId
        },
        include: { listing: { select: { id: true, title: true } }, traveler: true, host: true }
      }));
  }

  const isParticipant = conversation.travelerId === user.id || conversation.hostId === user.id || user.role === "ADMIN";
  if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      body: payload.data.body
    },
    include: { sender: { select: { id: true, name: true, role: true } } }
  });
  await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });

  const recipientId = user.id === conversation.hostId ? conversation.travelerId : conversation.hostId;
  await notifyUser({
    userId: recipientId,
    title: "Nouveau message",
    body: `${user.name}: ${payload.data.body.slice(0, 120)}`,
    actionUrl: "/messages"
  });

  return NextResponse.json(message, { status: 201 });
}
