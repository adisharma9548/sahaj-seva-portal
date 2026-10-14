import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonField } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params;
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id: serviceId }, { code: serviceId }],
      },
      include: {
        documents: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    const enriched = {
      ...service,
      commonMistakes: parseJsonField<string[]>(service.commonMistakes, []),
      commonMistakesHi: parseJsonField<string[]>(service.commonMistakesHi, []),
      steps: parseJsonField<string[]>(service.stepsJson, []),
      carryDocs: parseJsonField<string[]>(service.carryDocsJson, []),
      documents: service.documents.map((d) => ({
        ...d,
        alternatives: parseJsonField<string[]>(d.alternativesJson, []),
        criteria: parseJsonField<Record<string, unknown>>(d.criteriaJson, {}),
      })),
    };

    return NextResponse.json({ success: true, service: enriched });
  } catch (error) {
    console.error("Error fetching single service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}
