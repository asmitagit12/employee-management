import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is missing in the request parameters" },
      { status: 400 }
    );
  }

  try {
    const leaves = await prisma.leave.findMany({
      where: { userId },
      include: {
        user: true, // Optional: Include user details
      },
      orderBy: { createdAt: 'desc' },
    });

    if (leaves.length === 0) {
      return NextResponse.json(
        { message: `No leaves found for user with ID ${userId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(leaves, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching leaves:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
