'use client';

import { Badge } from '@/components/ui/badge';
import Loom from './Loom';
import cn from '@/utils/cn';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Copy, FileText, Printer, Siren } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Client() {
  const lastUpdateDate = moment('2023-06-15'); // change here after updating

  const currentDate = moment();
  const daysAgo = currentDate.diff(lastUpdateDate, 'days');

  return (
    <motion.section
      className="lg:grid lg:grid-cols-[1fr_0.25fr] print:text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="flex flex-col gap-12">
        <section className="flex flex-col gap-4">
          <header className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">How Audea works</h1>
            <Badge className={cn('w-fit h-fit')} variant="outline">
              Last updated: {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
            </Badge>
          </header>
        </section>

        <section className="flex flex-col gap-2">
          <header className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold scroll-m-10" id="description">
              Description
            </h2>
            <Separator className={cn('print:text-black print:bg-black')} />
          </header>

          <p className="text-justify">
            Microsoft Word is a powerful word processing application that allows
            you to create and edit documents. By using headings in Microsoft
            Word, you can structure your document and create a clear hierarchy
            of information. Here&apos;s a step-by-step guide on how to use
            Microsoft Word with headings:
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <header className="flex flex-col gap-1">
            <h2
              className="text-3xl font-bold scroll-m-10"
              id="prepare-your-audio"
            >
              Prepare your audio
            </h2>
            <Separator className={cn('print:text-black print:bg-black')} />
          </header>

          <p className="text-justify">
            Microsoft Word is a powerful word processing application that allows
            you to create and edit documents. By using headings in Microsoft
            Word, you can structure your document and create a clear hierarchy
            of information. Here&apos;s a step-by-step guide on how to use
            Microsoft Word with headings:
          </p>

          <Alert
            className={cn(
              'print:text-black print:border-black print:bg-gray-500'
            )}
          >
            <Siren className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the cli.
            </AlertDescription>
          </Alert>
        </section>

        <section className="flex flex-col gap-2">
          <header className="flex flex-col gap-1">
            <h2
              className="text-3xl font-bold scroll-m-10"
              id="transform-your-audio"
            >
              Transform your audio
            </h2>
            <Separator className={cn('print:text-black print:bg-black')} />
          </header>

          <p className="text-justify">
            Microsoft Word is a powerful word processing application that allows
            you to create and edit documents. By using headings in Microsoft
            Word, you can structure your document and create a clear hierarchy
            of information. Here&apos;s a step-by-step guide on how to use
            Microsoft Word with headings:
          </p>

          <ol className="list-decimal list-outside ml-4 flex flex-col gap-2">
            <li>
              Download Microsoft Word: Go to the official Microsoft Office
              website or any authorized software distributor and download the
              Microsoft Word installation file.
            </li>

            <li>
              Run the installer: Locate the downloaded installation file and
              double-click on it to run the installer. Follow the on-screen
              instructions to proceed with the installation process.
            </li>

            <li>
              Activate Microsoft Word: After the installation is complete,
              launch Microsoft Word. You may be prompted to activate the
              software by entering a product key or signing in with your
              Microsoft account. Follow the instructions provided to activate
              your copy of Microsoft Word.
            </li>
          </ol>
        </section>

        <section className="flex flex-col gap-2 print:hidden">
          <header className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold scroll-m-10" id="watch-tutorial">
              Watch tutorial
            </h2>
            <Separator />
          </header>

          <p className="text-justify">
            Microsoft Word is a powerful word processing application that allows
            you to create and edit documents. By using headings in Microsoft
            Word, you can structure your document and create a clear hierarchy
            of information. Here&apos;s a step-by-step guide on how to use
            Microsoft Word with headings:
          </p>

          <div className="max-w-[450px]">
            <AspectRatio ratio={16 / 9}>
              <Loom />
            </AspectRatio>
          </div>
        </section>

        <section className="flex gap-4 my-10 print:hidden">
          <Button
            variant="outline"
            className={cn('w-fit h-fit')}
            onClick={() => {
              window.print();
            }}
          >
            <Printer className="mr-2 w-4 h-4" />
            Print
          </Button>

          <Button variant="outline" className={cn('w-fit h-fit')}>
            <FileText className="mr-2 w-4 h-4" />
            Download PDF
          </Button>

          <Button
            variant="outline"
            className={cn('w-fit h-fit')}
            onClick={() => {
              const url = 'https://app.audea.id/app/how-audea-works';
              toast.promise(navigator.clipboard.writeText(url), {
                loading: 'Copying link...',
                success: 'Link copied!',
                error: 'Error copying link!',
              });
            }}
          >
            <Copy className="mr-2 w-4 h-4" />
            Copy link
          </Button>
        </section>
      </section>

      <section className="lg:flex hidden flex-col gap-4 w-fit h-fit justify-self-end sticky print:hidden">
        <p>On this page</p>
        <section className="flex flex-col gap-1">
          <a
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            href="#description"
          >
            Description
          </a>

          <a
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            href="#prepare-your-audio"
          >
            Prepare your audio
          </a>

          <a
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            href="#transform-your-audio"
          >
            Transform your audio
          </a>

          <a
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            href="#watch-tutorial"
          >
            Watch tutorial
          </a>
        </section>
      </section>
    </motion.section>
  );
}
