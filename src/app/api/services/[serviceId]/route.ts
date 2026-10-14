import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    const documents = await prisma.serviceDocument.findMany({
      where: { serviceId: service.id },
      orderBy: { order: "asc" },
    });

    const enriched = {
      ...service,
      commonMistakes: JSON.parse(service.commonMistakes || "[]"),
      commonMistakesHi: JSON.parse(service.commonMistakesHi || "[]"),
      steps: JSON.parse(service.stepsJson || "[]"),
      carryDocs: JSON.parse((service as any).carryDocsJson || "[]"),
      processType: (service as any).processType || (service.physicalVisitRequired ? "SEMI_ONLINE" : "ONLINE"),
      documents: documents.map((d) => ({
        ...d,
        alternatives: JSON.parse(d.alternativesJson || "[]"),
        criteria: JSON.parse(d.criteriaJson || "{}"),
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
