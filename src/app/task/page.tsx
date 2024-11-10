import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import TaskList from "./TaskList";

export const metadata: Metadata = {
    title: "Tasks",
    description: "Task List",
};

export default function Page() {
    return <AppLayout><TaskList/></AppLayout>
}