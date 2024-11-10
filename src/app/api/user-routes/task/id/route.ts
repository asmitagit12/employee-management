import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  const { id } = await request.json()

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } }
      }
    })

    if (!task) {
      return NextResponse.json(
        { message: 'Task doesnot exists' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ...task }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ ...error })
  }
}