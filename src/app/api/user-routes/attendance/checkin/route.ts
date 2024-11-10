import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // Get the current date in "YYYY-MM-DD" format
    const today = new Date().toISOString().split("T")[0]

    // Get the current time in "HH:MM" format
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const timeIn = `${hours}:${minutes}`

    // Update or create the attendance record for the user and date
    const attendance = await prisma.attendance.upsert({
      where: {
        userId_date: { userId, date: today }, // Uses composite unique constraint
      },
      update: {
        timeIn,
        present: true,
      },
      create: {
        userId,
        date: today,
        timeIn,
        present: true,
      },
    })

    return NextResponse.json({ message: "Check-in successful", attendance }, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("Check-in error:", errorMessage)
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 })
  }
}
