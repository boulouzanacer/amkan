import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const suggestions = [
  "Tipaza front de mer",
  "Marrakech Guéliz",
  "Ifrane montagne",
  "Bejaia plage",
  "Alger télétravail",
  "Oran centre-ville"
];

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  return NextResponse.json(
    suggestions
      .filter((item) => item.toLowerCase().includes(q) || q.length < 2)
      .slice(0, 6)
      .map((label) => ({ label, type: label.includes("plage") || label.includes("front") ? "point d'intérêt" : "quartier" }))
  );
}
