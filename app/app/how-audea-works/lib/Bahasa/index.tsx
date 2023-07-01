'use client';

import { Badge } from '@/components/ui/badge';
import cn from '@/utils/cn';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Copy, Printer, Siren } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { outputLanguageList } from '@/app/utils/outputLanguage';
import { inputLanguage } from '@/app/utils/inputLanguage';

export default function Bahasa() {
  const lastUpdateDate = moment('2023-07-01'); // ubah di sini setelah memperbarui

  const currentDate = moment();
  const daysAgo = currentDate.diff(lastUpdateDate, 'days');

  return (
    <motion.section
      className="lg:grid lg:grid-cols-[1fr_0.25fr] print:text-black select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="flex flex-col gap-12">
        <section className="flex flex-col gap-4">
          <header className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">Cara Menggunakan Audea</h1>
            <Badge className={cn('w-fit h-fit')} variant="outline">
              Terakhir diperbarui:{' '}
              {daysAgo === 0 ? 'Hari ini' : `${daysAgo} hari yang lalu`}
            </Badge>
          </header>
        </section>

        <p className="text-justify">
          Di Audea, tujuan kami adalah menyederhanakan proses mengubah pikiran
          yang berantakan menjadi catatan terstruktur. Berikut adalah
          langkah-langkah penggunaan Audea:
        </p>

        <section className="flex flex-col gap-2">
          <header className="flex flex-col gap-1 bg-foreground text-background p-2 print:p-0">
            <h2 className="text-xl scroll-m-10" id="step-1">
              <strong>Langkah 1</strong> | Merekam atau mengunggah suara Anda
            </h2>
            <Separator className={cn('print:text-black print:bg-black')} />
          </header>

          <p className="text-justify">
            Di Audea, terdapat dua metode yang dapat Anda gunakan. Anda dapat
            menggunakan salah satu dari cara berikut:
          </p>

          <ol className="list-decimal list-outside ml-4 flex flex-col gap-2">
            <li>
              Merekam: Klik tombol rekam dan mulai berbicara secara bebas, atau
            </li>

            <li>
              Mengunggah file audio: Anda dapat menjelajah atau cukup seret dan
              lepaskan file dalam format seperti MP3, MP4, MP4A, MPGA, WAV, atau
              MPEG. Audea akan mengonversi file yang Anda pilih
            </li>
          </ol>

          <p className="text-justify">
            Audea dapat mendeteksi {inputLanguage.length} bahasa dari audio
            Anda. Bahasa-bahasa ini adalah: {inputLanguage.join(', ')}.
          </p>

          <p className="text-justify">
            Ketika Anda menggunakan Audea untuk pertama kalinya, Anda perlu
            mengkonfigurasi bagaimana catatan yang dihasilkan akan disesuaikan
            dengan preferensi Anda.
          </p>

          <Alert
            className={cn(
              'print:text-black print:border-black print:bg-gray-500'
            )}
          >
            <Siren className="h-4 w-4" />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>
              Saat ini ({currentDate.format('DD MMMM YYYY')}), Anda tidak dapat
              menggunakan fitur perekaman di browser Safari.
            </AlertDescription>
          </Alert>
        </section>

        <section className="flex flex-col gap-2">
          <header className="flex flex-col gap-1 bg-foreground text-background p-2 print:p-0">
            <h2 className="text-xl scroll-m-10" id="step-2">
              <strong>Langkah 2</strong> | Menyesuaikan catatan yang diinginkan
            </h2>
            <Separator className={cn('print:text-black print:bg-black')} />
          </header>

          <p className="text-justify">
            Pada awalnya, Anda perlu mengkonfigurasi 3 hal untuk membuat catatan
            baru dengan Audea:
          </p>

          <ol className="list-decimal list-outside ml-4 flex flex-col gap-2">
            <li>
              <strong>Bahasa tujuan</strong>. Anda dapat mengatur ini sebagai
              &quot;Sama dengan transkrip&quot; atau, Anda dapat memilih bahasa
              keluaran yang diinginkan. Saat ini, bahasa keluaran yang didukung
              adalah:{' '}
              {outputLanguageList
                .filter((v) => v.db !== 'TRANSCRIPT')
                .map((v) => v.label)
                .filter((_v, i) => i !== outputLanguageList.length - 2)
                .join(', ')}
              , dan {outputLanguageList[outputLanguageList.length - 1].label}.
            </li>

            <li>
              <strong>Gaya penulisan</strong>. Karena Audea menggunakan AI untuk
              mengubah audio Anda menjadi catatan, Anda dapat memilih gaya
              penulisan apa pun yang Anda inginkan. Anda selalu dapat memilih
              &quot;Default&quot; jika Anda tidak memiliki preferensi gaya
              penulisan tertentu. Harap dicatat bahwa gaya penulisan tidak 100%
              efektif jika bahasa tujuan bukan dalam bahasa Inggris.
            </li>

            <li>
              <strong>Jenis catatan</strong>. Kami memiliki beragam jenis
              catatan yang dapat dipilih, tergantung pada kebutuhan Anda. Untuk
              melihat semua contoh, silakan klik{' '}
              <a
                href="https://audeaid.notion.site/d9242908bb9f421b8d7fe86c0f5a424b?v=9df833bfa8da4d11b600295e741893fb&pvs=4"
                className="underline"
              >
                di sini
              </a>
              .
            </li>
          </ol>

          <p className="text-justify">
            Anda selalu dapat mencentang kotak &quot;Don&apos;t ask me
            again&quot; dan mengubah preferensi yang tersimpan{' '}
            <a href="/app/settings" className="underline">
              di sini
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <header className="flex flex-col gap-1 bg-foreground text-background p-2 print:p-0">
            <h2 className="text-xl scroll-m-10" id="step-3">
              <strong>Langkah 3</strong> | Menghasilkan dan menyimpan catatan
              Anda
            </h2>
            <Separator className={cn('print:text-black print:bg-black')} />
          </header>

          <p className="text-justify">
            Audea akan secara otomatis memproses audio Anda berdasarkan
            preferensi yang Anda pilih. Layar muat akan ditampilkan (dengan teks
            yang sesuai) untuk menunjukkan bahwa catatan masih dalam proses
            pembuatan.
          </p>

          <p className="text-justify">
            Tolong (dan ini sangat penting) jangan pernah menutup jendela atau
            browser Anda ketika catatan masih dalam proses pembuatan. Pembuatan
            catatan dapat memakan waktu beberapa detik hingga 1 jam (tergantung
            pada durasi dan kompleksitas audio Anda).
          </p>

          <p className="text-justify">
            Catatan baru Anda akan secara otomatis disimpan, bersama dengan
            transkripsi dan file audio Anda.
          </p>
        </section>

        <section className="flex flex-col gap-2 print:hidden">
          <header className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold scroll-m-10" id="watch-tutorial">
              Tonton tutorial
            </h2>
            <Separator />
          </header>

          <div className="max-w-[450px]">
            <AspectRatio ratio={16 / 9}>
              <div
                style={{
                  position: 'relative',
                  paddingBottom: '62.5%',
                  height: 0,
                }}
              >
                <iframe
                  src="https://www.loom.com/embed/679eefb452f640c3af83e25ce36a695a?sid=84bd60fd-df78-49a9-9cd0-80363dbb057f"
                  allowFullScreen={true}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                ></iframe>
              </div>
            </AspectRatio>
          </div>
        </section>

        <section className="flex md:flex-row flex-col flex-wrap gap-4 my-10 print:hidden">
          <Button
            variant="outline"
            className={cn('w-fit h-fit')}
            onClick={() => {
              window.print();
            }}
          >
            <Printer className="mr-2 w-4 h-4" />
            Cetak
          </Button>

          <Button
            variant="outline"
            className={cn('w-fit h-fit')}
            onClick={() => {
              const url = 'https://app.audea.id/app/how-audea-works';
              toast.promise(navigator.clipboard.writeText(url), {
                loading: 'Menyalin tautan...',
                success: 'Tautan disalin!',
                error: 'Error saat menyalin tautan!',
              });
            }}
          >
            <Copy className="mr-2 w-4 h-4" />
            Salin tautan
          </Button>
        </section>
      </section>

      <section className="lg:flex hidden flex-col gap-4 w-fit h-fit justify-self-end sticky print:hidden">
        <p>Di halaman ini</p>
        <section className="flex flex-col gap-1">
          <a
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            href="#step-1"
          >
            Langkah 1
          </a>

          <a
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            href="#step-2"
          >
            Langkah 2
          </a>

          <a
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            href="#step-3"
          >
            Langkah 3
          </a>

          <a
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            href="#watch-tutorial"
          >
            Tonton tutorial
          </a>
        </section>
      </section>
    </motion.section>
  );
}
