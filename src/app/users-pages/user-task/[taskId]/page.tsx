import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import UpdateTask from "./UpdateTask";

export const metadata: Metadata = {
    title: "User Update Task",
    description: "User Update Task",
};

export default function Page() {
    return <AppLayout><UpdateTask/></AppLayout>
}