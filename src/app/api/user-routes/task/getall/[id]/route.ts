import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is missing in the request parameters" },
      { status: 400 }
    );
  }

  try {
    // Fetch tasks assigned to this user and include the assignedTo relation
    const tasks = await prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        assignedTo: true,
        createdBy:true // This will include the full assignedTo object
      },
      orderBy: { createdAt: 'desc' },
    });

    if (tasks.length === 0) {
      return NextResponse.json(
        { message: `No tasks found for user with ID ${userId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
