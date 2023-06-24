'use client';

import '$styles/animation.css';
import { useEffect, useState } from 'react';
import { UseChromeModal, UseIOS, UseIpadOS, UseSafariModal } from './atomic';
import { Button } from '../ui/button';
import cn from '@/utils/cn';
import { PlusSquare } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallButton = () => {
  const [ready, setReady] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [supported, setSupported] = useState(false);
  const [useSafari, setUseSafari] = useState(false);
  const [useIOS, setUseIOS] = useState(false);
  const [useIpadOS, setUseIpadOS] = useState(false);
  const [useChrome, setUseChrome] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(
    {} as BeforeInstallPromptEvent | null
  );

  useEffect(() => {
    if ('BeforeInstallPromptEvent' in window) {
      setSupported(true);
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      });
    } else if (
      /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2 &&
        /Macintosh/.test(navigator.userAgent))
    ) {
      if (
        navigator.userAgent.match('CriOS') ||
        navigator.userAgent.match('FxiOS') ||
        navigator.userAgent.match('OPT') ||
        // @ts-ignore
        !!navigator.brave
      ) {
        setUseSafari(true);
      } else {
        if (window.innerWidth >= 450) {
          setUseIpadOS(true);
        } else {
          setUseIOS(true);
        }
      }
    } else {
      setUseChrome(true);
    }
  }, []);

  useEffect(() => {
    if (supported) {
      if (
        deferredPrompt !== null &&
        deferredPrompt !== undefined &&
        Object.keys(deferredPrompt).length !== 0
      ) {
        setReady(true);
      } else {
        setReady(false);
      }
    }
  }, [supported, deferredPrompt]);

  const installApp = async () => {
    if (
      deferredPrompt !== null &&
      deferredPrompt !== undefined &&
      Object.keys(deferredPrompt).length !== 0
    ) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        location.reload();
        console.log('😀 User accepted the install prompt.');
      } else if (outcome === 'dismissed') {
        console.log('😟 User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      <Button
        className={cn('w-fit h-fit')}
        onClick={async () => {
          supported ? await installApp() : setModalOpen(true);
        }}
        disabled={!ready}
        type="button"
      >
        {ready ? (
          <PlusSquare className="mr-2 w-4 h-4" />
        ) : (
          <LoadingSpinner size={4} />
        )}
        Install as a PWA
      </Button>

      {useChrome && (
        <UseChromeModal isOpen={modalOpen} setIsOpen={setModalOpen} />
      )}

      {useSafari && (
        <UseSafariModal isOpen={modalOpen} setIsOpen={setModalOpen} />
      )}

      {useIOS && (
        <UseIOS
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      )}

      {useIpadOS && (
        <UseIpadOS
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default InstallButton;
