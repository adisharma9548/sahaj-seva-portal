import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, status, issues = [], officerNotes = "", officerName = "Anand Verma (Desk 3)" } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: "applicationId and status are required" },
        { status: 400 }
      );
    }

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    let newStage = "Documents Verified";
    let eventTitle = "Documents Scrutiny Passed";
    let eventTitleHi = "दस्तावेज जांच स्वीकृत";
    let eventDesc = officerNotes || "Officer verified uploaded documents. File marked complete.";
    let eventDescHi = "अधिकारी द्वारा दस्तावेजों की जांच कर स्वीकृति दी गई।";

    if (status === "ACTION_REQUIRED") {
      newStage = "Action Required by Citizen";
      eventTitle = "Clarification / Document Correction Requested";
      eventTitleHi = "दस्तावेज सुधार की आवश्यकता";
      eventDesc = officerNotes || issues.join("; ") || "Defect flagged by front-desk officer.";
      eventDescHi = "दस्तावेज में त्रुटि पाई गई। कृपया सही दस्तावेज अपलोड करें।";
    } else if (status === "APPROVED") {
      newStage = "Ready / Issued";
      eventTitle = "Certificate Digitally Approved & Issued";
      eventTitleHi = "डिजिटली हस्ताक्षरित प्रमाण पत्र जारी";
      eventDesc = "Service fulfilled without requiring citizen to visit the office.";
      eventDescHi = "नागरिक को दफ्तर बुलाए बिना सेवा पूर्ण की गई।";
    } else if (status === "REJECTED") {
      newStage = "Application Rejected";
      eventTitle = "Application Ineligible / Rejected";
      eventTitleHi = "आवेदन अस्वीकृत";
      eventDesc = officerNotes || "Application rejected due to statutory ineligibility.";
      eventDescHi = "पात्रता नियमों के अनुकूल न होने के कारण आवेदन अस्वीकृत।";
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status,
        currentStage: newStage,
        stuckReason: status === "ACTION_REQUIRED" ? eventDesc : null,
        stuckReasonHi: status === "ACTION_REQUIRED" ? eventDescHi : null,
        actionRequiredDetails: status === "ACTION_REQUIRED" ? officerNotes : null,
      },
    });

    // Create event
    await prisma.applicationEvent.create({
      data: {
        applicationId,
        stage: newStage,
        title: eventTitle,
        titleHi: eventTitleHi,
        description: eventDesc,
        descriptionHi: eventDescHi,
        actorRole: "OFFICER",
        actorName: officerName,
        deskInfo: "Verification Counter 3",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: "demo-officer-id",
        actorName: officerName,
        actorRole: "OFFICER",
        action: `SCRUTINY_${status}`,
        entityType: "APPLICATION",
        entityId: applicationId,
        detailsJson: JSON.stringify({
          trackingNumber: app.trackingNumber,
          status,
          notes: officerNotes,
        }),
      },
    });

    // Simulated SMS
    await prisma.notificationLog.create({
      data: {
        recipientPhone: app.citizenPhone,
        recipientName: app.citizenName,
        channel: "SMS",
        title: `Sahaj Seva Status: ${eventTitle}`,
        message: `Namaste ${app.citizenName}, your application ${app.trackingNumber} status updated to: ${newStage}. Details: ${eventDesc}`,
        applicationId,
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Officer verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update verification" },
      { status: 500 }
    );
  }
}
