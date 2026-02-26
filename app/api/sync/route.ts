/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  filterValidArticles,
  dedupeArticles,
  countInsertUpdate,
} from "@/lib/sync/sync.helpers"

export async function POST() {
  const startTime = Date.now()

  try {
    const apiKey = process.env.NEWS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { message: "NEWS_API_KEY not configured" },
        { status: 500 }
      )
    }

    const categories = [
      "technology",
      "business",
      "health",
      "science",
      "sports",
    ]

    // Fetch all categories in parallel
    const responses = await Promise.all(
      categories.map((category) =>
        fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=50&apiKey=${apiKey}`
        )
      )
    )

    // Check if any request failed
    responses.forEach((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch from NewsAPI")
      }
    })

    const results = await Promise.all(responses.map((r) => r.json()))

    // Merge all articles and inject category
    const mergedArticles = results.flatMap((result, index) =>
      (result.articles || []).map((article: any) => ({
        ...article,
        category: categories[index],
      }))
    )

    // In-memory dedupe by URL
    const validArticles = filterValidArticles(mergedArticles)
    const uniqueArticles = dedupeArticles(validArticles)

    // Execute all upserts inside single transaction
    const resultsUpsert = await prisma.$transaction(
      uniqueArticles.map((item) =>
        prisma.article.upsert({
          where: { url: item.url },
          update: {
            sourceName: item.source?.name || "Unknown",
            author: item.author,
            title: item.title,
            description: item.description,
            category: item.category,
            publishedAt: new Date(item.publishedAt || "0000-01-01"),
          },
          create: {
            url: item.url || '',
            sourceName: item.source?.name || "Unknown",
            author: item.author,
            title: item.title || '',
            description: item.description,
            category: item.category || '',
            publishedAt: new Date(item.publishedAt || "0000-01-01"),
          },
        })
      )
    )

    // Count inserted vs updated AFTER transaction
    const { inserted, updated } = countInsertUpdate(resultsUpsert)

    const durationMs = Date.now() - startTime

    // Log sync result
    await prisma.syncLog.create({
      data: {
        totalFetched: mergedArticles.length,
        inserted,
        updated,
        status: "success",
      },
    })

    return NextResponse.json({
      message: "Multi-category sync completed",
      totalFetched: mergedArticles.length,
      uniqueProcessed: uniqueArticles.length,
      inserted,
      updated,
      categoriesSynced: categories.length,
      durationMs,
    })
  } catch (error) {
    console.error("SYNC ERROR:", error)

    await prisma.syncLog.create({
      data: {
        totalFetched: 0,
        inserted: 0,
        updated: 0,
        status: "failed",
      },
    })

    return NextResponse.json(
      { message: "Sync failed", error: String(error) },
      { status: 500 }
    )
  }
}