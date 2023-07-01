'use client';

import cn from '@/utils/cn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import English from './English';
import Bahasa from './Bahasa';

export default function Client() {
  return (
    <Tabs defaultValue="english" className="w-full h-fit">
      <TabsList className="w-full print:hidden">
        <TabsTrigger value="english" className={cn('w-full')}>
          🇺🇸 English
        </TabsTrigger>
        <TabsTrigger value="bahasa-indonesia" className={cn('w-full')}>
          🇮🇩 Bahasa Indonesia
        </TabsTrigger>
      </TabsList>
      <TabsContent value="english" className={cn('mt-10')}>
        <English />
      </TabsContent>
      <TabsContent value="bahasa-indonesia" className={cn('mt-10')}>
        <Bahasa />
      </TabsContent>
    </Tabs>
  );
}
