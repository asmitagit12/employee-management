import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import LeaveList from "./LeaveList";

export const metadata: Metadata = {
    title: "Leaves",
    description: "Employee Leaves",
};

export default function Page() {
    return <AppLayout><LeaveList/></AppLayout>
}