import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verificationSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = verificationSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const verification = await prisma.hostVerification.upsert({
    where: { userId: payload.data.userId },
    update: {
      status: "PENDING",
      submittedAt: new Date(),
      documents: {
        create: payload.data.documents
      }
    },
    create: {
      userId: payload.data.userId,
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
