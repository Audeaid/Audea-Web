'use client';

import moment from 'moment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, Search } from 'lucide-react';
import cn from '@/utils/cn';
import { Trash2 } from 'lucide-react';
import ViewTranscript from './ViewTranscript';
import { useState } from 'react';
import DeleteNote from './DeleteNote';
import NotionImage from '@/app/app/integrations/lib/images/Notion.png';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { getNotionTitleName } from '@/app/app/lib/script';
import ErrorToast from '@/components/ErrorToast';
import { generateNotionPage } from './script';

export default function Title({
  token,
  title,
  createdAt,
  voiceNoteUrl,
  transcript,
  contentId,
  typeOfPromptId,
  outputLanguage,
  writingStyle,
  initialNotionPageUrl,
  notionAccountConnected,
}: {
  token: string;
  title: string;
  createdAt: string;
  voiceNoteUrl: string;
  transcript: string;
  contentId: string;
  typeOfPromptId: string;
  outputLanguage: string;
  writingStyle: string;
  initialNotionPageUrl: string | null;
  notionAccountConnected: boolean;
}) {
  const [viewTranscriptOpen, setViewTranscriptOpen] = useState(false);
  const [deleteNoteOpen, setDeleteNoteOpen] = useState(false);

  const [notionPageUrl, setNotionPageUrl] = useState<string | null>(
    initialNotionPageUrl
  );

  return (
    <header className="flex flex-col gap-4">
      <h1 className="sm:text-4xl text-3xl font-bold">{title}</h1>

      <section className="flex items-center justify-between gap-2 flex-wrap">
        <p>Created @ {moment(createdAt).format('DD MMMM YYYY, HH:mm')}</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={cn('select-none')}>
              Actions <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn('select-none text-secondary bg-secondary-foreground')}
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <a download={true} href={voiceNoteUrl}>
                <Download className="mr-2 w-4 h-4" />
                Download audio
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setViewTranscriptOpen(true);
              }}
            >
              <Search className="mr-2 w-4 h-4" />
              View transcript
            </DropdownMenuItem>

            {(() => {
              if (notionAccountConnected) {
                if (notionPageUrl) {
                  return (
                    <DropdownMenuItem
                      onClick={() => {
                        setViewTranscriptOpen(true);
                      }}
                    >
                      <a
                        className="flex items-center gap-2"
                        href={notionPageUrl}
                        target="_blank"
                      >
                        <Image
                          src={NotionImage}
                          alt={'Notion icon'}
                          width={16}
                          height={16}
                          draggable={false}
                        />
                        See Notion page
                      </a>
                    </DropdownMenuItem>
                  );
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
                            const titleName = data.response;

                            toast
                              .promise(
                                generateNotionPage(token, contentId, titleName),
                                {
                                  loading: 'Exporting your note to Notion...',
                                  success:
                                    'Success exporting your note to Notion!',
                                  error: 'Error exporting your note to Notion!',
                                }
                              )
                              .then((data) => {
                                const url = data.url;

                                setNotionPageUrl(url);
                              })
                              .catch((e) => {
                                ErrorToast(
                                  'get title property of your notion',
                                  e
                                );
                              });
                          })
                          .catch((e) => {
                            ErrorToast('get title property of your notion', e);
                          });
                      }}
                      className={cn('flex items-center gap-2')}
                    >
                      <Image
                        src={NotionImage}
                        alt={'Notion icon'}
                        width={16}
                        height={16}
                        draggable={false}
                      />
                      Export to Notion
                    </DropdownMenuItem>
                  );
                }
              }
            })()}

            <DropdownMenuItem
              className={cn(
                'text-destructive focus:bg-destructive focus:text-destructive-foreground'
              )}
              onClick={() => {
                setDeleteNoteOpen(true);
              }}
            >
              <Trash2 className="mr-2 w-4 h-4" />
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

      <DeleteNote
        token={token}
        open={deleteNoteOpen}
        setOpen={setDeleteNoteOpen}
        title={title}
        contentId={contentId}
      />
    </header>
  );
}
