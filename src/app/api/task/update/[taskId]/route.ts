import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { taskId: string } }) {
    const { taskId } = params; 
    const updatedData = await request.json();

    // Destructure the data from the request
    const { title, description, taskno, status, assignedTo, priority, duedate, projectname } = updatedData;

    // Validate required fields
    if (!title || !description || !taskno || !status || !assignedTo || !priority || !duedate || !projectname) {
        return NextResponse.json(
            { message: 'Some parameters are missing' },
            { status: 400 }
        );
    }

    if (!taskId) {
        return NextResponse.json(
            { message: 'Task ID is required' },
            { status: 400 }
        );
    }

    // Check for valid enum values
    const validStatuses = ['pending', 'in_process', 'completed', 'delayed'];
    const validPriorities = ['low', 'medium', 'high'];

    if (!validStatuses.includes(status)) {
        return NextResponse.json(
            { message: 'Invalid status value' },
            { status: 400 }
        );
    }

    if (!validPriorities.includes(priority)) {
        return NextResponse.json(
            { message: 'Invalid priority value' },
            { status: 400 }
        );
    }

    try {
        console.log("Starting the update process for task ID:", taskId);
        
        // Check if the task exists
        const existingTask = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!existingTask) {
            return NextResponse.json(
                { message: 'Task not found' },
                { status: 404 }
            );
        }

        // Update the task in the database
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                title,
                description,
                taskno,
                status,
                priority,
                duedate: new Date(duedate), // Convert to Date object if needed
                projectname,
                assignedTo: {
                    connect: { id: assignedTo } // Connect to existing user
                }
            }
        });

        return NextResponse.json(
            { message: 'Task updated successfully', task: updatedTask },
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
