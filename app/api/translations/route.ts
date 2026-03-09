import { NextResponse } from "next/server";
import { languages } from "@/lib/translations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "en") as (typeof languages)[number]["code"];
  const def = await import("@/lib/translations");
  const bundle = (def as any).default ?? ({} as Record<string, any>);
  // Build a flat key->string map for the requested language if default export supports it
  const data: Record<string, string> = {};
  if (bundle && typeof bundle === "object") {
    for (const [key, value] of Object.entries(bundle)) {
      if (value && typeof value === "object" && lang in (value as any)) {
        data[key] = (value as any)[lang] as string;
      }
    }
  }
  return NextResponse.json({ lang, data });
}
