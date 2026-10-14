import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApplicationStatus, BookingStatus, Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tokenNumber,
      applicationId,
      durationMinutes = 2,
      isRepeatVisit = false,
      repeatReason = null,
      notes = "",
      officerName = "Anand Verma (Desk 3)",
      officeId = "OFF-TEH-SADAR",
    } = body;

    let app = null;
    let booking = null;

    if (tokenNumber) {
      booking = await prisma.booking.findFirst({
        where: { tokenNumber: tokenNumber.trim() },
      });
      if (booking) {
        app = await prisma.application.findUnique({
          where: { id: booking.applicationId },
        });
      }
    }

    if (!app && applicationId) {
      app = await prisma.application.findUnique({
        where: { id: applicationId },
      });
      booking = await prisma.booking.findFirst({
        where: { applicationId },
      });
    }

    if (!app) {
      return NextResponse.json(
        { success: false, error: "Application or Token not found" },
        { status: 404 }
      );
    }

    // Resolve an existing officer User to satisfy the foreign key constraint
    let officer = await prisma.user.findFirst({
      where: { role: Role.OFFICER },
    });
    if (!officer) {
      officer = await prisma.user.create({
        data: {
          email: "officer@seva.demo",
          name: officerName,
          role: Role.OFFICER,
        },
      });
    }

    // 1. Create Visit record
    const visit = await prisma.visit.create({
      data: {
        bookingId: booking?.id || null,
        applicationId: app.id,
        officerId: officer.id,
        officeId: app.officeId || officeId,
        durationMinutes: parseInt(String(durationMinutes), 10) || 2,
        isRepeatVisit: Boolean(isRepeatVisit),
        repeatReason: isRepeatVisit ? repeatReason : null,
        notes: notes || (isRepeatVisit ? `Repeat visit logged: ${repeatReason}` : "One-shot counter visit completed."),
      },
    });

    // 2. Update booking if exists
    if (booking) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.COMPLETED },
      });
    }

    // 3. Update application status
    const newStatus = isRepeatVisit
      ? ApplicationStatus.ACTION_REQUIRED
      : ApplicationStatus.VISIT_COMPLETED;

    const newStage = isRepeatVisit
      ? "Repeat Visit Logged - Citizen Re-submission Needed"
      : "Counter Visit Completed - Approved & Issued";

    await prisma.application.update({
      where: { id: app.id },
      data: {
        status: newStatus,
        currentStage: newStage,
        stuckReason: isRepeatVisit ? `Repeat visit required: ${repeatReason}` : null,
        stuckReasonHi: isRepeatVisit ? `पुनः दफ्तर आने का कारण: ${repeatReason}` : null,
      },
    });

    // 4. Create timeline event
    await prisma.applicationEvent.create({
      data: {
        applicationId: app.id,
        stage: isRepeatVisit ? "Repeat Visit Required" : "Counter Visit Completed",
        title: isRepeatVisit
          ? `Repeat Visit Required (${repeatReason})`
          : "Counter Visit Completed (Under 2 Min)",
        titleHi: isRepeatVisit
          ? `पुनः दफ्तर चक्कर दर्ज किया गया (${repeatReason})`
          : "काउंटर उपस्थिति पूर्ण (2 मिनट में निस्तारित)",
        description: isRepeatVisit
          ? `Citizen required to revisit due to: ${repeatReason}. Officer notes: ${notes}`
          : `Front-desk token ${booking?.tokenNumber || "N/A"} processed in ${durationMinutes} mins. All original checks matched.`,
        descriptionHi: isRepeatVisit
          ? `नागरिक को इस कारण दोबारा आना पड़ा: ${repeatReason}`
          : `टोकन ${booking?.tokenNumber || ""} मात्र ${durationMinutes} मिनट में सफलतापूर्वक निस्तारित हुआ।`,
        actorRole: "OFFICER",
        actorName: officerName,
        deskInfo: "Counter 3",
      },
    });

    // 5. Audit log
    await prisma.auditLog.create({
      data: {
        actorId: officer.id,
        actorName: officerName,
        actorRole: "OFFICER",
        action: isRepeatVisit ? "REPEAT_VISIT_LOGGED" : "VISIT_COMPLETED",
        entityType: "VISIT",
        entityId: visit.id,
        detailsJson: {
          tokenNumber: booking?.tokenNumber,
          trackingNumber: app.trackingNumber,
          isRepeatVisit,
          repeatReason,
          durationMinutes,
        },
      },
    });

    return NextResponse.json({
      success: true,
      visit,
      applicationId: app.id,
      trackingNumber: app.trackingNumber,
      isRepeatVisit,
    });
  } catch (error) {
    console.error("Counter mode error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process counter visit" },
      { status: 500 }
    );
  }
}
