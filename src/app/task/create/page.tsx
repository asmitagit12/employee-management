import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import TaskForm from "./TaskForm";

export const metadata: Metadata = {
    title: "Create Task",
    description: "Create Task",
};

export default function Page() {
    return <AppLayout><TaskForm/></AppLayout>
}