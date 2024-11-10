// src/app/api/comments/route.ts

import prisma from "@/lib/prisma"; // Adjust the path according to your structure
import { NextResponse } from "next/server";

// DELETE comment by ID
export async function DELETE(request: Request) {
  try {
    // Get the comment ID from the request URL
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
      return NextResponse.json({ message: "Comment ID is required." }, { status: 400 });
    }

    // Delete the comment
    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json(deletedComment, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
