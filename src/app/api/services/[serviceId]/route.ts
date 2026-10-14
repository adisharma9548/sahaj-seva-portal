import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonField } from "@/lib/json-utils";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  const { serviceId } = params;

  try {
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
    // Zero-setup demo fallback
    if (process.env.DEMO_MODE === "true") {
      try {
        const filePath = path.join(process.cwd(), "data", "services.json");
        if (fs.existsSync(filePath)) {
          const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
          const matched = raw.find(
            (s: any) => s.id === serviceId || s.code === serviceId
          );
          if (matched) {
            return NextResponse.json({
              success: true,
              service: matched,
              isDemoFallback: true,
            });
          }
        }
      } catch (fallbackError) {
        console.error("Demo fallback error:", fallbackError);
      }
    }

    console.error("Error fetching single service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}
