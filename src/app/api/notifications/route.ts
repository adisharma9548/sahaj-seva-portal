import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await prisma.notificationLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, notifications: logs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
