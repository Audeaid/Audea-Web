'use client';

import { EmptyPage } from '$lib/EmptyPage';
import { IGetAllContent } from './graphql';
import { useState } from 'react';
import { ContentList } from '$lib/ContentList';

export default function Client({
  token,
  content,
}: {
  token: string;
  content: IGetAllContent[] | null;
}) {
  const [stillUploading, setStillUploading] = useState(false);

  if (content === null || stillUploading) {
    return <EmptyPage token={token} setStillUploading={setStillUploading} />;
  } else {
    return <ContentList content={content} />;
  }
}
