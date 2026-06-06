import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { listingId: string } }) {
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amkan//Availability//FR",
    "BEGIN:VEVENT",
    `UID:${params.listingId}@amkan`,
    `DTSTAMP:${now}`,
    "SUMMARY:Calendrier Amkan",
    "DESCRIPTION:Exporter ce flux dans Google Calendar, Booking ou un autre outil iCal.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="amkan-${params.listingId}.ics"`
    }
  });
}
