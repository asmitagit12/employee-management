import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } } // Update to expect `id` instead of `userId`
) {
  console.log("Received params:", params); // Check the received params
  const userId = params.id; // Use `params.id` here

  // Check if userId is defined
  if (!userId) {
    console.error("User ID is missing in params.");
    return NextResponse.json(
      { error: "User ID is missing in the request parameters" },
      { status: 400 }
    );
  }

  try {
    // Fetch attendance records filtered by userId
    const attendances = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (attendances.length === 0) {
      return NextResponse.json(
        { message: 'No attendance records found for this user' },
        { status: 404 }
      );
    }

    return NextResponse.json(attendances, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
