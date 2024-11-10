'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { Bell, LogOut, MenuIcon, Search, Settings2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useGetMenus } from './menu';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();
    return <Button onClick={toggleSidebar} variant={'ghost'} size={'sm'} className="size-7 -ml-1"><MenuIcon /></Button>
}

function getTitleAndParentByUrl(data: any, url: string) {
    for (const entry of data) {
        // Check if the current entry matches the url
        if (entry.url === url) {
            return { parentTitle: entry.title };
        }

        // Check in submenu if it exists
        if (entry.submenu) {
            const submenuItem = entry.submenu.find((sub: any) => sub.url === url);
            if (submenuItem) {
                return { parentTitle: entry.title, childTitle: submenuItem.title };
            }
        }
    }
    return null;
}

const Header: React.FC = React.memo(() => {
    const path = usePathname();
    const data = useGetMenus()
    const breadcrumb = getTitleAndParentByUrl(data, path);
    const [userProfile, setUserProfile] = useState<any>(null)
    const { data: session } = useSession()
    const user = session?.user
    console.log('user', user)

    useEffect(() => {
        if (user) {
            const fetchItem = async () => {
                const response = await fetch(`/api/user/id`, {
                    method: 'POST',
                    body: JSON.stringify({ id: user.id })
                })

                const data = await response.json()
                setUserProfile(data)
                console.log('data', data)

            }
            fetchItem()
        }
    }, [user])

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <CustomTrigger />

                <Separator orientation="vertical" className="mr-2 h-4" />

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">Home</BreadcrumbLink>
                        </BreadcrumbItem>

                        {path !== '/' && <BreadcrumbSeparator className="hidden md:block" />}

                        {breadcrumb?.childTitle
                            ? <React.Fragment>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href={"#"}>{breadcrumb?.parentTitle}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{breadcrumb?.childTitle}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </React.Fragment>
                            : <BreadcrumbPage>{breadcrumb?.parentTitle}</BreadcrumbPage>
                        }
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className='px-3 flex space-x-3'>
                <Link href={'/notifications'} className='flex flex-1 items-center'>
                    <Search />
                </Link>
                <Link href={'/notifications'} className='flex flex-1 items-center'>
                    <Bell />
                </Link>
                <Avatar className='h-8 w-8 rounded-full border border-blue-500'>
                    <AvatarImage src={user?.image} alt={userProfile?.firstName || ''} />
                    <AvatarFallback className='rounded-full'>
                        {userProfile?.firstName?.charAt(0).toUpperCase()}{userProfile?.lastName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
});

Header.displayName = "Header";

export default Header;