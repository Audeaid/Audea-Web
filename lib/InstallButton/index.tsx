'use client'

import '@/styles/animation.css'
import { useEffect, useLayoutEffect, useState } from 'react'
import { UseChromeModal, UseIOS, UseIpadOS, UseSafariModal } from './atomic'
import { Button } from '@/components/ui/button'
import cn from '@/utils/cn'
import { PlusSquare } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function InstallButton() {
  const [ready, setReady] = useState(true)
  const [installed, setInstalled] = useState(false)
  const [supported, setSupported] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)

  const [useSafari, setUseSafari] = useState(false)
  const [useIOS, setUseIOS] = useState(false)
  const [useIpadOS, setUseIpadOS] = useState(false)
  const [useChrome, setUseChrome] = useState(false)

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useLayoutEffect(() => {
    // Check if user already install the PWA
    if ('matchMedia' in window) {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setInstalled(true)
      } else {
        setInstalled(false)
      }
    } else {
      setInstalled(false)
    }

    if ('BeforeInstallPromptEvent' in window) {
      setSupported(true)
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        console.log(e)
        setDeferredPrompt(e as BeforeInstallPromptEvent)
      })
    } else if (
      // Check if use the apple ecosystem
      /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Macintosh/.test(navigator.userAgent))
    ) {
      if (
        // This means user is using other browser than safari
        navigator.userAgent.match('CriOS') ||
        navigator.userAgent.match('FxiOS') ||
        navigator.userAgent.match('OPT') ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        !!navigator.brave
      ) {
        setUseSafari(true)
      } else {
        if (window.innerWidth >= 450) {
          setUseIpadOS(true)
        } else {
          setUseIOS(true)
        }
      }
    } else {
      setUseChrome(true)
    }
  }, [])

  useEffect(() => {
    if (supported) {
      if (deferredPrompt !== null && deferredPrompt !== undefined && Object.keys(deferredPrompt).length !== 0) {
        setReady(true)
      } else {
        setReady(false)
      }
    }
  }, [supported, deferredPrompt])

  const installApp = async () => {
    if (deferredPrompt !== null && deferredPrompt !== undefined && Object.keys(deferredPrompt).length !== 0) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        location.reload()
        // console.log('😀 User accepted the install prompt.')
      } else if (outcome === 'dismissed') {
        // console.log('😟 User dismissed the install prompt')
      }
      setDeferredPrompt(null)
    }
  }

  return (
    <>
      {installed ? (
        <Button variant='ghost' disabled={true} className={cn('w-fit h-fit')}>
          Already installed PWA
        </Button>
      ) : (
        <Button
          className={cn('w-fit h-fit')}
          onClick={async () => {
            supported ? await installApp() : setModalOpen(true)
          }}
          disabled={!ready}
          type='button'
        >
          {ready ? <PlusSquare className='mr-2 w-4 h-4' /> : <LoadingSpinner size={4} />}
          Install as a PWA
        </Button>
      )}

      {useChrome && <UseChromeModal isOpen={modalOpen} setIsOpen={setModalOpen} />}

      {useSafari && <UseSafariModal isOpen={modalOpen} setIsOpen={setModalOpen} />}

      {useIOS && (
        <UseIOS
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
          }}
        />
      )}

      {useIpadOS && (
        <UseIpadOS
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
          }}
        />
      )}
    </>
  )
}
