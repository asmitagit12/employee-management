// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// export async function POST(request: Request) {
//   const { comment, createdById, taskId } = await request.json();

//   try {
//     // Validate input
//     if (!comment || !createdById || !taskId) {
//       return NextResponse.json(
//         { message: 'Missing required fields: comment, createdById, taskId' },
//         { status: 400 }
//       );
//     }

//     // Create the new comment
//     const newComment = await prisma.comment.create({
//       data: {
//         comment,
//         createdBy: { connect: { id: createdById } }, // Connect to the user who created the comment
//         task: { connect: { id: taskId } }, // Connect to the task
//       },
//     });

//     return NextResponse.json(
//       { message: 'Comment created successfully', comment: newComment },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error('Error creating comment:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { comment, createdById, taskId } = await request.json();

  try {
    // Validate input
    if (!comment || !createdById || !taskId) {
      return NextResponse.json(
        { message: 'Missing required fields: comment, createdById, taskId' },
        { status: 400 }
      );
    }

    // Create the new comment
    const newComment = await prisma.comment.create({
      data: {
        comment,
        createdBy: { connect: { id: createdById } }, // Connect to the user who created the comment
        task: { connect: { id: taskId } }, // Connect to the task
      },
      include: {
        createdBy: { // Include user details
          select: {
            firstName: true,
            lastName: true,
            // Add other user fields if needed
          },
        },
      },
    });

    // Send response with user details included
    return NextResponse.json(
      { message: 'Comment created successfully', comment: newComment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
