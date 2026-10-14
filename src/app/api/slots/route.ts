import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const officeId = searchParams.get("officeId");
    const date = searchParams.get("date");

    const where: any = {};
    if (officeId && officeId !== "ALL") where.officeId = officeId;
    if (date) where.date = date;

    const slots = await prisma.slot.findMany({
      where,
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      take: 50,
    });

    const offices = await prisma.office.findMany();
    const officeMap = new Map(offices.map((o) => [o.id, o]));

    const enriched = slots.map((s) => ({
      ...s,
      office: officeMap.get(s.officeId),
      availableSpots: Math.max(0, s.capacity - s.bookedCount),
      estimatedWaitMins: Math.max(3, s.bookedCount * 2), // 2 mins per citizen in fast counter mode
    }));

    return NextResponse.json({ success: true, slots: enriched, offices });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
