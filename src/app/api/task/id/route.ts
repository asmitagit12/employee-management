// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

// // Fetch a single task by ID
// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const taskId = params.id;

//   try {
//     const task = await prisma.task.findUnique({
//       where: { id: taskId },
//       include: {
//         assignedTo: { select: { id: true, firstName: true, lastName: true } },
//         createdBy: { select: { id: true, firstName: true, lastName: true } },
//       },
//     });

//     if (!task) {
//       return NextResponse.json({ message: "Task not found" }, { status: 404 });
//     }

//     const formattedTask = {
//       ...task,
//       assignedTo: task.assignedTo
//         ? { ...task.assignedTo, fullName: `${task.assignedTo.firstName || ""} ${task.assignedTo.lastName || ""}`.trim() }
//         : null,
//       createdBy: task.createdBy
//         ? { ...task.createdBy, fullName: `${task.createdBy.firstName || ""} ${task.createdBy.lastName || ""}`.trim() }
//         : null,
//     };

//     return NextResponse.json(formattedTask, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

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
