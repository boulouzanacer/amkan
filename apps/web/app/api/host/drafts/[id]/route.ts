import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { listingDraftSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const payload = listingDraftSchema.partial().safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const data: Prisma.ListingDraftUpdateInput = {
    currentStep: payload.data.currentStep,
    status: payload.data.status,
    payload: payload.data.payload as Prisma.InputJsonObject | undefined,
    preview: payload.data.preview as Prisma.InputJsonObject | undefined,
    missingFields: payload.data.missingFields as Prisma.InputJsonArray | undefined
  };

  const updated = await prisma.listingDraft.update({
    where: { id: params.id },
    data
  });
  return NextResponse.json(updated);
}
