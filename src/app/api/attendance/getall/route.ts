import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all attendance records, including related User data if available
    const attendanceRecords = await prisma.attendance.findMany({
      include: {
        user: true, // Includes user data if available; can be null
      },
    });

    // Check if attendance records exist
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return NextResponse.json({ message: 'No attendance records found' }, { status: 404 });
    }

    // Filter out records where user is null, or handle them separately
    const filteredRecords = attendanceRecords.map(record => ({
      ...record,
      user: record.user ? record.user : { message: "No associated user" }, // Placeholder for missing user data
    }));

    // Return filtered records
    return NextResponse.json(filteredRecords, { status: 200 });
  } catch (error: any) {
    // Catch and log the error for debugging
    console.error("Error fetching attendance records:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
