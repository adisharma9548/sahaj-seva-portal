import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const officeId = searchParams.get("officeId");
    const date = searchParams.get("date");

    const where: Prisma.SlotWhereInput = {};
    if (officeId && officeId !== "ALL") where.officeId = officeId;
    if (date) where.date = date;

    const slots = await prisma.slot.findMany({
      where,
      include: {
        office: true,
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      take: 50,
    });

    const offices = await prisma.office.findMany({
      orderBy: { name: "asc" },
    });

    const enriched = slots.map((s) => ({
      ...s,
      availableSpots: Math.max(0, s.capacity - s.bookedCount),
      estimatedWaitMins: Math.max(3, s.bookedCount * 2),
    }));

    return NextResponse.json({ success: true, slots: enriched, offices });
  } catch (error) {
    // Zero-setup demo fallback
    if (process.env.DEMO_MODE === "true") {
      try {
        const officesPath = path.join(process.cwd(), "data", "offices.json");
        const offices = fs.existsSync(officesPath)
          ? JSON.parse(fs.readFileSync(officesPath, "utf8"))
          : [];

        const defaultSlots = [
          { id: "slot-1", startTime: "10:00 AM", endTime: "10:15 AM", capacity: 15, bookedCount: 4, isAvailable: true },
          { id: "slot-2", startTime: "10:15 AM", endTime: "10:30 AM", capacity: 15, bookedCount: 7, isAvailable: true },
          { id: "slot-3", startTime: "10:30 AM", endTime: "10:45 AM", capacity: 15, bookedCount: 2, isAvailable: true },
          { id: "slot-4", startTime: "11:00 AM", endTime: "11:15 AM", capacity: 15, bookedCount: 5, isAvailable: true },
          { id: "slot-5", startTime: "02:00 PM", endTime: "02:15 PM", capacity: 15, bookedCount: 3, isAvailable: true },
        ].map((s) => ({
          ...s,
          officeId: offices[0]?.code || "OFF-TEH-SADAR",
          date: new Date().toISOString().split("T")[0],
          office: offices[0],
          availableSpots: s.capacity - s.bookedCount,
          estimatedWaitMins: s.bookedCount * 2,
        }));

        return NextResponse.json({
          success: true,
          slots: defaultSlots,
          offices,
          isDemoFallback: true,
        });
      } catch (fallbackError) {
        console.error("Demo fallback error:", fallbackError);
      }
    }

    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
