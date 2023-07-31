'use client'

import moment from 'moment'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Download, Globe, Search, Printer } from 'lucide-react'
import cn from '@/utils/cn'
import { Trash2 } from 'lucide-react'
import ViewTranscript from './ViewTranscript'
import { useState } from 'react'
import DeleteNote from './DeleteNote'
import NotionImage from '@/app/app/integrations/client/images/Notion.png'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { getNotionTitleName } from '@/app/app/client/script'
import ErrorToast from '@/components/ErrorToast'
import { generateNotionPage } from './script'
import ShareToPublic from './ShareToPublic'
import { IGetSharedContentByContentId } from '../../graphql'
import axios from 'axios'

interface Props {
  token: string
  title: string
  createdAt: string
  s3ObjectName: string
  transcript: string
  contentId: string
  typeOfPromptId: string
  outputLanguage: string
  writingStyle: string
  initialNotionPageUrl: string | null
  notionAccountConnected: boolean
  sharedContent: IGetSharedContentByContentId | null
}

export default function Title({
  token,
  title,
  createdAt,
  s3ObjectName,
  transcript,
  contentId,
  typeOfPromptId,
  outputLanguage,
  writingStyle,
  initialNotionPageUrl,
  notionAccountConnected,
  sharedContent,
}: Props) {
  const [viewTranscriptOpen, setViewTranscriptOpen] = useState(false)
  const [deleteNoteOpen, setDeleteNoteOpen] = useState(false)
  const [shareToPublicOpen, setShareToPublicOpen] = useState(false)

  const [notionPageUrl, setNotionPageUrl] = useState<string | null>(initialNotionPageUrl)

  return (
    <header className='flex flex-col gap-4 print:text-black bg-white'>
      <h1 className='sm:text-4xl text-3xl font-bold'>{title}</h1>

      <section className='flex items-center justify-between gap-2 flex-wrap'>
        <p>Created @ {moment(createdAt).format('DD MMMM YYYY, HH:mm')}</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={cn('select-none print:hidden')}>
              Actions <ChevronDown className='ml-2 w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={cn('select-none text-secondary bg-secondary-foreground')}>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                toast
                  .promise(axios.post('/api/s3/getObject', { s3ObjectName }), {
                    loading: 'Getting the downloadable url...',
                    success: 'Success getting the downloadable url!',
                    error: 'Error getting the downloadable url!',
                  })
                  .then(({ data }) => {
                    toast
                      .promise(fetch(data), {
                        loading: 'Fetching the downloadable url...',
                        success: 'Success fetching the downloadable url!',
                        error: 'Error fetching the downloadable url!',
                      })
                      .then((response) => {
                        toast
                          .promise(response.blob(), {
                            loading: 'Downloading the audio file...',
                            success: 'Success downloading the audio file!',
                            error: 'Error downloading the audio file!',
                          })
                          .then((blob) => {
                            const url = URL.createObjectURL(blob)
                            const downloadLink = document.createElement('a')
                            downloadLink.href = url
                            downloadLink.download = s3ObjectName // This attribute triggers the download.

                            // Append the link to the document and immediately click it to download the file.
                            document.body.appendChild(downloadLink)
                            downloadLink.click()

                            // Clean up the URL and remove the link after the download is initiated.
                            URL.revokeObjectURL(url)
                            document.body.removeChild(downloadLink)
                          })
                          .catch((error) => {
                            ErrorToast({ action: 'downloading the audio file', error })
                          })
                      })
                      .catch((error) => {
                        ErrorToast({ action: 'fetching the downloadable url', error })
                      })
                  })
                  .catch((error) => {
                    ErrorToast({ action: 'getting the downloadable url', error })
                  })
              }}
            >
              <Download className='mr-2 w-4 h-4' />
              Download audio
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setViewTranscriptOpen(true)
              }}
            >
              <Search className='mr-2 w-4 h-4' />
              View transcript
            </DropdownMenuItem>

            {(() => {
              if (notionAccountConnected) {
                if (notionPageUrl) {
                  return (
                    <DropdownMenuItem>
                      <a className='flex items-center gap-2' href={notionPageUrl} target='_blank' rel='noreferrer'>
                        <Image src={NotionImage} alt={'Notion icon'} width={16} height={16} draggable={false} />
                        See Notion page
                      </a>
                    </DropdownMenuItem>
                  )
                } else {
                  return (
                    <DropdownMenuItem
                      onClick={() => {
                        toast
                          .promise(getNotionTitleName(token), {
                            loading: 'Get title property of your Notion...',
                            success: 'Success getting your title property!',
                            error: 'We could not find your title property!',
                          })
                          .then((data) => {
                            const titleName = data.response

                            toast
                              .promise(generateNotionPage(token, contentId, titleName), {
                                loading: 'Exporting your note to Notion...',
                                success: 'Success exporting your note to Notion!',
                                error: 'Error exporting your note to Notion!',
                              })
                              .then((data) => {
                                const url = data.url

                                setNotionPageUrl(url)
                              })
                              .catch((error) => {
                                ErrorToast({ action: 'get title property of your notion', error })
                              })
                          })
                          .catch((error) => {
                            ErrorToast({ action: 'get title property of your notion', error })
                          })
                      }}
                      className={cn('flex items-center gap-2')}
                    >
                      <Image src={NotionImage} alt={'Notion icon'} width={16} height={16} draggable={false} />
                      Export to Notion
                    </DropdownMenuItem>
                  )
                }
              }
            })()}

            <DropdownMenuItem
              onClick={() => {
                setShareToPublicOpen(true)
              }}
            >
              <Globe className='mr-2 w-4 h-4' />
              Share note to public
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                window.print()
              }}
            >
              <Printer className='mr-2 w-4 h-4' />
              Print
            </DropdownMenuItem>

            <DropdownMenuItem
              className={cn('text-destructive focus:bg-destructive focus:text-destructive-foreground')}
              onClick={() => {
                setDeleteNoteOpen(true)
              }}
            >
              <Trash2 className='mr-2 w-4 h-4' />
              Delete note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <ViewTranscript
        open={viewTranscriptOpen}
        setOpen={setViewTranscriptOpen}
        transcript={transcript}
        token={token}
        contentId={contentId}
        typeOfPromptId={typeOfPromptId}
        outputLanguage={outputLanguage}
        writingStyle={writingStyle}
      />

      <DeleteNote token={token} open={deleteNoteOpen} setOpen={setDeleteNoteOpen} title={title} contentId={contentId} />

      <ShareToPublic
        token={token}
        open={shareToPublicOpen}
        setOpen={setShareToPublicOpen}
        sharedContent={sharedContent}
        contentId={contentId}
      />
    </header>
  )
}
