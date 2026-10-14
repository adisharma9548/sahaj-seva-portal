import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApplicationStatus, BookingStatus, NotificationChannel } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, slotId, citizenName, citizenPhone } = body;

    if (!applicationId || !slotId) {
      return NextResponse.json(
        { success: false, error: "applicationId and slotId are required" },
        { status: 400 }
      );
    }

    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return NextResponse.json(
        { success: false, error: "Slot not found" },
        { status: 404 }
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

    // Check if booking already exists
    const existing = await prisma.booking.findFirst({
      where: { applicationId },
    });

    const tokenSeq = Math.floor(100 + Math.random() * 899);
    const tokenNumber = `GZB-T${tokenSeq}`;

    const qrData = JSON.stringify({
      tokenNumber,
      trackingNumber: app.trackingNumber,
      citizenName: citizenName || app.citizenName,
      date: slot.date,
      timeSlot: slot.startTime,
      officeId: slot.officeId,
    });

    let booking;
    if (existing) {
      booking = await prisma.booking.update({
        where: { id: existing.id },
        data: {
          slotId: slot.id,
          tokenNumber,
          qrCodeData: qrData,
          date: slot.date,
          timeSlot: slot.startTime,
          officeId: slot.officeId,
          status: BookingStatus.BOOKED,
        },
      });
    } else {
      booking = await prisma.booking.create({
        data: {
          applicationId: app.id,
          slotId: slot.id,
          tokenNumber,
          qrCodeData: qrData,
          date: slot.date,
          timeSlot: slot.startTime,
          officeId: slot.officeId,
          status: BookingStatus.BOOKED,
        },
      });
    }

    // Increment slot booked count
    await prisma.slot.update({
      where: { id: slot.id },
      data: {
        bookedCount: slot.bookedCount + 1,
      },
    });

    // Update application stage
    await prisma.application.update({
      where: { id: app.id },
      data: {
        status: ApplicationStatus.VISIT_SCHEDULED,
        currentStage: `Slot Booked: ${slot.date} at ${slot.startTime} (Token ${tokenNumber})`,
      },
    });

    // Create event
    await prisma.applicationEvent.create({
      data: {
        applicationId: app.id,
        stage: "Slot Booked",
        title: `Appointment Slot Reserved: Token ${tokenNumber}`,
        titleHi: `समय स्लॉट आरक्षित: टोकन ${tokenNumber}`,
        description: `Guaranteed 15-minute slot on ${slot.date} (${slot.startTime} - ${slot.endTime}). Carry your QR e-token.`,
        descriptionHi: `तय समय पर काउंटर पर उपस्थित हों। ई-टोकन क्यूआर साथ लाएं।`,
        actorRole: "CITIZEN",
        actorName: citizenName || app.citizenName,
        deskInfo: "Online Slot Manager",
      },
    });

    // Send Simulated SMS
    await prisma.notificationLog.create({
      data: {
        recipientPhone: citizenPhone || app.citizenPhone,
        recipientName: citizenName || app.citizenName,
        channel: NotificationChannel.SMS,
        title: "Sahaj Seva Appointment Token",
        message: `Appointment Confirmed! Token: ${tokenNumber} on ${slot.date} at ${slot.startTime}. Your visit duration is guaranteed under 2 minutes. Show QR e-token at counter.`,
        applicationId: app.id,
      },
    });

    return NextResponse.json({
      success: true,
      booking,
      tokenNumber,
      qrData,
    });
  } catch (error) {
    console.error("Error booking slot:", error);
    return NextResponse.json(
      { success: false, error: "Failed to book slot" },
      { status: 500 }
    );
  }
}
