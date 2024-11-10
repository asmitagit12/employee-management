import { redirect } from "next/navigation";
import WelcomePage from "./welcome";
import { checkIsAuthenticated } from "@/lib/isAuth";
import { checkIsAdmin } from "@/lib/isAdmin";

export default async function Home() {
  const isAuthenticated = await checkIsAuthenticated();
  const isAdmin = await checkIsAdmin()
  console.log('isAdmin',isAdmin)
  if (!isAuthenticated) {
    redirect('/signin')
  } else {
    return <WelcomePage />
  }
}
