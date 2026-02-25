/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface CategoryDistributionItem {
  category: string
  count: number
}

interface DailyTrendItem {
  date: string
  count: number
}

interface RawDailyTrendItem {
  date: Date
  count: bigint
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")

    const from = fromParam
      ? new Date(fromParam)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const to = toParam ? new Date(toParam) : new Date()

    const where = {
      publishedAt: {
        gte: from,
        lte: to,
      },
    }

    // Run independent queries in parallel
    const [
      totalArticles,
      topCategoryResult,
      topSourceResult,
      latestArticle,
      lastSync,
      rawCategoryDistribution,
      rawDailyTrend,
    ] = await Promise.all([
      prisma.article.count({ where }),

      prisma.article.groupBy({
        by: ["category"],
        where,
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
        take: 1,
      }),

      prisma.article.groupBy({
        by: ["sourceName"],
        where,
        _count: { sourceName: true },
        orderBy: { _count: { sourceName: "desc" } },
        take: 1,
      }),

      prisma.article.findFirst({
        where,
        orderBy: { publishedAt: "desc" },
        select: { publishedAt: true },
      }),

      prisma.syncLog.findFirst({
        where: { status: "success" },
        orderBy: { createdAt: "desc" },
      }),

      prisma.article.groupBy({
        by: ["category"],
        where,
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
      }),

      prisma.$queryRaw<RawDailyTrendItem[]>`
        SELECT DATE("publishedAt") AS date,
               COUNT(*) AS count
        FROM "Article"
        WHERE "publishedAt" BETWEEN ${from} AND ${to}
        GROUP BY DATE("publishedAt")
        ORDER BY DATE("publishedAt") ASC
      `,
    ])

    const topCategory = topCategoryResult[0]
      ? {
          category: topCategoryResult[0].category,
          count: topCategoryResult[0]._count.category,
        }
      : null

    const topSource = topSourceResult[0]
      ? {
          sourceName: topSourceResult[0].sourceName,
          count: topSourceResult[0]._count.sourceName,
        }
      : null

    const categoryDistribution: CategoryDistributionItem[] =
      rawCategoryDistribution.map((item: any) => ({
        category: item.category,
        count: item._count.category,
      }))

    const dailyTrend: DailyTrendItem[] = rawDailyTrend.map((item: any) => ({
      date: item.date.toISOString().split("T")[0],
      count: Number(item.count),
    }))

    return NextResponse.json({
      summary: {
        totalArticles,
        topCategory,
        topSource,
        latestPublishedAt: latestArticle?.publishedAt || null,
        lastSyncedAt: lastSync?.createdAt || null,
      },
      charts: {
        categoryDistribution,
        dailyTrend,
      },
    })
  } catch (error) {
    console.error("GET /api/dashboard/summary ERROR:", error)

    return NextResponse.json(
      { message: "Failed to fetch dashboard summary" },
      { status: 500 }
    )
  }
}