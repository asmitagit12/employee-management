'use client'
import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel'
import Image from 'next/image'
import { Progress } from '@/components/ui/progress'

const data = [
  {
    title: 'Secure Your Workforce',
    content:
      'Experience seamless employee management with top-tier security. Protect sensitive data while managing your team effortlessly.',
    image: '/landing_01.png'
  },
  {
    title: 'Trust in Data Integrity',
    content:
      'With state-of-the-art encryption, we ensure that employee data is secure, giving you peace of mind every step of the way.',
    image: '/landing_02.jpg'
  },
  {
    title: 'Access Control Simplified',
    content:
      "Grant secure access to essential tools and information, while maintaining full control over your team's permissions.",
    image: '/landing_03.jpg'
  }
]

export function CarouselPlugin () {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) return 0
        return prevProgress + 100 / 6 // Based on 6 seconds delay (can adjust to match the autoplay delay)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  return (
    <Carousel
      className='w-full p-4 py-6'
      opts={{ align: 'start', loop: true }}
      plugins={[Autoplay({ delay: 6000 })]}
    >
      <CarouselContent>
        {data.map(item => (
          <CarouselItem key={item.title}>
            <div className='space-y-2 flex flex-col justify-center items-center'>
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={180}
                className='aspect-auto'
              />
              <h1 className='font-semibold p-1'>{item.title}</h1>
              <p className='p-1 text-center leading-normal text-balance'>
                {item.content}
              </p>
              {/* progressbar */}

              {/* <div className='w-full mt-5 flex justify-center'>
                <Progress
                  value={progress}
                  className='h-1 w-10'
                  style={{ backgroundColor: '#f0f0f0' ,color:'#007AFF'}}
                />
              </div> */}
              <div className='w-8 mt-5 flex justify-center'>
                <div className='relative w-8'>
                  {/* Background of progress bar */}
                  <Progress value={progress} className='h-1 w-6 bg-gray-200' />
                  {/* Progress fill with custom color */}
                  <div
                    className='absolute top-0 left-0 h-1'
                    style={{
                      width: `${progress}%`, // Dynamically set the width
                      backgroundColor: '#007AFF', // Custom progress color
                      transition: 'width 1s ease-in-out'
                    }}
                  />
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
