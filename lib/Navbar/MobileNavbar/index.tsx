'use client'

import { Home, LucideIcon, Newspaper, User } from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { usePathname } from 'next/navigation'
import { getTitle, renderAccountPath, renderNamePath } from '../script'
import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import MobileSheet from './MobileSheet'
import DarkModeSwitch from '../lib/DarkModeSwitch'
import { Button } from '@/components/ui/button'
import cn from '@/utils/cn'

export default function MobileNavbar({ router, token }: { router: AppRouterInstance; token: string }) {
  const [Icon, setIcon] = useState<LucideIcon>(Home)
  const [name, setName] = useState('')

  const pathname = usePathname()

  const arrayOfPath = pathname.split('/').filter((v) => {
    if (v) return v
  })

  const currentPath = arrayOfPath[arrayOfPath.length - 1]

  useEffect(() => {
    const prop = async () => {
      if (currentPath === 'app') {
        return {
          icon: Home,
          name: 'Home',
        }
      } else {
        if (arrayOfPath.length > 2) {
          if (arrayOfPath[1] === 'saved') {
            const response = await getTitle(token, currentPath)

            if (response !== undefined) {
              return {
                icon: Newspaper,
                name: response.title ?? 'No title',
              }
            } else {
              return {
                icon: Newspaper,
                name: 'No title',
              }
            }
          } else if (arrayOfPath[1] === 'accounts') {
            return {
              icon: User,
              name: renderAccountPath(currentPath),
            }
          } else {
            return renderNamePath(currentPath)
          }
        } else {
          return renderNamePath(currentPath)
        }
      }
    }

    const getProp = async () => {
      const pathName = await prop()

      setName(pathName.name ?? '')
      setIcon(pathName.icon)
    }

    getProp()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <nav className='w-full h-fit fixed inset-0 text-primary bg-primary-foreground z-[49] px-2 py-1 text-base select-none md:hidden flex justify-between items-center font-medium border-b-2 border-border print:hidden'>
      <div className='flex gap-2 items-center'>
        {pathname !== '/app' && (
          <button onClick={() => router.back()}>
            <ChevronLeft className='text-primary w-6 h-6' />
          </button>
        )}

        <div className='flex items-center gap-2'>
          <Icon className='w-4 h-4' />

          <p className='max-w-[150px] truncate'>{name}</p>
        </div>
      </div>

      <div className='flex items-center gap-1'>
        <div className='w-fit h-fit px-2 py-1'>
          <DarkModeSwitch />
        </div>

        <Button onClick={() => router.push('/app')} variant='ghost' className={cn('px-2 py-1 print:hidden')}>
          <Home />
        </Button>
        <MobileSheet router={router} token={token} />
      </div>
    </nav>
  )
}
