'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";

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
  
interface LeaveCardProps {
  leave: Leave;
}

const LeaveCard: React.FC<LeaveCardProps> = ({ leave }) => {
  const { leaveType, leaveReason, startDate, endDate, status, createdAt } = leave;

  const statusColor = {
    PENDING: "bg-yellow-200 text-yellow-800",
    APPROVED: "bg-green-200 text-green-800",
    REJECTED: "bg-red-200 text-red-800",
  };

  return (
    <Card className="shadow-md p-4 mb-4 border border-gray-300 rounded-lg">
      <CardHeader>
        <h3 className="font-semibold text-lg">{leaveType || "Leave Request"}</h3>
        <p className="text-sm text-gray-500">Submitted on: {format(new Date(createdAt), "PPP")}</p>
      </CardHeader>
      <CardContent className="mt-2">
        <div className="text-gray-700 mb-2">
          <span className="font-semibold">Reason: </span> {leaveReason || "No reason provided"}
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <div>
            <span className="font-semibold">Start Date:</span>{" "}
            {startDate ? format(new Date(startDate), "PPP") : "N/A"}
          </div>
          <div>
            <span className="font-semibold">End Date:</span>{" "}
            {endDate ? format(new Date(endDate), "PPP") : "N/A"}
          </div>
        </div>
        <Badge className={`mt-2 ${statusColor[status]}`}>{status}</Badge>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default LeaveCard;
