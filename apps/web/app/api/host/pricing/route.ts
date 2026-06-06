import { NextResponse } from "next/server";
import { pricingSuggestionSchema } from "@/lib/validators";
import { buildSeoSuggestions, suggestPrice } from "@/lib/premium-data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = pricingSuggestionSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const suggestedPrice = suggestPrice(payload.data);
  return NextResponse.json({
    suggestedPrice,
    weekendPrice: Math.round(suggestedPrice * 1.18),
    seasonalRange: [Math.round(suggestedPrice * 0.82), Math.round(suggestedPrice * 1.35)],
    seoSuggestions: buildSeoSuggestions(payload.data.category, payload.data.city)
  });
}
