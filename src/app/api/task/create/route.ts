// src/app/api/task/create/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateTaskNo } from '@/helpers/taskNoGenerator'
import { auth } from '@/auth'

export async function POST (req: Request) {
  const body = await req.json()

  const { title, description, status, assignedTo, projectname, duedate } = body
  // Get the session
  const session = await auth()
  // Check if session exists and user ID is available
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: 'Unauthorized, please log in.' },
      { status: 401 }
    )
  } // Ensure this is coming from the request body
  const createdBy = session?.user?.id; // Get user ID from session

  // Validate inputs
  if (!title || !description || !assignedTo || !duedate || !projectname) {
    return NextResponse.json(
      { error: 'Some params are missing.' },
      { status: 400 }
    )
  }

  try {
    const taskNo = await generateTaskNo() // Generate task number dynamically

    const task = await prisma.task.create({
      data: {
        title,
        description,
        taskno: taskNo,
        status,
        assignedTo: {
          connect: {
            id: assignedTo // Assuming this is the employee ID
          }
        },
        createdBy: {
          connect: {
            id: createdBy // Ensure this ID is valid
          }
        },
        duedate: new Date(duedate), // Assuming this comes as a string from the client
        projectname: body.projectname, // Add other fields as necessary
        
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Error creating task.' }, { status: 500 })
  }
}
