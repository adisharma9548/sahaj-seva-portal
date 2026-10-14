import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonField } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        documents: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    const enriched = services.map((s) => ({
      ...s,
      commonMistakes: parseJsonField<string[]>(s.commonMistakes, []),
      commonMistakesHi: parseJsonField<string[]>(s.commonMistakesHi, []),
      steps: parseJsonField<string[]>(s.stepsJson, []),
      carryDocs: parseJsonField<string[]>(s.carryDocsJson, []),
      documents: s.documents.map((d) => ({
        ...d,
        alternatives: parseJsonField<string[]>(d.alternativesJson, []),
        criteria: parseJsonField<Record<string, unknown>>(d.criteriaJson, {}),
      })),
    }));

    return NextResponse.json({ success: true, services: enriched });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
