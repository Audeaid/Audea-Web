'use client';

import LogoSecondary from '$public/logo/secondary.svg';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Progress1,
  Progress2,
  Progress3,
  Progress4,
  Progress5,
} from './progress';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getEmailOtp, searchUserByEmail, verifyEmailOtp } from './helper';
import { capitalizeEveryWord } from '@/helper';

const copyWriting = [
  {
    title: 'Accurate Voice-to-Text Conversion',
    explanation:
      'Audea ensures precise transcriptions by utilizing advanced speech recognition technology. Its integration with ChatGPT enhances the process, resulting in well-crafted text representations of voice notes.',
  },

  {
    title: 'Intelligent Note Generation',
    explanation:
      'Audea analyzes transcriptions to provide contextually enriched notes. It identifies key concepts, delivers insights, and offers summaries, enabling quick understanding and efficient information retrieval.',
  },

  {
    title: 'Seamless Integration with Productivity Tools',
    explanation:
      'Audea offers seamless integration with popular productivity tools like Notion, Todoist, and others. Users can easily connect their Audea notes with these platforms, enabling streamlined workflows and enhancing productivity.',
  },
];

export default function SignupClient() {
  const router = useRouter();
  const [progress, setProgress] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [jwtToken, setJwtToken] = useState('');

  //Progress 1 state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen flex">
      <section className="w-[40%] min-h-screen lg:flex hidden flex-col gap-10 bg-background">
        <motion.nav
          className="w-full h-[100px] flex items-center justify-start px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <a href="/">
            <Image
              src={LogoSecondary}
              alt="Audea Logo"
              width={120}
              quality={100}
              draggable={false}
            />
          </a>
        </motion.nav>

        <motion.section
          className="flex flex-col gap-8 px-4 max-w-[500px] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-lg text-primary ">
            Create your Audea account to transform your workflow
          </h2>

          <section className="flex flex-col gap-6 pr-8">
            {copyWriting.map(({ title, explanation }, index) => {
              return (
                <section
                  key={index}
                  className="flex items-start justify-center gap-2"
                >
                  <div className="text-primary">
                    <FontAwesomeIcon icon={faCircleRight} />
                  </div>
                  <section className="flex flex-col gap-1">
                    <h6 className="text-onPrimaryContainer font-medium">
                      {title}
                    </h6>
                    <p className="text-onPrimaryContainer/60 text-xs text-justify">
                      {explanation}
                    </p>
                  </section>
                </section>
              );
            })}
          </section>
        </motion.section>
      </section>

      <section className="w-full min-h-screen flex flex-col gap-10 relative">
        <motion.nav
          className="w-full lg:flex hidden justify-end items-center h-[100px] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <section className="font-medium flex items-center justify-center w-fit h-fit gap-2">
            <p>Already have an account? </p>

            <a href="/login">
              <button className="text-primaryDark flex items-center justify-center text-base gap-1">
                Login
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </a>
          </section>
        </motion.nav>

        <motion.nav
          className="w-full h-fit sm:px-20 sm:py-10 px-4 py-6 lg:hidden flex sm:flex-row flex-col justify-between items-center select-none gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <a href="/">
            <Image
              src={LogoSecondary}
              alt="Audea Logo"
              width={120}
              quality={100}
              draggable={false}
            />
          </a>

          <section className="font-medium flex items-center justify-center w-fit h-fit gap-2">
            <p>Already have an account? </p>

            <a href="/login">
              <button className="text-primaryDark flex items-center justify-center text-base gap-1">
                Login
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </a>
          </section>
        </motion.nav>

        {(() => {
          switch (progress) {
            case 1:
              return (
                <Progress1
                  handleSubmit={async (e) => {
                    e.preventDefault();

                    setLoading(true);

                    const formData = new FormData(e.currentTarget);
                    const emailForm = formData.get('email');

                    try {
                      if (emailForm !== null) {
                        const isEmailExistResponse = await searchUserByEmail({
                          email: emailForm.toString(),
                        });

                        const isEmailExist = isEmailExistResponse !== null;

                        if (isEmailExist) {
                          setErrorMsg(
                            'Email is already registered, please login!'
                          );
                          setLoading(false);
                        } else {
                          // Email does not exist
                          setEmail(emailForm.toString());

                          await getEmailOtp({ email: emailForm.toString() });

                          setLoading(false);

                          setProgress(2);
                        }
                      }
                    } catch (error) {
                      setErrorMsg(
                        "We could not reach Audea's server. Please try again in a few minutes."
                      );

                      setLoading(false);

                      console.error(error);
                    }
                  }}
                  errorMsg={errorMsg}
                  loading={loading}
                />
              );

            case 2:
              return (
                <Progress2
                  email={email}
                  loading={loading}
                  handleSubmit={async (e) => {
                    e.preventDefault();

                    setLoading(true);

                    try {
                      const formData = new FormData(e.currentTarget);

                      const otpArr: string[] = [];

                      for (let i = 0; i < 6; i++) {
                        const otpNum = formData.get(`otp-${i}`);

                        if (otpNum !== null) {
                          otpArr.push(otpNum.toString());
                        }
                      }

                      const otp = otpArr.join('');

                      toast
                        .promise(verifyEmailOtp({ email, otp }), {
                          loading: 'Checking your code...',
                          success: 'Code verified!',
                          error: 'Wrong code!',
                        })
                        .then(
                          (data) => {
                            setLoading(false);
                            setJwtToken(data.token);
                            setProgress(3);
                          },
                          () => {
                            setLoading(false);
                          }
                        );
                    } catch (error) {
                      console.error(error);
                      setLoading(false);
                    }
                  }}
                />
              );

            case 3:
              return (
                <Progress3
                  handleSubmit={async (e) => {
                    e.preventDefault();

                    const formData = new FormData(e.currentTarget);
                    const passwordForm = formData.get('password');

                    if (passwordForm !== null) {
                      setPassword(passwordForm.toString());
                    }

                    setProgress(4);
                  }}
                />
              );

            case 4:
              return (
                <Progress4
                  handleSubmit={async (e) => {
                    e.preventDefault();

                    const formData = new FormData(e.currentTarget);
                    const nameForm = formData.get('name');

                    if (nameForm !== null) {
                      const name = capitalizeEveryWord(nameForm.toString());
                      setName(name);
                    }

                    setProgress(5);
                  }}
                />
              );

            case 5:
              return (
                <Progress5
                  email={email}
                  password={password}
                  name={name}
                  jwtToken={jwtToken}
                  router={router}
                />
              );

            default:
              return <></>;
          }
        })()}

        <Toaster
          position="bottom-center"
          containerStyle={{ position: 'absolute' }}
        />
      </section>
    </main>
  );
}
