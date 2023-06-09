'use client';

import { UserProfile, useClerk } from '@clerk/nextjs';
import './styles.css';
import { useEffect } from 'react';

export default function Page() {
  const { loaded } = useClerk();
  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        const paragraphs = document.getElementsByTagName('p');
        console.log(paragraphs.length);
        for (let i = 0; i < paragraphs.length; i++) {
          paragraphs[i].id = 'clerkKontolGuaGabisaStylingNgentot';
        }
      }, 1000);
    }
  }, [loaded]);

  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center select-none">
      <UserProfile
        path="/app/accounts"
        routing="path"
        appearance={{
          elements: {
            card: 'border-0 shadow-none rounded-none',
            navbar: 'hidden',
            scrollBox: 'text-foreground bg-background rounded-none',
            pageScrollBox: 'text-foreground bg-background rounded-none',
            page: 'text-foreground bg-background',
            profilePage: 'text-foreground',
            header: 'text-foreground',
            headerTitle: 'text-foreground',
            headerSubtitle: 'text-foreground',
            profileSectionTitleText: 'text-foreground',
            profileSectionTitle: 'border-border',
            userPreviewMainIdentifier: 'text-foreground',
            accordionTriggerButton: 'text-foreground',
            accordionContent: 'text-foreground',
            breadcrumbs: 'hidden',
            formField: 'text-foreground',
            formFieldLabel: 'text-foreground',
            form: 'text-foreground',
            formFieldSuccessText: 'text-foreground',
            formHeader: 'text-foreground',
            formHeaderSubtitle: 'text-foreground',
            otpCodeFieldInput: 'border-border',
            navbarMobileMenuButton: 'hidden',
          },
        }}
      />
    </main>
  );
}
