import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import UpdateEmployee from "./UpdateEmployee";

export const metadata: Metadata = {
    title: "Update Employee",
    description: "Update Employee",
};

export default function Page() {
    return <AppLayout><UpdateEmployee/></AppLayout>
}