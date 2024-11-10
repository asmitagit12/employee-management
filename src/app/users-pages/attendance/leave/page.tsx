import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import LeaveForm from "./LeaveForm";

export const metadata: Metadata = {
    title: "Leave",
    description: "Leave Details",
};

export default function Page() {
    return <AppLayout><LeaveForm/></AppLayout>
}