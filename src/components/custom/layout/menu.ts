import { checkIsAdmin } from '@/lib/isAdmin'
import {
  BookOpen,
  Home,
  SearchIcon,
  SwatchBook,
  BookTextIcon,
  CalendarSearchIcon
} from 'lucide-react'
import { useSession } from 'next-auth/react'

export const adminMenus = [
  {
    label: 'Home',
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    isActive: true,
    submenu: []
  },
  {
    label: 'Employee',
    title: 'Employees',
    url: '/employee',
    icon: SearchIcon,
    isActive: true,
    submenu: []
  },
  {
    label: "Task's",
    title: 'Task List',
    url: '/task',
    icon: BookTextIcon,
    isActive: true,
    submenu: []
  },
  {
    label: 'Attendance',
    title: 'Employee Attendance',
    url: '/attendance',
    icon: CalendarSearchIcon,
    isActive: true,
    submenu: []
  },
  {
    label: 'Leave Tracker',
    title: 'Employee Leaves',
    url: '/leave',
    icon: SwatchBook,
    isActive: true,
    submenu: []
  },
  {
    label: 'Accounting',
    title: 'Accounting',
    url: '#',
    icon: BookOpen,
    isActive: false,
    submenu: [
      {
        title: 'Customers',
        url: '#'
      },
      {
        title: 'Vendors',
        url: '#'
      },
      {
        title: 'Debit',
        url: '#'
      },
      {
        title: 'Credit',
        url: '#'
      }
    ]
  }
]

export const userMenus = [
  {
    label: 'Home',
    title: 'Dashboard',
    url: '/users-pages/dashboard',
    icon: Home,
    isActive: true,
    submenu: []
  },
  {
    label: 'Task',
    title: "Task's",
    url: '/users-pages/user-task',
    icon: BookTextIcon,
    isActive: true,
    submenu: []
  },

  {
    label: 'Attendance',
    title: 'Attendance',
    url: '/users-pages/attendance',
    icon: SwatchBook,
    isActive: true,
    submenu: []
  },
  {
    label: 'Leave',
    title: 'Leave Tracker',
    url: '/users-pages/leave',
    icon: SwatchBook,
    isActive: true,
    submenu: []
  },
 
]

// Custom hook to get menus based on the user's role
export const useGetMenus = () => {
  const { data: session } = useSession()
  const userRole = session?.user?.role // Ensure the user's role is available in the session
  // Check if the user is an admin
  const isAdmin = userRole === 'ADMIN'

  const menusToReturn = isAdmin ? adminMenus : userMenus

  return menusToReturn
}

// Hook to get unique labels
export const useUniqueLabels = () => {
  const menus = useGetMenus() // Get the menus dynamically
  return Array.from(new Set(menus.map(menu => menu.label)))
}

// In your menu.ts file
export const useMenus = () => {
  const uniqueLabels = useUniqueLabels() // Ensure this is fetching unique labels correctly
  const menus = useGetMenus() // Get the menus based on role
  // Map through the unique labels to create a structure matching your Sidebar requirements
  return uniqueLabels.map(
    label => menus.filter(menu => menu.label === label) // This should filter based on labels
  )
}
