import AppLayout from "@/components/custom/layout/AppLayout";

import { Metadata } from "next";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = {
    title: "Profile",
    description: "Profile",
};

export default function Page() {
    return <AppLayout><ProfileForm/></AppLayout>
}