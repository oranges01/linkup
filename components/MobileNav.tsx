"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';


const MobileNav = () => {
  const pathname = usePathname()
  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
        <SheetTrigger>
          <Image 
            src="./icons/hamburger.svg"
            alt="hamburger icon"
            width={36}
            height={36}
            className='cursor-pointer sm:hidden'
          />
        </SheetTrigger>
        <SheetContent side="left" className=' border-none bg-dark-1'>
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription>
            </SheetDescription>
          </SheetHeader>
          <Link href={'/'} className='flex items-center gap-1'>
            <Image 
              src={'/icons/logo.svg'}
              width={32} height={32} 
              alt='Linkup' 
            />
            <p className='text-[26px] font-extrabold text-white'>Linkup</p>
          </Link>
          <div className='flex h-[calc(100vh - 72px)] flex-col justify-between overflow-y-auto'>
            <SheetClose asChild>
              <section className='flex h-full flex-col gap-6 pt-16 text-white'>
                    {sidebarLinks.map((link) => {
                const isActive = link.route === pathname || pathname.startsWith(`${link.route}/`)
                return (
                  <SheetClose asChild key={link.route}>
                    <Link
                      href={link.route}
                      key={link.label}
                      className={cn(
                        'flex gap-4 items-center p-4 rounded-lg w-full max-w-60',
                        {
                          'bg-blue-1': isActive,
                        })}
                    >
                      <Image 
                        src={link.imgURL} 
                        alt={link.label} 
                        width={20} 
                        height={20}
                        style={{ width: 'auto', height: 'auto' }}
                      />
                      <p className="font-semibold">
                        {link.label}
                      </p>
                    </Link>
                  </SheetClose>
                )
              })}

              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>


    </section>
  )
}

export default MobileNav