import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all users from the database with the role 'USER'
    const users = await prisma.user.findMany({
      where: {
        role: 'USER', // Filter by role
      },
    });

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    // Return the list of users with the role 'USER'
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    // Handle error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
