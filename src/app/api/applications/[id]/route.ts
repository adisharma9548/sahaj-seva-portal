import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonField } from "@/lib/json-utils";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const application = await prisma.application.findFirst({
      where: {
        OR: [{ id }, { trackingNumber: id }],
      },
      include: {
        service: true,
        office: true,
        documents: true,
        events: {
          orderBy: { timestamp: "asc" },
        },
        booking: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    const enriched = {
      ...application,
      service: application.service
        ? {
            ...application.service,
            commonMistakes: parseJsonField<string[]>(application.service.commonMistakes, []),
            commonMistakesHi: parseJsonField<string[]>(application.service.commonMistakesHi, []),
            steps: parseJsonField<string[]>(application.service.stepsJson, []),
            carryDocs: parseJsonField<string[]>(application.service.carryDocsJson, []),
          }
        : null,
      documents: application.documents.map((d) => ({
        ...d,
        issues: parseJsonField<string[]>(d.issuesJson, []),
      })),
    };

    return NextResponse.json({
      success: true,
      application: enriched,
    });
  } catch (error) {
    console.error("Error fetching application details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
