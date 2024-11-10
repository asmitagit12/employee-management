import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET comments for a specific task
export async function GET(request: Request) {
  const url = new URL(request.url);
  const taskId = url.searchParams.get('taskId'); // Get the taskId from query parameters

  if (!taskId) {
    return NextResponse.json({ message: 'taskId is required.' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        taskId: taskId, // Filter comments by taskId
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        task: {
          select: {
            title: true, // Include task title or any other necessary fields
          },
        },
      },
    });

    if (!comments || comments.length === 0) {
      return NextResponse.json({ message: 'No comments found for this task.' }, { status: 404 });
    }

    return NextResponse.json(comments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
