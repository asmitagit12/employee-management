import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { firstName, lastName, email, mobile, designation } = await request.json();

  try {
    // Check if the user already exists by email or mobile
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { mobile }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 },
      );
    }

    // Generate a unique username if not provided
    const username = email.split('@')[0]; // Use part of the email as username

    // Hash the password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Generate the next empNo by finding the max current empNo and incrementing it
    const lastEmp = await prisma.user.findFirst({
      orderBy: {
        empNo: 'desc',
      },
    });

    let newEmpNo = '10001'; // Start with a base empNo if none exists

    if (lastEmp && lastEmp.empNo) {
      const lastEmpNo = parseInt(lastEmp.empNo, 10);
      if (!isNaN(lastEmpNo)) {
        newEmpNo = String(lastEmpNo + 1).padStart(5, '0'); // Increment and pad with leading zeros
      }
    }

    // Insert the new user with unique username and empNo
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        mobile,
        designation,
        username, // Ensure the username is unique
        password: hashedPassword,
        empNo: newEmpNo, // Assign the generated empNo
      },
    });

    return NextResponse.json(
      { message: 'User created successfully', empNo: newEmpNo },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
