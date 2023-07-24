'use client'

import { UserProfile, useClerk } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function Client() {
  const { loaded } = useClerk()

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        const paragraphs = document.getElementsByTagName('p')
        for (let i = 0; i < paragraphs.length; i++) {
          paragraphs[i].id = 'clerkKontolGuaGabisaStylingNgentot'
        }
      }, 2000)
    }
  }, [loaded])

  return (
    <UserProfile
      path='/app/accounts'
      routing='path'
      appearance={{
        elements: {
          card: 'border-0 shadow-none rounded-none',
          navbar: 'hidden',
          scrollBox: 'text-foreground bg-background rounded-none',
          pageScrollBox: 'text-foreground bg-background rounded-none pt-0 px-0 pb-4',
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
          otpCodeFieldInput: 'border-border text-foreground',
          navbarMobileMenuButton: 'hidden',
          otpCodeFieldInputs: 'text-foreground',
          otpCodeBox: 'text-foreground',
          otpCodeField: 'text-foreground',
        },
      }}
    />
  )
}
