import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import AttendanceList from "./UserAttendance";

export const metadata: Metadata = {
    title: "Attendance",
    description: "Attendance",
};

export default function Page() {
    return <AppLayout><AttendanceList/></AppLayout>
}