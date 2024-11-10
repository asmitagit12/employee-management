import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { taskId: string } }) {
    const { taskId } = params;
    const { status } = await request.json();

    // Validate required field
    if (!status) {
        return NextResponse.json(
            { message: 'Status is required' },
            { status: 400 }
        );
    }

    // Check for valid status value
    const validStatuses = ['pending', 'in_process', 'completed', 'delayed'];
    if (!validStatuses.includes(status)) {
        return NextResponse.json(
            { message: 'Invalid status value' },
            { status: 400 }
        );
    }

    try {
        console.log("Starting the update process for task ID:", taskId);

        // Check if the task exists
        const existingTask = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!existingTask) {
            return NextResponse.json(
                { message: 'Task not found' },
                { status: 404 }
            );
        }

        // Update only the status field of the task
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status },
        });

        return NextResponse.json(
            { message: 'Task status updated successfully', task: updatedTask },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error processing update request:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
