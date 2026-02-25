import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    // Ensure API key is available
    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { message: "NEWS_API_KEY not configured" },
        { status: 500 }
      )
    }

    // Get last successful sync
    const lastSync = await prisma.syncLog.findFirst({
      where: { status: "success" },
      orderBy: { createdAt: "desc" },
    })

    let fromDate: Date

    // sync 30 days back for the first sync, otherwise use the last sync date
    if (lastSync) {
      fromDate = lastSync.createdAt
    } else {
      fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }

    const from = fromDate.toISOString().split("T")[0]
    const to = new Date().toISOString().split("T")[0]

    const url = `https://newsapi.org/v2/everything?q=technology&from=${from}&to=${to}&sortBy=publishedAt&pageSize=100&apiKey=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch from NewsAPI")
    }

    const data = await response.json()
    const articles = data.articles || []

    let inserted = 0
    let updated = 0

    // upsert function to insert or update article
    // Prevent duplicate data using unique "url"
    for (const item of articles) {
      if (!item.url || !item.title || !item.publishedAt) continue

      const result = await prisma.article.upsert({
        where: { url: item.url },
        update: {
          sourceName: item.source?.name || "Unknown",
          author: item.author,
          title: item.title,
          description: item.description,
          category: "technology",
          publishedAt: new Date(item.publishedAt),
        },
        create: {
          url: item.url,
          sourceName: item.source?.name || "Unknown",
          author: item.author,
          title: item.title,
          description: item.description,
          category: "technology",
          publishedAt: new Date(item.publishedAt),
        },
      })

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        inserted++
      } else {
        updated++
      }
    }

    // log sync result
    await prisma.syncLog.create({
      data: {
        totalFetched: articles.length,
        inserted,
        updated,
        status: "success",
      },
    })

    return NextResponse.json({
      message: "Sync completed",
      totalFetched: articles.length,
      inserted,
      updated,
      from,
      to,
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