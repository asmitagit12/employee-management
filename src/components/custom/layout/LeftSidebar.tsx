'use client'

import * as React from 'react'
import {
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings2,
  UserIcon
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider
} from '@/components/ui/sidebar'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Header from './Header'
import { useMenus, useUniqueLabels } from './menu'
import { ChildProps } from '@/types/types'
// import logo from '../../../../public/logo.ico'
import logo from '../../../../public/vector.svg'
import Image from 'next/image'
import SecondHeader from './SecondHeader'

export default function LeftSidebar ({ children }: ChildProps) {
  const route = useRouter()
  const path = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const menus = useMenus()
  const uniqueLabels = useUniqueLabels()

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/signin' })
  }
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className='border-b'>
          {/* <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => route.push('/')}
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Image src={logo} alt='logo' height={38} width={38} />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>LMS</span>
                  <span className='truncate text-xs'>
                    Learning Management System
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu> */}
          <HeaderMenuOptions />
        </SidebarHeader>

        <SidebarContent>
          {menus.map((data, index) => (
            <SidebarGroup key={index}>
              <SidebarGroupLabel>{uniqueLabels.at(index)}</SidebarGroupLabel>
              <SidebarMenu>
                {data.length > 0 ? (
                  data.map((item, index) => {
                    const hasSubmenu = item.submenu.length > 0
                    const active =
                      item.url === path ||
                      item.submenu.some(subItem => subItem.url === path)

                    return (
                      <React.Fragment key={index}>
                        {hasSubmenu ? (
                          <Collapsible
                            asChild
                            defaultOpen={active}
                            className='group/collapsible'
                          >
                            <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                  {item.icon && <item.icon />}
                                  <span>{item.title}</span>
                                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {item.submenu.map(subItem => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton asChild>
                                        <Link
                                          href={subItem.url}
                                          className={cn({
                                            'bg-sidebar-accent text-sidebar-accent-foreground':
                                              subItem.url === path
                                          })}
                                        >
                                          {subItem.title}
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        ) : (
                          <SidebarMenuItem>
                            <SidebarMenuButton tooltip={item.title} asChild>
                              <Link
                                href={item.url}
                                className={cn({
                                  'bg-sidebar-accent text-sidebar-accent-foreground':
                                    item.url === path || path.includes(item.url)
                                })}
                              >
                                {item.icon && <item.icon />}
                                {item.title}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <SidebarMenuItem>No items available</SidebarMenuItem> // Fallback for empty menu
                )}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                  >
                    <Avatar className='h-8 w-8 rounded-full border border-blue-500'>
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback className='rounded-full'>
                        AP
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {user?.name}
                      </span>
                      <span className='truncate text-xs'>{user?.email}</span>
                    </div>
                    <ChevronsUpDown className='ml-auto size-4' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg [&_svg]:w-5 [&_svg]:stroke-[1.5] [&_svg]:mr-2 [&_svg]:h-5'
                  side='bottom'
                  align='start'
                  sideOffset={4}
                >
                  <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                      <Avatar className='h-8 w-8 rounded-full border border-blue-500'>
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback className='rounded-full'>
                          AP
                        </AvatarFallback>
                      </Avatar>
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>
                          {user?.name}
                        </span>
                        <span className='truncate text-xs'>{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href={'/profile'} className='flex w-full'>
                        <UserIcon /> Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link href={'#'} className='flex w-full'>
                        <CreditCard /> Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link href={'#'} className='flex w-full'>
                        <Bell /> Notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => handleLogout()}
                    className='cursor-pointer'
                  >
                    <LogOut /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter> */}
        {/* <SidebarFooter>
          <FooterMenuOptions />
        </SidebarFooter> */}
      </Sidebar>

      <SidebarInset>
        <Header />
        <Separator />
        <SecondHeader />
        <Separator />
        <div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function HeaderMenuOptions () {
  const route = useRouter()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => route.push('/')}
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          {/* <div className='flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground'> */}
            <Image src={logo} alt='logo' height={38} width={38} />
          {/* </div> */}
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>TEAMEDGE</span>
            <span className='truncate text-xs'>Empower Your Workforce</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function FooterMenuOptions () {
  const { data: session } = useSession()
  const user = session?.user
  const logout = () => signOut({ redirect: true, callbackUrl: '/signin' })
  console.log("User role: ", user?.role);
  const options = [
    {
      label: 'Profile',
      url: user?.role === 'USER' ? '/users-pages/profile' : '/profile',
      icon: UserIcon
    },
    {
      label: 'Setting',
      url: user?.role === 'ADMIN' ? '/admin-settings' : '/settings', // For admin users
      icon: Settings2
    },
    {
      label: 'Notifications',
      url: user?.role === 'ADMIN' ? '/admin-notifications' : '/notifications', // For admin users
      icon: Bell
    }
  ]

  return (
    user && (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-full border border-blue-500'>
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback className='rounded-full'>AP</AvatarFallback>
                </Avatar>

                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user?.name}</span>
                  <span className='truncate text-xs'>{user?.email}</span>
                </div>
                <ChevronsUpDown className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg [&_svg]:size-4 [&_svg]:stroke-[1.5] [&_svg]:mr-2'
              side='bottom'
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-full border border-blue-500'>
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className='rounded-full'>AP</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>{user?.name}</span>
                    <span className='truncate text-xs'>{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {options.map(item => (
                  <DropdownMenuItem key={item.label}>
                    <Link href={item.url} className='flex flex-1 items-center'>
                      {item.icon && <item.icon />}
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => logout()}
                className='cursor-pointer'
              >
                <LogOut /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  )
}
