import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import TaskList from "./UserTaskList";

export const metadata: Metadata = {
    title: "Task's",
    description: "Task's",
};

export default function Page() {
    return <AppLayout><TaskList/></AppLayout>
}