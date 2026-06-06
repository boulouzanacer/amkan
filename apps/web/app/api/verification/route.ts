import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verificationSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const reviewSchema = z.object({
  userId: z.string(),
  status: z.enum(["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"]),
  notes: z.string().optional()
});

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get("userId");
  const userId = user.role === "ADMIN" && requestedUserId ? requestedUserId : user.id;

  const verification = await prisma.hostVerification.findUnique({
    where: { userId },
    include: { documents: { orderBy: { createdAt: "desc" } } }
  });
  return NextResponse.json(verification);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const payload = verificationSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }
  if (!payload.data.documents.length) {
    return NextResponse.json({ error: "At least one document is required" }, { status: 400 });
  }

  const verification = await prisma.hostVerification.upsert({
    where: { userId: user.id },
    update: {
      status: "PENDING",
      submittedAt: new Date(),
      documents: {
        create: payload.data.documents
      }
    },
    create: {
      userId: user.id,
      status: "PENDING",
      submittedAt: new Date(),
      documents: {
        create: payload.data.documents
      }
    },
    include: { documents: true }
  });
  return NextResponse.json(verification, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Admin role required" }, { status: 403 });

  const payload = reviewSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });

  const verification = await prisma.hostVerification.update({
    where: { userId: payload.data.userId },
    data: {
      status: payload.data.status,
      notes: payload.data.notes,
      reviewedAt: new Date(),
      documents: { updateMany: { where: {}, data: { status: payload.data.status } } }
    },
    include: { documents: true, user: true }
  });
  await notifyUser({
    userId: payload.data.userId,
    title: "Vérification mise à jour",
    body: `Votre dossier KYC est maintenant ${verification.status}.`,
    actionUrl: "/verification"
  });

  return NextResponse.json(verification);
}
