import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import LeaveForm from "./LeaveForm";

export const metadata: Metadata = {
    title: "Apply Leave",
    description: "Apple your leave here",
};

export default function Page() {
    return <AppLayout><LeaveForm/></AppLayout>
}