import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { listingDraftSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

function completionScore(payload: Record<string, unknown>, missingFields: string[]) {
  const expected = ["title", "city", "country", "pricePerNight", "guests", "description", "images", "guide"];
  const filled = expected.filter((field) => Boolean(payload[field])).length;
  return Math.max(0, Math.round((filled / expected.length) * 100) - missingFields.length * 3);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

  const drafts = await prisma.listingDraft.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
  return NextResponse.json(drafts);
}

export async function POST(request: Request) {
  const payload = listingDraftSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const draft = await prisma.listingDraft.create({
    data: {
      userId: payload.data.userId,
      currentStep: payload.data.currentStep,
      status: payload.data.status,
      payload: payload.data.payload as Prisma.InputJsonObject,
      preview: payload.data.preview as Prisma.InputJsonObject | undefined,
      missingFields: payload.data.missingFields as Prisma.InputJsonArray,
      completionScore: completionScore(payload.data.payload, payload.data.missingFields)
    }
  });
  return NextResponse.json(draft, { status: 201 });
}
