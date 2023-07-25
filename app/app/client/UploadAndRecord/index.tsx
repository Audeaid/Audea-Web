'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IGetContentSettings } from '../../graphql'
import DialogSettings from '../DialogSettings'
import { RenderFileUploader } from './RenderFileUploader'
import CountingDown from './CountingDown'
import RecordingInProgress from './RecordingInProgress'
import RecordingButton from './RecordingButton'
import toast from 'react-hot-toast'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js'
import WaveSurfer from 'wavesurfer.js'

interface IUploadAndRecord {
  // eslint-disable-next-line no-unused-vars
  onFileUpload: (_file: File, _outputLanguage: string, _writingStyle: string, _typeOfPromptId: string) => void
  contentSettings: IGetContentSettings
  token: string
}

export default function UploadAndRecord({ onFileUpload, contentSettings, token }: IUploadAndRecord) {
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      import('audio-recorder-polyfill').then((AudioRecorderPolyfill) => {
        window.MediaRecorder = AudioRecorderPolyfill.default || AudioRecorderPolyfill
      })
    }
  }, [])

  const [recordingStatus, setRecordingStatus] = useState('inactive')

  const [isDialogSettingOpen, SetIsDialogSettingOpen] = useState(false)
  const [userChooseRecording, setUserChooseRecording] = useState(false)

  const [userStartRecording, setUserStartRecording] = useState(false)

  const [file, setFile] = useState<File | null>(null)

  const [currentlyDragging, setCurrentlyDragging] = useState(false)

  const [countdownToRecording, setCountdownToRecording] = useState(3)
  const countdownTimer = useRef<number | null>(null)
  const [remainingRecordingTime, setRemainingRecordingTime] = useState(0)
  const recordingTimer = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const recordRef = useRef<RecordPlugin | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)

  const dialogNeedRender =
    contentSettings.outputLanguage === 'ASK' ||
    contentSettings.typeOfPromptId === '647391c118e8a4e1170d3ec9' ||
    contentSettings.writingStyle === 'ASK'

  useEffect(() => {
    if (userStartRecording && waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'rgb(59, 130, 246)',
      })

      const recordPlugin = wavesurfer.registerPlugin(RecordPlugin.create())

      wavesurferRef.current = wavesurfer
      recordRef.current = recordPlugin

      return () => {
        wavesurfer.destroy()
        wavesurferRef.current = null
        recordRef.current = null
      }
    }
  }, [userStartRecording])

  const validateFile = (
    file: File | undefined,
    outputLanguage: string,
    writingStyle: string,
    typeOfPromptId: string,
  ) => {
    if (!file) {
      toast.error('Please upload an audio file.')
    } else if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      toast.error('Please upload an audio file.')
    } else if (file.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds the limit. Please upload a file up to 25MB.')
    } else {
      setFile(file)

      if (
        contentSettings.outputLanguage === 'ASK' ||
        contentSettings.typeOfPromptId === '647391c118e8a4e1170d3ec9' ||
        contentSettings.writingStyle === 'ASK'
      ) {
        SetIsDialogSettingOpen(true)
      } else {
        onFileUpload(file, outputLanguage, writingStyle, typeOfPromptId)
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
    }

    if (recordRef.current) {
      recordRef.current.stopRecording()
    }

    clearInterval(countdownTimer.current!)
    clearInterval(recordingTimer.current!)
    setCountdownToRecording(0)
    setRemainingRecordingTime(0)
  }

  const startRecording = (outputLanguage: string, writingStyle: string, typeOfPromptId: string) => {
    toast
      .promise(getMicrophonePermission(), {
        loading: 'Getting your microphone ready...',
        success: 'Microphone is ready!',
        error: 'Microphone is not ready!',
      })
      .then((data) => {
        setRecordingStatus('countdown')
        setCountdownToRecording(3)

        streamRef.current = data

        countdownTimer.current = window.setInterval(() => {
          setCountdownToRecording((prevCountdown) => {
            setUserStartRecording(true)

            if (prevCountdown === 1) {
              const wavesurfer = wavesurferRef.current
              const recordPlugin = recordRef.current

              if (wavesurfer) {
                const isPlaying = wavesurfer.isPlaying()

                if (isPlaying) {
                  wavesurfer.pause()
                }
              }

              if (recordPlugin) {
                recordPlugin
                  .startRecording()
                  .then(() => {
                    startRecordingAfterCountdown(outputLanguage, writingStyle, typeOfPromptId)
                  })
                  .catch((error) => {
                    console.error('Recording error:', error)
                  })
              }

              clearInterval(countdownTimer.current!)
            }
            return prevCountdown - 1
          })
        }, 1000)
      })
  }

  const startRecordingAfterCountdown = (outputLanguage: string, writingStyle: string, typeOfPromptId: string) => {
    setRecordingStatus('recording')
    setRemainingRecordingTime(900)

    if (streamRef.current) {
      mediaRecorder.current = new MediaRecorder(streamRef.current)

      const audioChunks: Blob[] = []
      mediaRecorder.current.addEventListener('dataavailable', async (e) => {
        audioChunks.push(e.data)
      })

      mediaRecorder.current.addEventListener('stop', () => {
        const file = new File(audioChunks, 'audio.mp3', {
          type: 'audio/mpeg',
        })

        onFileUpload(file, outputLanguage, writingStyle, typeOfPromptId)
      })

      mediaRecorder.current.start()

      recordingTimer.current = window.setInterval(() => {
        setRemainingRecordingTime((prevRemainingTime) => {
          if (prevRemainingTime <= 1) {
            clearInterval(recordingTimer.current!)
            stopRecording()
            return 0
          }
          return prevRemainingTime - 1
        })
      }, 1000)
    }
  }

  const cancelRecording = () => {
    clearInterval(countdownTimer.current!)
    clearInterval(recordingTimer.current!)
    setRecordingStatus('inactive')
    setCountdownToRecording(0)
    setRemainingRecordingTime(0)
    setUserChooseRecording(false)
    setUserStartRecording(false)
  }

  return (
    <section
      className={`flex flex-col items-center justify-center ${recordingStatus === 'countdown' ? 'gap-10' : 'gap-4'}`}
    >
      {dialogNeedRender && (
        <DialogSettings
          isOpen={isDialogSettingOpen}
          contentSettings={contentSettings}
          setIsOpen={SetIsDialogSettingOpen}
          onFinish={(outputLanguage, writingStyle, typeOfPromptId) => {
            if (userChooseRecording) {
              startRecording(outputLanguage, writingStyle, typeOfPromptId)
            } else {
              if (file) onFileUpload(file, outputLanguage, writingStyle, typeOfPromptId)
            }
          }}
          token={token}
        />
      )}

      <section className='border-dashed border-2 border-border rounded-xl py-16 max-w-[800px] mx-auto relative sm:px-0 px-4 w-full h-fit'>
        {userStartRecording && (
          <div
            ref={waveformRef}
            className={`w-full h-fit px-4 ${recordingStatus === 'recording' ? 'block' : 'hidden'}`}
          />
        )}

        {(() => {
          if (recordingStatus === 'inactive') {
            return (
              <RenderFileUploader
                currentlyDragging={currentlyDragging}
                setCurrentlyDragging={setCurrentlyDragging}
                handleDrop={(e) => {
                  e.preventDefault()

                  setUserChooseRecording(false)

                  setCurrentlyDragging(false)

                  const file = e.dataTransfer.files?.[0]
                  validateFile(
                    file,
                    contentSettings.outputLanguage,
                    contentSettings.writingStyle,
                    contentSettings.typeOfPromptId,
                  )
                }}
                handleFileChange={(e) => {
                  setUserChooseRecording(false)

                  const file = e.target.files?.[0]
                  if (file)
                    validateFile(
                      file,
                      contentSettings.outputLanguage,
                      contentSettings.writingStyle,
                      contentSettings.typeOfPromptId,
                    )
                }}
              />
            )
          } else if (recordingStatus === 'countdown') {
            return <CountingDown countdown={countdownToRecording} />
          } else if (recordingStatus === 'recording') {
            return <RecordingInProgress remainingTime={remainingRecordingTime} cancelRecording={cancelRecording} />
          } else {
            return <></>
          }
        })()}
      </section>

      {recordingStatus === 'inactive' && <p className='text-center text-sm'>Or</p>}

      {(() => {
        if (recordingStatus === 'inactive')
          return (
            <RecordingButton
              type='Record'
              handleClick={() => {
                setUserChooseRecording(true)

                if (
                  contentSettings.outputLanguage === 'ASK' ||
                  contentSettings.typeOfPromptId === '647391c118e8a4e1170d3ec9' ||
                  contentSettings.writingStyle === 'ASK'
                ) {
                  SetIsDialogSettingOpen(true)
                } else {
                  startRecording(
                    contentSettings.outputLanguage,
                    contentSettings.writingStyle,
                    contentSettings.typeOfPromptId,
                  )
                }
              }}
            />
          )

        if (recordingStatus === 'recording') return <RecordingButton type='Stop' handleClick={stopRecording} />

        if (recordingStatus === 'countdown') return <RecordingButton type='Cancel' handleClick={cancelRecording} />
      })()}
    </section>
  )
}

const getMicrophonePermission = (): Promise<MediaStream> => {
  return new Promise((resolve, reject) => {
    const fetchMediaStream = async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      if (MediaRecorder.notSupported) {
        reject()
        toast.error('The MediaRecorder API is not supported in your browser.')
        return
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        resolve(mediaStream)
      } catch (err) {
        reject()
        toast.error('You denied permission to use the microphone.')
      }
    }

    fetchMediaStream()
  })
}
