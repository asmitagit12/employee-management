'use client'
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import LeaveCard from "./_components/LeaveCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// import { Leave } from "@/types"; // Adjust the path as needed

// types.ts (create this file in your types folder or define it directly in LeaveCard)

interface Leave {
    id: string;
    userId: string;
    leaveType?: "SICK_LEAVE" | "CASUAL_LEAVE" | "EMERGENCY_LEAVE" | "HOLIDAY";
    leaveReason?: string;
    startDate?: Date;
    endDate?: Date;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    updatedAt: Date;
  }
  
const LeavePage = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  console.log('user', user)

  useEffect(() => {
    if (user) {
      console.log('Fetching leaves for user ID:', user.id) // Log the user ID

      const fetchLeaveRecords = async () => {
        const response = await fetch(
          `/api/user-routes/leave/getall/${user.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
            setLeaves(data) // Assuming you have a state to hold the tasks
          console.log('leave Records:', data)
        } else {
          console.error('Error fetching tasks:', data.message || data.error)
        }
      }

      fetchLeaveRecords()
    }
  }, [user])

  const handleAddLeave=()=>{
    router.push('/users-pages/leave/create')
  }

  return (
    <div className="container mx-auto p-6">
      <TitlePage title="Leave Tracker" description="Track your leaves here" />
      <Button className="mb-4 mt-2" onClick={handleAddLeave}>Apply Leave</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {leaves.map((leave) => (
          <LeaveCard key={leave.id} leave={leave} />
        ))}
      </div>
    </div>
  );
};

export default LeavePage;
