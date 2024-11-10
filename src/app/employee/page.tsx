import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import EmployeeList from "./EmployeeList";

export const metadata: Metadata = {
    title: "Emplyees",
    description: "Emplyee List",
};

export default function Page() {
    return <AppLayout><EmployeeList/></AppLayout>
}