import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST (req: Request) {
  // Parse the request body
  const body = await req.json()
  const { leaveType, leaveReason, startDate, endDate } = body

  // Get the session
  const session = await auth()

  // Check if session exists and user ID is available
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: 'Unauthorized, please log in.' },
      { status: 401 }
    )
  }

  const userId = session.user.id // Get user ID from session

  // Validate inputs
  if (!leaveType || !leaveReason || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Some parameters are missing - create leave.' },
      { status: 400 }
    )
  }

  // Remove the time component by setting both dates to the same start of the day (e.g., midnight).
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  // Validate dates (only dates are compared, ignoring time)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return NextResponse.json({ error: 'Invalid date range.' }, { status: 400 })
  }

  try {
    // Create leave entry in the database
    const leave = await prisma.leave.create({
      data: {
        userId,
        leaveType,
        leaveReason,
        startDate: start,
        endDate: end
      }
    })

    return NextResponse.json(leave, { status: 201 })
  } catch (error) {
    console.error('Error creating leave:', error)
    return NextResponse.json(
      { error: 'Error creating leave.' },
      { status: 500 }
    )
  }
}
