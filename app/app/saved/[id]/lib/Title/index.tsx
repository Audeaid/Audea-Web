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
}) {
  const [viewTranscriptOpen, setViewTranscriptOpen] = useState(false);

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

            <DropdownMenuItem
              className={cn(
                'text-destructive focus:bg-destructive focus:text-destructive-foreground'
              )}
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
    </header>
  );
}
