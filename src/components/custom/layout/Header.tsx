'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/components/ui/sidebar'
import { Bell, LogOut, MenuIcon, Search, Settings2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useGetMenus } from './menu'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import UserImage from '../../../../public/images/user.png'
import NoImage from '../../../../public/no-image.jpg'
import Image from 'next/image'

export function CustomTrigger () {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      onClick={toggleSidebar}
      variant={'ghost'}
      size={'sm'}
      className='size-7 -ml-1'
    >
      <MenuIcon />
    </Button>
  )
}

function getTitleAndParentByUrl (data: any, url: string) {
  for (const entry of data) {
    // Check if the current entry matches the url
    if (entry.url === url) {
      return { parentTitle: entry.title }
    }

    // Check in submenu if it exists
    if (entry.submenu) {
      const submenuItem = entry.submenu.find((sub: any) => sub.url === url)
      if (submenuItem) {
        return { parentTitle: entry.title, childTitle: submenuItem.title }
      }
    }
  }
  return null
}

const Header: React.FC = React.memo(() => {
  const path = usePathname()
  const data = useGetMenus()
  const breadcrumb = getTitleAndParentByUrl(data, path)
  const [userProfile, setUserProfile] = useState<any>(null)
  const { data: session } = useSession()
  const user = session?.user
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (user) {
      const fetchItem = async () => {
        const response = await fetch(`/api/user/id`, {
          method: 'POST',
          body: JSON.stringify({ id: user.id })
        })

        const data = await response.json()
        setUserProfile(data)
      }
      fetchItem()
    }
  }, [user])

  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <CustomTrigger />

        <Separator orientation='vertical' className='mr-2 h-4' />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink href='#'>Home</BreadcrumbLink>
            </BreadcrumbItem>

            {path !== '/' && (
              <BreadcrumbSeparator className='hidden md:block' />
            )}

            {breadcrumb?.childTitle ? (
              <React.Fragment>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href={'#'}>
                    {breadcrumb?.parentTitle}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb?.childTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            ) : (
              <BreadcrumbPage>{breadcrumb?.parentTitle}</BreadcrumbPage>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='px-3 flex space-x-3'>
        <Link href={'/notifications'} className='flex flex-1 items-center'>
          <Search className='w-5 h-5' />
        </Link>
        <Link href={'/notifications'} className='flex flex-1 items-center'>
          <Bell className='w-5 h-5' />
        </Link>
        <Avatar
          className='h-8 w-8 rounded-full border border-blue-500'
          onClick={() => setDrawerOpen(true)}
        >
          <AvatarImage src={user?.image} alt={userProfile?.firstName || ''} />
          <AvatarFallback className='rounded-full'>
            {userProfile?.firstName?.charAt(0).toUpperCase()}
            {userProfile?.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Drawer Component */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
          drawerOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setDrawerOpen(false)} // Close the drawer when overlay is clicked
      />

      <div
        className={`fixed top-0 right-0 h-[99vh] rounded-sm bg-white shadow-lg transform transition-all duration-300 ease-in-out z-50 
                ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}
                sm:w-96 w-72`} // Adjust drawer width based on screen size
      >
        <div className='flex justify-between p-4'>
          <h2 className='text-lg font-semibold'>User Profile</h2>
          <button
            className='text-gray-500 hover:text-gray-700'
            onClick={() => setDrawerOpen(false)} // Close the drawer when clicked
          >
            X
          </button>
        </div>
        <div className='p-4 flex items-center space-x-4'>
          {/* Square Image */}
          <div className='w-16 h-16 rounded overflow-hidden border'>
            <Image
              src={userProfile?.image || UserImage}
              alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
              className='w-full h-full object-cover'
            />
          </div>

          {/* User Info */}
          <div>
            <p className='text-xl font-semibold'>
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
            <p className='text-sm text-gray-500'>{userProfile?.email}</p>
            {user?.role !== 'ADMIN' && (
              <p className='text-sm text-gray-500'>
                EmpNo: {userProfile?.empNo}
              </p>
            )}
          </div>
        </div>
        <div className='flex space-x-3 space-y-2 p-1 items-center w-full justify-between'>
          {/* My Account Button */}

          <Button variant={'outline'} className=''>
            My Account
          </Button>

          {/* Sign Out Button */}
          <Button variant={'link'} onClick={() => signOut()}>
            <LogOut />
            Sign Out
          </Button>
        </div>
        {/* Centered Separator */}
        <div className='flex justify-center items-center w-full mt-4'>
          <Separator className='w-[95%]' />
        </div>
        <div className='flex flex-col w-full p-4 space-y-5'>
          {/* Header section with manage options */}
          <div className='flex justify-between items-center w-full'>
            <p className='text-sm font-bold'>Manage Account</p>
            <p className='text-sm font-bold text-blue-400'>Manage Organization</p>
          </div>

          {/* Organization details with image and name */}
          <div className='flex items-center space-x-4'>
            {/* Image */}
            <div className='w-16 h-16 rounded overflow-hidden border'>
            <Image
              src={userProfile?.image || NoImage}
              alt={`no-image`}
              className='w-full h-full object-cover'
            />
            </div>

            {/* Organization name */}
            <div className='flex flex-col'>
              <p className='text-base font-semibold'>Organization Name</p>
              <p className='text-sm text-gray-500'>
                Some additional details if needed
              </p>
            </div>
          </div>
        </div>
         {/* Centered Separator */}
         <div className='flex justify-center items-center w-full mt-4'>
          <Separator className='w-[95%]' />
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header
