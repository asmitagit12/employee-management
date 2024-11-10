import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const today = new Date();
    const dateKey = today.toISOString().split("T")[0];

    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const timeOut = `${hours}:${minutes}`;

    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_date: { userId, date: dateKey },
      },
    });

    if (!attendance) {
      return NextResponse.json({ message: "Attendance record not found" }, { status: 404 });
    }

    // Check if timeIn is null before proceeding
    if (!attendance.timeIn) {
      return NextResponse.json({ message: "Time-in record is missing" }, { status: 400 });
    }

    const timeInParts = attendance.timeIn.split(':');
    const timeOutParts = timeOut.split(':');

    const timeInDate = new Date();
    timeInDate.setHours(parseInt(timeInParts[0]), parseInt(timeInParts[1]));

    const timeOutDate = new Date();
    timeOutDate.setHours(parseInt(timeOutParts[0]), parseInt(timeOutParts[1]));

    const totalMinutes = (timeOutDate.getTime() - timeInDate.getTime()) / (1000 * 60);
    const totalHours = (totalMinutes / 60).toFixed(2);

    // Update attendance record with totalHours as a string
    const updatedAttendance = await prisma.attendance.update({
      where: {
        userId_date: { userId, date: dateKey },
      },
      data: {
        timeOut,
        totalHours: totalHours.toString(), // Convert totalHours to string
        present: true,
      },
    });

    return NextResponse.json({
      message: "Check-out successful",
      attendance: updatedAttendance,
      totalHours: totalHours.toString(), // Return as string for consistency
    }, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unknown error occurred";
    console.error("Check-out error:", errorMessage);
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}
