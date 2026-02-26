import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateNotFound } from "@/lib/articles/articles.helpers"

// Endpoint update data
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()

    const {
      title,
      sourceName,
      category,
      publishedAt,
      description,
      url,
    } = body

    // Validate required fields
    if (!title || !sourceName || !category || !publishedAt) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Ensure article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    })

    const notFoundCheck = validateNotFound(existingArticle)

    if (!notFoundCheck.valid) {
      return NextResponse.json(
        { message: notFoundCheck.message },
        { status: notFoundCheck.status }
      )
    }

    // If URL is being changed, check duplication
    if (url && url !== existingArticle?.url) {
      const duplicate = await prisma.article.findUnique({
        where: { url },
      })

      if (duplicate) {
        return NextResponse.json(
          { message: "Another article with this URL already exists" },
          { status: 400 }
        )
      }
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        sourceName,
        category,
        description,
        publishedAt: new Date(publishedAt),
        url: url ?? existingArticle?.url,
      },
    })

    return NextResponse.json({
      message: "Article updated successfully",
      data: updatedArticle,
    })
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("PUT /api/articles/[id] ERROR:", error)

    return NextResponse.json(
      { message: "Failed to update article" },
      { status: 500 }
    )
  }
}

// Endpoint delete data
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { message: "Invalid article ID" },
        { status: 400 }
      )
    }

    // Ensure article exists before deleting
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    })

    const notFoundCheck = validateNotFound(existingArticle)

    if (!notFoundCheck.valid) {
      return NextResponse.json(
        { message: notFoundCheck.message },
        { status: notFoundCheck.status }
      )
    }

    await prisma.article.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "Article deleted successfully",
    })
  } catch (error) {
    console.error("DELETE /api/articles/[id] ERROR:", error)

    return NextResponse.json(
      { message: "Failed to delete article" },
      { status: 500 }
    )
  }
}