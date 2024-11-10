import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import AttendanceList from "./AttendanceList";

export const metadata: Metadata = {
    title: "Employee Attendance",
    description: "Employee Attendance",
};

export default function Page() {
    return <AppLayout><AttendanceList/></AppLayout>
}