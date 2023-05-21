'use client';

import { EmptyPage } from '$lib/EmptyPage';
import { useState } from 'react';

export default function Client({ token }: { token: string }) {
  const [, setStillUploading] = useState(false);

  return <EmptyPage token={token} setStillUploading={setStillUploading} />;
}
