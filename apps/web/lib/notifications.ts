import { prisma } from "@/lib/prisma";

export async function notifyUser(input: { userId: string; title: string; body: string; actionUrl?: string; channel?: "EMAIL" | "SMS" | "PUSH" | "IN_APP" }) {
  try {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        body: input.body,
        actionUrl: input.actionUrl,
        channel: input.channel ?? "IN_APP"
      }
    });
  } catch {
    // Notifications should not block the commercial flow.
  }
}
