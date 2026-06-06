import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = registerSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(payload.data.password, 12);
  try {
    const user = await prisma.user.create({
      data: {
        name: payload.data.name,
        email: payload.data.email,
        passwordHash,
        role: payload.data.role
      },
      select: { id: true, name: true, email: true, role: true }
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }
}
