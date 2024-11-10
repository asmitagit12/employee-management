import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import UpdateLeave from "./UpdateLeave";

export const metadata: Metadata = {
    title: "Update Leave Status",
    description: "Update Leave Status",
};

export default function Page() {
    return <AppLayout><UpdateLeave/></AppLayout>
}