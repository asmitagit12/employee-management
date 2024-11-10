import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all leave records, including related User data
    const leaveRecords = await prisma.leave.findMany({
      include: {
        user: true, // Includes user data if available
      },
    });

    // Check if leave records exist
    if (!leaveRecords || leaveRecords.length === 0) {
      return NextResponse.json({ message: 'No leave records found' }, { status: 404 });
    }

    // Filter out records where user is null, or handle them separately
    const filteredRecords = leaveRecords.map(record => ({
      ...record,
      user: record.user ? record.user : { message: "No associated user" }, // Placeholder for missing user data
    }));

    // Return filtered leave records
    return NextResponse.json(filteredRecords, { status: 200 });
  } catch (error: any) {
    // Catch and log the error for debugging
    console.error("Error fetching leave records:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
