import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/comments/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Get the comment ID from the route parameters

  try {
    // Check if the comment exists
    const existingComment = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Delete the comment from the database
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
