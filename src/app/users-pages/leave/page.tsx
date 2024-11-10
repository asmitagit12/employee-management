import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import LeavePage from "./LeavePage";

export const metadata: Metadata = {
    title: "Leave",
    description: "Track your leaves",
};

export default function Page() {
    return <AppLayout><LeavePage/></AppLayout>
}