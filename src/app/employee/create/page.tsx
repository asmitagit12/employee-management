import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import EmployeeForm from "./EmployeeForm";

export const metadata: Metadata = {
    title: "Create Employee",
    description: "Create Employee",
};

export default function Page() {
    return <AppLayout><EmployeeForm/></AppLayout>
}