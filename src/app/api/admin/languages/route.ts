import { NextRequest, NextResponse } from "next/server";
import { TRANSLATIONS, Language } from "@/data/translations";

export const dynamic = "force-dynamic";

const SUPPORTED_LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

function countLeafKeys(obj: any): number {
  let count = 0;
  if (!obj || typeof obj !== "object") return 0;
  for (const val of Object.values(obj)) {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      count += countLeafKeys(val);
    } else {
      count++;
    }
  }
  return count;
}

export async function GET() {
  try {
    const enTotal = countLeafKeys((TRANSLATIONS as any).en || {});

    const languageStats = SUPPORTED_LANGUAGES.map((lang) => {
      const langTrans = (TRANSLATIONS as any)[lang.code] || {};
      const keysCount = countLeafKeys(langTrans);
      const coverage = enTotal > 0 ? `${Math.min(100, Math.round((keysCount / enTotal) * 100))}%` : "100%";
      return {
        ...lang,
        totalKeys: keysCount,
        coverage,
        status: "Active",
      };
    });

    return NextResponse.json({
      success: true,
      languages: languageStats,
      translations: TRANSLATIONS,
    });
  } catch (error: any) {
    console.error("API GET /api/admin/languages error:", error);
    return NextResponse.json({ error: "Failed to fetch multilingual configuration." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { langCode, key, value } = body;

    if (!langCode || !key || value === undefined) {
      return NextResponse.json({ error: "langCode, key, and value are required." }, { status: 400 });
    }

    if (TRANSLATIONS[langCode as Language]) {
      if (key.includes(".")) {
        const parts = key.split(".");
        let current: any = TRANSLATIONS[langCode as Language];
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
      } else {
        (TRANSLATIONS[langCode as Language] as any)[key] = value;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Translation for key "${key}" in language "${langCode}" updated.`,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/languages error:", error);
    return NextResponse.json({ error: "Failed to update translation key." }, { status: 500 });
  }
}
