import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    const [service, office, documents, events, booking] = await Promise.all([
      prisma.service.findUnique({ where: { id: application.serviceId } }),
      prisma.office.findUnique({ where: { id: application.officeId } }),
      prisma.applicationDocument.findMany({
        where: { applicationId: application.id },
      }),
      prisma.applicationEvent.findMany({
        where: { applicationId: application.id },
        orderBy: { timestamp: "asc" },
      }),
      prisma.booking.findFirst({
        where: { applicationId: application.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      application: {
        ...application,
        service: service
          ? {
              ...service,
              commonMistakes: JSON.parse(service.commonMistakes || "[]"),
              commonMistakesHi: JSON.parse(service.commonMistakesHi || "[]"),
              steps: JSON.parse(service.stepsJson || "[]"),
            }
          : null,
        office,
        documents: documents.map((d) => ({
          ...d,
          issues: JSON.parse(d.issuesJson || "[]"),
        })),
        events,
        booking,
      },
    });
  } catch (error) {
    console.error("Error fetching application details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
