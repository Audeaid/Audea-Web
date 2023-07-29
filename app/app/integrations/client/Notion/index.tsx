'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import NotionImage from '../images/Notion.png'
import cn from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { IGetNotionAccount } from '../../graphql'
import ErrorToast from '@/components/ErrorToast'
import { seeAllNotionDatabase, ISeeAllNotionDatabase } from '../../[...connections]/lib/Notion/script'
import { ChevronDown, Trash, Pen } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Manage from './lib/Manage'
import Delete from './lib/Delete'

export default function Notion({
  token,
  getNotionAccount,
}: {
  token: string
  getNotionAccount: IGetNotionAccount | null
}) {
  const [dialogManageOpen, setDialogManageOpen] = useState(false)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)

  const [loading, setLoading] = useState(true)

  const [notionDatabase, setNotionDatabase] = useState<ISeeAllNotionDatabase[] | null>(null)
  const [automaticChecked, setAutomaticChecked] = useState(getNotionAccount ? getNotionAccount.automaticPost : false)

  useEffect(() => {
    const fetchGetNotionAccount = async () => {
      if (getNotionAccount !== null) {
        try {
          setLoading(true)

          const response = await seeAllNotionDatabase(token)
          setNotionDatabase(response)

          setLoading(false)
        } catch (error) {
          setLoading(false)

          ErrorToast({ action: 'search all allowed notion database', error })
        }
      }
    }

    fetchGetNotionAccount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={cn('flex items-center justify-between')}>
            <div className='flex items-center gap-4'>
              <Image src={NotionImage} quality={100} draggable={false} height={40} width={40} alt='Notion logo' />
              Notion
            </div>

            {getNotionAccount === null ? (
              <Button type='button'>
                <a href={process.env.NEXT_PUBLIC_NOTION_MAIN_OAUTH_AUTHORIZATION_URL!}>Connect</a>
              </Button>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button>
                      Manage connection <ChevronDown className='ml-2 w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setDialogManageOpen(true)}>
                      <Pen className='w-4 h-4 mr-2' />
                      Change Notion settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDialogDeleteOpen(true)}
                      className={cn('text-destructive focus:bg-destructive focus:text-destructive-foreground')}
                    >
                      <Trash className='w-4 h-4 mr-2' />
                      Delete connection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Delete token={token} dialogOpen={dialogDeleteOpen} setDialogOpen={setDialogDeleteOpen} />

                <Manage
                  dialogOpen={dialogManageOpen}
                  setDialogOpen={setDialogManageOpen}
                  getNotionAccount={getNotionAccount}
                  notionDatabase={notionDatabase}
                  loading={loading}
                  token={token}
                  automaticChecked={automaticChecked}
                  setAutomaticChecked={setAutomaticChecked}
                />
              </>
            )}
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  )
}
