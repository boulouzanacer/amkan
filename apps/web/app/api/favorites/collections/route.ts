import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { favoriteCollectionSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = favoriteCollectionSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const collection = await prisma.favoriteCollection.create({
    data: {
      ...payload.data,
      shareToken: payload.data.isShared ? crypto.randomUUID() : undefined
    }
  });
  return NextResponse.json(collection, { status: 201 });
}
