'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  CountingDown,
  RecordingButton,
  RecordingInProgress,
  RenderFileUploader,
} from './components';
import DialogContentSettings from '../DialogContentSettings';
import { IGetContentSettings } from '../../graphql';

interface IUploadAndRecord {
  onFileUpload: (
    _file: File,
    _outputLanguage: string,
    _writingStyle: string,
    _typeOfPromptId: string
  ) => void;
  contentSettings: IGetContentSettings;
  token: string;
}

const UploadAndRecordNew: React.FC<IUploadAndRecord> = ({
  onFileUpload,
  contentSettings,
  token,
}) => {
  const [currentlyDragging, setCurrentlyDragging] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const [remainingTime, setRemainingTime] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const countdownTimer = useRef<number | null>(null);
  const recordingTimer = useRef<number | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [userChooseRecording, setUserChooseRecording] = useState(false);

  const [writingStyle, setWritingStyle] = useState(
    contentSettings.writingStyle
  );
  const [outputLanguage, setOutputLanguage] = useState(
    contentSettings.outputLanguage
  );
  const [typeOfPromptId, setTypeOfPromptId] = useState(
    contentSettings.typeOfPromptId
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserChooseRecording(false);

    const file = event.target.files?.[0];
    if (file) validateFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setUserChooseRecording(false);

    setCurrentlyDragging(false);

    event.preventDefault();

    const file = event.dataTransfer.files?.[0];
    validateFile(file);
  };

  const validateFile = (file: File | undefined) => {
    if (!file) {
      toast.error('Please upload an audio file.');
    } else if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file.');
    } else if (file.size > 25 * 1024 * 1024) {
      toast.error(
        'File size exceeds the limit. Please upload a file up to 25MB.'
      );
    } else {
      setFile(file);

      if (
        contentSettings.outputLanguage === 'ASK' ||
        contentSettings.typeOfPromptId === '647391c118e8a4e1170d3ec9' ||
        contentSettings.writingStyle === 'ASK'
      ) {
        setIsDialogOpen(true);
      } else {
        onFileUpload(file, writingStyle, outputLanguage, typeOfPromptId);
      }
    }
  };

  const getMicrophonePermission = (): Promise<MediaStream> => {
    return new Promise((resolve, reject) => {
      (async () => {
        if (!('MediaRecorder' in window)) {
          reject();
          toast.error(
            'The MediaRecorder API is not supported in your browser.'
          );
          return;
        }

        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          reject();
          toast.error('Currently, recording on Safari in unavailable');
        }
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          resolve(mediaStream);
        } catch (err) {
          reject();
          toast.error('You denied permission to use the microphone.');
        }
      })();
    });
  };

  const checkRecording = async () => {
    setUserChooseRecording(true);

    if (
      contentSettings.outputLanguage === 'ASK' ||
      contentSettings.typeOfPromptId === '647391c118e8a4e1170d3ec9' ||
      contentSettings.writingStyle === 'ASK'
    ) {
      setIsDialogOpen(true);
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    toast
      .promise(getMicrophonePermission(), {
        loading: 'Getting your microphone ready...',
        success: 'Microphone is ready!',
        error: 'Microphone is not ready!',
      })
      .then((data) => {
        setRecordingStatus('countdown');
        setCountdown(3);
        streamRef.current = data;
        countdownTimer.current = window.setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown === 1) {
              clearInterval(countdownTimer.current!);
              startRecordingAfterCountdown();
            }
            return prevCountdown - 1;
          });
        }, 1000);
      });
  };

  const startRecordingAfterCountdown = () => {
    setRecordingStatus('recording');
    setRemainingTime(900); // 15 minutes in seconds

    if (streamRef.current) {
      const supportWebM = MediaRecorder.isTypeSupported('audio/webm');

      const media = new MediaRecorder(streamRef.current, {
        mimeType: supportWebM ? 'audio/webm' : 'audio/mp4',
      });

      mediaRecorder.current = media;
      let localAudioChunks: Blob[] = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === 'undefined' || event.data.size === 0) return;
        localAudioChunks.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        if (supportWebM) {
          const file = new File(localAudioChunks, 'audio.webm', {
            type: 'audio/webm',
          });
          onFileUpload(file, writingStyle, outputLanguage, typeOfPromptId);
        }

        setRecordingStatus('inactive');
        setRemainingTime(0);
      };

      mediaRecorder.current.start();

      recordingTimer.current = window.setInterval(() => {
        setRemainingTime((prevRemainingTime) => {
          if (prevRemainingTime <= 1) {
            clearInterval(recordingTimer.current!);
            stopRecording();
            return 0;
          }
          return prevRemainingTime - 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  const cancelRecording = () => {
    clearInterval(countdownTimer.current!);
    clearInterval(recordingTimer.current!);
    setRecordingStatus('inactive');
    setCountdown(0);
    setRemainingTime(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(countdownTimer.current!);
      clearInterval(recordingTimer.current!);
    };
  }, []);

  return (
    <section className="mt-10 flex flex-col items-center justify-center gap-10">
      {isDialogOpen && (
        <DialogContentSettings
          isOpen={isDialogOpen}
          contentSettings={contentSettings}
          setIsOpen={setIsDialogOpen}
          onFinish={async (outputLanguage, writingStyle, typeOfPromptId) => {
            if (writingStyle === '') {
              setWritingStyle('Default');
            } else {
              setWritingStyle(writingStyle);
            }

            setOutputLanguage(
              outputLanguage as
                | 'TRANSCRIPT'
                | 'ENGLISH'
                | 'BAHASAINDONESIA'
                | 'CHINESE'
                | 'HINDI'
                | 'JAPANESE'
                | 'SPANISH'
                | 'FRENCH'
                | 'RUSSIAN'
                | 'URDU'
                | 'ARABIC'
                | 'ASK'
            );

            setTypeOfPromptId(typeOfPromptId);

            if (userChooseRecording) {
              await startRecording();
            } else {
              if (file)
                onFileUpload(
                  file,
                  outputLanguage,
                  writingStyle === '' ? 'Default' : writingStyle,
                  typeOfPromptId
                );
            }
          }}
          token={token}
        />
      )}

      {(() => {
        if (recordingStatus === 'inactive') {
          return (
            <RenderFileUploader
              currentlyDragging={currentlyDragging}
              setCurrentlyDragging={setCurrentlyDragging}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
            />
          );
        } else {
          return (
            <section className="w-full h-fit min-h-[372px] border-dashed border-2 border-primaryDark rounded-xl py-20 max-w-[800px] mx-auto relative flex flex-col items-center justify-center gap-2">
              {(() => {
                if (recordingStatus === 'countdown')
                  return <CountingDown countdown={countdown} />;

                if (recordingStatus === 'recording')
                  return (
                    <RecordingInProgress
                      remainingTime={remainingTime}
                      cancelRecording={cancelRecording}
                    />
                  );
              })()}
            </section>
          );
        }
      })()}

      {recordingStatus === 'inactive' && (
        <p className="text-primaryDark text-center text-sm">Or</p>
      )}

      {(() => {
        if (recordingStatus === 'inactive')
          return <RecordingButton type="Record" handleClick={checkRecording} />;

        if (recordingStatus === 'recording')
          return <RecordingButton type="Stop" handleClick={stopRecording} />;

        if (recordingStatus === 'countdown')
          return (
            <RecordingButton type="Cancel" handleClick={cancelRecording} />
          );
      })()}
    </section>
  );
};

export default UploadAndRecordNew;
