import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const lastSync = await prisma.syncLog.findFirst({
      orderBy: { createdAt: "desc" },
    })

    if (!lastSync) {
      return NextResponse.json({
        lastSyncedAt: null,
        lastStatus: null,
        totalFetched: 0,
        inserted: 0,
        updated: 0,
      })
    }

    return NextResponse.json({
      lastSyncedAt: lastSync.createdAt,
      lastStatus: lastSync.status,
      totalFetched: lastSync.totalFetched,
      inserted: lastSync.inserted ?? 0,
      updated: lastSync.updated ?? 0,
    })
  } catch (error) {
    console.error("GET /api/sync/status ERROR:", error)

    return NextResponse.json(
      { message: "Failed to fetch sync status" },
      { status: 500 }
    )
  }
}