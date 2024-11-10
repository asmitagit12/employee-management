import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all tasks from the database, including full user details for assignedTo and createdBy
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            // Include any other properties needed for assignedTo
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            // Include any other properties needed for createdBy
          },
        },
      },
    });

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ message: 'No tasks found' }, { status: 404 });
    }

    // Format tasks to include full names
    const formattedTasks = tasks.map(task => ({
      ...task,
      assignedTo: task.assignedTo ? {
        ...task.assignedTo,
        fullName: `${task.assignedTo.firstName || ''} ${task.assignedTo.lastName || ''}`.trim(),
      } : null,
      createdBy: task.createdBy ? {
        ...task.createdBy,
        fullName: `${task.createdBy.firstName || ''} ${task.createdBy.lastName || ''}`.trim(),
      } : null,
    }));

    // Return the list of formatted tasks
    return NextResponse.json(formattedTasks, { status: 200 });
  } catch (error: any) {
    // Handle error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
