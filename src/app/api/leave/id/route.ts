import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  const { id } = await request.json()

  try {
    const leave = await prisma.leave.findUnique({
      where: { id },
      include: {
        user: true, 
      },
    })

    if (!leave) {
      return NextResponse.json(
        { message: 'Leave record doesnot exists' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ...leave }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ ...error })
  }
}