import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { commentId: string } }) {
    const { commentId } = params; // Ensure this matches the dynamic segment in the route
    const { comment, createdById, taskId } = await req.json();

    console.log("Received ID:", commentId); // Debugging output

    try {
        // Check if the comment exists
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            return NextResponse.json(
                { message: 'Comment not found' },
                { status: 404 }
            );
        }

        // Update the comment
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                comment,
                createdBy: { connect: { id: createdById } },
                task: { connect: { id: taskId } },
            },
            include: {
                createdBy: { // Ensure the createdBy info is included
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedComment, { status: 200 });
    } catch (error: any) {
        console.error('Error updating comment:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
