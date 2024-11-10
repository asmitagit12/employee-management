"use server";
import { auth } from "@/auth";

export const checkIsAdmin = async () => {
    const session = await auth();
    
    // Check if the session has the user object and role is 'ADMIN'
    if (session?.user?.role === 'ADMIN') {
        return true;
    } else {
        return false;
    }
}
