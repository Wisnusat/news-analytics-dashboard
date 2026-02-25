import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateCreateArticle, validateDuplicateUrl } from "@/lib/articles/articles.helpers"

// Endpoint GET Data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Pagination defaults
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)

    // Filtering & search params
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category")
    const source = searchParams.get("source")

    // Sorting (default: updatedAt desc)
    const sort = searchParams.get("sort") || "updatedAt"
    const order = searchParams.get("order") === "asc" ? "asc" : "desc"

    const skip = (page - 1) * limit

    // Whitelist sortable fields to prevent invalid queries
    const allowedSortFields = [
      "updatedAt",
      "publishedAt",
      "title",
      "category",
      "sourceName",
    ]

    const sortField = allowedSortFields.includes(sort)
      ? sort
      : "updatedAt"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      }
    }

    if (category) {
      where.category = category
    }

    if (source) {
      where.sourceName = source
    }

    // Get total count for pagination metadata
    const total = await prisma.article.count({ where })

    // Fetch paginated articles
    const articles = await prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortField]: order,
      },
    })

    return NextResponse.json({
      data: articles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("GET /api/articles ERROR:", error)

    return NextResponse.json(
      { message: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

// Endpoint POST, create new article
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title, sourceName, category, publishedAt, description, url } = body

    // Basic validation
    const validation = validateCreateArticle({ title, sourceName, category, publishedAt })
    if (!validation.valid) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      )
    }

    let finalUrl = url

    // If user provides URL, check duplication
    if (finalUrl) {
      const existing = await prisma.article.findUnique({
        where: { url: finalUrl },
      })

      const duplicateCheck = validateDuplicateUrl(existing)

      if (duplicateCheck.valid === false) {
        return NextResponse.json(
          { message: duplicateCheck.message },
          { status: duplicateCheck.status }
        )
      }
    } else {
      // Generate synthetic unique URL for manual entry
      finalUrl = `manual-${crypto.randomUUID()}`
    }

    const newArticle = await prisma.article.create({
      data: {
        url: finalUrl,
        title,
        sourceName,
        category,
        description,
        publishedAt: new Date(publishedAt),
      },
    })

    return NextResponse.json({
      message: "Article created successfully",
      data: newArticle,
    })
  } catch (error) {
    console.error("POST /api/articles ERROR:", error)

    // in case Prisma unique constraint throws error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { message: "Duplicate URL detected" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: "Failed to create article" },
      { status: 500 }
    )
  }
}

