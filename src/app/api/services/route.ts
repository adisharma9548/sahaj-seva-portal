import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });

    const serviceDocs = await prisma.serviceDocument.findMany({
      orderBy: { order: "asc" },
    });

    const docsByService = serviceDocs.reduce((acc, doc) => {
      if (!acc[doc.serviceId]) acc[doc.serviceId] = [];
      acc[doc.serviceId].push(doc);
      return acc;
    }, {} as Record<string, typeof serviceDocs>);

    const enriched = services.map((s) => ({
      ...s,
      commonMistakes: JSON.parse(s.commonMistakes || "[]"),
      commonMistakesHi: JSON.parse(s.commonMistakesHi || "[]"),
      steps: JSON.parse(s.stepsJson || "[]"),
      carryDocs: JSON.parse((s as any).carryDocsJson || "[]"),
      processType: (s as any).processType || (s.physicalVisitRequired ? "SEMI_ONLINE" : "ONLINE"),
      documents: (docsByService[s.id] || []).map((d) => ({
        ...d,
        alternatives: JSON.parse(d.alternativesJson || "[]"),
        criteria: JSON.parse(d.criteriaJson || "{}"),
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
