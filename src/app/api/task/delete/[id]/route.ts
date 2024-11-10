import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/task/delete/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Get the task ID from the route parameters

  try {
    // Check if the task exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    // Delete the task from the database
    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
