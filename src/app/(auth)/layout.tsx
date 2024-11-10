// import type { Metadata } from "next";
// import { ChildProps } from "@/types/children";
// import Image from "next/image";
// import signinImg from '../../../public/images/img2.png'

// export const metadata: Metadata = {
//   title:{
//     default:"LMS",
//     template:"%s | Auth"
// } ,
//   description: "Signin to get started",
// };

// export default function AuthLayout({children}:ChildProps) {

//   return (
//     <div className=" flex flex-col md:flex-row h-screen">
//       <div className='w-full md:w-1/2 md:block hidden'>
//         <div className='relative hidden h-full flex-col bg-muted   dark:border-r lg:flex'>
//           <div className='absolute inset-0 '>{/* hiii */}</div>
//           <div className='relative z-20 flex w-full mt-8 justify-center items-center text-lg font-medium'>
//             <Image
//               src={signinImg}
//               alt='sign-in-img'
//               style={{ width: '500px', height: '500px' }}
//             />
//           </div>
//           <div className='relative z-20 mt-16 w-full justify-center items-center text-center'>
//             <blockquote className='space-y-2'>
//               <p className='text-lg'>
//                 Education is the most powerful weapon which you can use to
//                 change the world
//               </p>
//               <footer className='text-sm'></footer>
//             </blockquote>
//           </div>
//         </div>
//       </div>
//       {/* Forms */}
//       <div className="w-full md:w-1/2 flex justify-center items-center h-screen">
//         <div className="max-w-md w-full">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

import { CarouselPlugin } from '@/components/custom/carousel-content'
import ToggleButtons from '@/components/custom/layout/ToggleButtons'
import { Button } from '@/components/ui/button'
import { ChildProps } from '@/types/types'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../../public/logo-t.svg'
import React from 'react'

export const metadata: Metadata = {
  title: {
    default: 'TeamEdge',
    template: '%s | Auth'
  },
  description: 'Signin to get started'
}

export default function AuthLayout({ children }: ChildProps) {
  return (
    <React.Fragment>

      <div className='flex flex-col items-center justify-center h-screen bg-slate-100 dark:bg-sidebar-accent'>
        <div className='w-full lg:w-[50%] md:w-[60%] flex justify-center items-center'>
          <div className='w-full lg:flex rounded-xl bg-card text-card-foreground md:border md:shadow-2xl p-3'>
            <div className='w-full lg:w-3/4  flex flex-col justify-start border-r'>
              <div className='flex justify-start py-2'>
                <Image
                  src={logo}
                  alt='logo'
                  style={{ width: '190px', height: 'auto' }}
                />
              </div>
              <div className='flex justify-start px-4 w-full'>{children}</div>

            </div>

            <div className='hidden w-2/4 lg:flex items-center  overflow-hidden p-4'>
              <div className='w-full h-full grid'>
                <CarouselPlugin />
                <div className='mt-auto p-4 text-center'>
                  <div className='flex justify-center items-center gap-2 my-2'>
                    {/* <div className='flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground'>
                      <span className='text-xs'>TE</span>
                    </div>
                    TeamEdge */}
                    <Image
                      src={logo}
                      alt='logo'
                      style={{ width: '190px', height: 'auto' }}
                    />
                  </div>

                  <ToggleButtons />
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className='text-sm space-y-2 mt-3'>
          © 2024,TeamEdge, All Rights Reserved.
        </p>
      </div>
    </React.Fragment>
  )
}
