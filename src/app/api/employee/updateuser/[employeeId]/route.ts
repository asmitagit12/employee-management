import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { employeeId: string } }) {
  const { employeeId } = params; // Correctly retrieve 'employeeId'
  const { firstName, lastName, email, mobile, designation, password } = await request.json();

  if (!employeeId) {
    return NextResponse.json(
      { message: 'User ID is missing' },
      { status: 400 }
    );
  }

  try {
    console.log("Starting the update process for user ID:", employeeId);
    
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: employeeId } // Assuming 'id' is the primary key for your user
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check for email or mobile number conflicts
    const userWithSameEmailOrMobile = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: employeeId } }, // Exclude the current user
          {
            OR: [
              { email },
              { mobile }
            ]
          }
        ]
      }
    });

    if (userWithSameEmailOrMobile) {
      return NextResponse.json(
        { message: 'Email or mobile number is already in use' },
        { status: 409 }
      );
    }

    // Optionally hash the password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

    // Update the user in the database
    await prisma.user.update({
      where: { id: employeeId },
      data: {
        firstName,
        lastName,
        email,
        mobile,
        designation,
        password: hashedPassword // Only update if a new password is provided
      }
    });

    return NextResponse.json(
      { message: 'User updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing update request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
