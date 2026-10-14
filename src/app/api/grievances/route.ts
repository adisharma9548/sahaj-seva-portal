import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GrievanceStatus, NotificationChannel } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const grievances = await prisma.grievance.findMany({
      include: {
        office: true,
        application: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, grievances });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch grievances" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      trackingNumber,
      citizenName,
      citizenPhone,
      issueCategory,
      description,
    } = body;

    let app = null;
    if (trackingNumber) {
      app = await prisma.application.findFirst({
        where: { trackingNumber: trackingNumber.trim() },
      });
    }

    const defaultOffice =
      app?.officeId || (await prisma.office.findFirst())?.id || "OFF-TEH-SADAR";

    const ticketSeq = Math.floor(100 + Math.random() * 899);
    const ticketNumber = `GRV-GZB-2026-${ticketSeq}`;

    const grievance = await prisma.grievance.create({
      data: {
        ticketNumber,
        applicationId: app?.id || null,
        citizenName: citizenName || app?.citizenName || "Concerned Citizen",
        citizenPhone: citizenPhone || app?.citizenPhone || "9999999999",
        officeId: defaultOffice,
        issueCategory: issueCategory || "Application stuck beyond SLA",
        description: description || "No update received on application.",
        status: GrievanceStatus.OPEN,
      },
    });

    // Notify Office Head via notification log
    await prisma.notificationLog.create({
      data: {
        recipientPhone: citizenPhone || "9999999999",
        recipientName: citizenName || "Citizen",
        channel: NotificationChannel.SMS,
        title: "Escalation Lodged to Office Head",
        message: `Your grievance ${ticketNumber} regarding file ${trackingNumber || ""} has been escalated to SDM / Office Head. Resolution deadline: 48 hours.`,
        applicationId: app?.id || null,
      },
    });

    return NextResponse.json({ success: true, grievance, ticketNumber });
  } catch (error) {
    console.error("Grievance submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit grievance" },
      { status: 500 }
    );
  }
}
