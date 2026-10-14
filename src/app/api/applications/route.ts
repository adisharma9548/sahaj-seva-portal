import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApplicationStatus, DocStatus, NotificationChannel, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get("trackingNumber");
    const officeId = searchParams.get("officeId");
    const statusParam = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: Prisma.ApplicationWhereInput = {};

    if (trackingNumber) {
      where.trackingNumber = { contains: trackingNumber.trim() };
    }
    if (officeId && officeId !== "ALL") {
      where.officeId = officeId;
    }
    if (statusParam && statusParam !== "ALL") {
      if (Object.values(ApplicationStatus).includes(statusParam as ApplicationStatus)) {
        where.status = statusParam as ApplicationStatus;
      }
    }
    if (search) {
      where.OR = [
        { trackingNumber: { contains: search } },
        { citizenName: { contains: search } },
        { citizenPhone: { contains: search } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        service: true,
        office: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      citizenName,
      citizenPhone,
      citizenAadhaarLast4,
      officeId,
      visitReadyScore = 85,
      documents = [],
    } = body;

    if (!serviceId || !citizenName || !citizenPhone) {
      return NextResponse.json(
        { success: false, error: "Required fields missing" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    const prefix = service ? service.code.split("-")[1] : "SEV";
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `GZB-${prefix}-2026-${randomSeq}`;

    const defaultOffice =
      officeId || (await prisma.office.findFirst())?.id || "OFF-TEH-SADAR";

    const initialStatus =
      visitReadyScore >= 70
        ? ApplicationStatus.SUBMITTED
        : ApplicationStatus.ACTION_REQUIRED;

    const application = await prisma.application.create({
      data: {
        trackingNumber,
        serviceId,
        citizenName,
        citizenPhone,
        citizenAadhaarLast4: (citizenAadhaarLast4 || "4819").slice(-4),
        officeId: defaultOffice,
        status: initialStatus,
        currentStage:
          initialStatus === ApplicationStatus.SUBMITTED
            ? "Submitted - Pre-check Passed"
            : "Action Required by Citizen",
        visitReadyScore,
        stuckReason:
          visitReadyScore < 70
            ? "Pre-check identified document defect. Citizen must replace before front-desk review."
            : null,
        stuckReasonHi:
          visitReadyScore < 70
            ? "पूर्व-जाँच में दस्तावेज में त्रुटि पाई गई है। कृपया सही दस्तावेज अपलोड करें।"
            : null,
        assignedOfficerName: "Desk 3 - Scrutiny Officer",
        estimatedCompletionDate: new Date(
          Date.now() + (service?.slaDays || 7) * 24 * 60 * 60 * 1000
        ),
      },
    });

    // Create events
    await prisma.applicationEvent.create({
      data: {
        applicationId: application.id,
        stage: "Submitted",
        title: "Application Submitted Online",
        titleHi: "आवेदन ऑनलाइन जमा किया गया",
        description: `Application submitted with Visit-Ready Score of ${visitReadyScore}%.`,
        descriptionHi: `आवेदन ${visitReadyScore}% तैयारी स्कोर के साथ सफलतापूर्वक दर्ज हुआ।`,
        actorRole: "CITIZEN",
        actorName: citizenName,
        deskInfo: "Citizen Portal",
      },
    });

    // Save documents
    for (const doc of documents) {
      const docStatus: DocStatus =
        doc.status && Object.values(DocStatus).includes(doc.status as DocStatus)
          ? (doc.status as DocStatus)
          : DocStatus.PASS;

      await prisma.applicationDocument.create({
        data: {
          applicationId: application.id,
          docCode: doc.docCode || "DOC-GEN",
          docName: doc.docName || "Uploaded Document",
          fileUrl: `/uploads/${trackingNumber}_${doc.docCode || "doc"}.pdf`,
          fileType: doc.fileType || "application/pdf",
          fileSizeKb: Math.round((doc.fileSize || 350000) / 1024),
          status: docStatus,
          issuesJson: doc.issues || [],
          simulatedAiScore: doc.score || 95,
        },
      });
    }

    // Send Simulated SMS Log
    await prisma.notificationLog.create({
      data: {
        recipientPhone: citizenPhone,
        recipientName: citizenName,
        channel: NotificationChannel.SMS,
        title: "Sahaj Seva Application Confirmation",
        message: `Namaste ${citizenName}! Your application ${trackingNumber} has been received with Visit-Ready Score ${visitReadyScore}%. Track status live at: /track?id=${trackingNumber}`,
        applicationId: application.id,
      },
    });

    return NextResponse.json({
      success: true,
      application,
      trackingNumber,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
