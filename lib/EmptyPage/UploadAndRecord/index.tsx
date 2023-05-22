'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  CountingDown,
  RecordingButton,
  RecordingInProgress,
  RenderFileUploader,
} from './atomic';

interface IUploadAndRecord {
  onFileUpload: (_file: File) => void;
}

const UploadAndRecord: React.FC<IUploadAndRecord> = ({ onFileUpload }) => {
  const [currentlyDragging, setCurrentlyDragging] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [recordingStatus, setRecordingStatus] = useState('inactive');
  // const [audio, setAudio] = useState('');
  // const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const countdownTimer = useRef<number | null>(null);
  const recordingTimer = useRef<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setCurrentlyDragging(false);
    const file = event.dataTransfer.files?.[0];
    validateAndUpload(file);
  };

  const validateAndUpload = (file: File | undefined) => {
    if (!file) {
      toast.error('Please upload an audio file.');
      return;
    }
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error(
        'File size exceeds the limit. Please upload a file up to 25MB.'
      );
      return;
    }
    onFileUpload(file);
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

          onFileUpload(file);
        } else {
          // setDisabledRecording(true);
          // const audioBlob = new Blob(localAudioChunks, {
          //   type: 'audio/mp4',
          // });
          // const audioUrl = URL.createObjectURL(audioBlob);
          // setAudio(audioUrl);
          // const file = new File([audioBlob], 'audio.mp4', {
          //   type: 'audio/mp4',
          // });
          // onFileUpload(file);
          // const sampleRate = 44100; // Set the desired sample rate
          // const numChannels = 2; // Set the desired number of channels (stereo)
          // const reader = new FileReader();
          // reader.onload = function () {
          //   const arrayBuffer = reader.result as ArrayBuffer;
          //   // Calculate the correct length based on the ArrayBuffer byte length
          //   const length = arrayBuffer.byteLength / 2; // 2 bytes per Int16Array element
          //   // Convert the ArrayBuffer to PCM
          //   // Create the Int16Array with the correct length and byteOffset set to 0
          //   const samples = new Int16Array(arrayBuffer, 0, length);
          //   const mp3encoder = new Mp3Encoder(numChannels, sampleRate, 128);
          //   const mp3Data = mp3encoder.encodeBuffer(samples);
          //   const mp3Blob = new Blob([mp3Data], { type: 'audio/mp3' });
          //   const file = new File([mp3Blob], 'audio.mp3', {
          //     type: 'audio/mp3',
          //   });
          //   onFileUpload(file);
          //   // Get the encoded MP3 as a Blob
          //   // const mp3Blob = new Blob([mp3Data], { type: 'audio/mp3' });
          //   // Do something with the MP3 Blob, e.g., save it or send it to the server
          //   // For example, you can create a download link for the MP3 file
          //   // const downloadLink = document.createElement('a');
          //   // downloadLink.href = URL.createObjectURL(mp3Blob);
          //   // downloadLink.download = 'recorded_audio.mp3';
          //   // downloadLink.click();
          // };
          // reader.readAsArrayBuffer(audioBlob);
        }

        // const audioUrl = URL.createObjectURL(audioBlob);
        // setAudio(audioUrl);
        // setAudioChunks([]);
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
    // setAudio('');
    // setAudioChunks([]);
  };

  useEffect(() => {
    return () => {
      clearInterval(countdownTimer.current!);
      clearInterval(recordingTimer.current!);
    };
  }, []);

  // const renderAudioPlayer = () => {
  //   return (
  //     <div className="audio-player">
  //       <audio src={audio} controls></audio>
  //       <a download href={audio}>
  //         Download Recording
  //       </a>
  //     </div>
  //   );
  // };

  return (
    <section className="mt-10 flex flex-col items-center justify-center gap-10">
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
          return <RecordingButton type="Record" handleClick={startRecording} />;

        if (recordingStatus === 'recording')
          return <RecordingButton type="Stop" handleClick={stopRecording} />;

        if (recordingStatus === 'countdown')
          return (
            <RecordingButton type="Cancel" handleClick={cancelRecording} />
          );
      })()}

      {/* {audio && renderAudioPlayer()} */}
    </section>
  );
};

export default UploadAndRecord;
