'use client';

import LogoSecondary from '$public/logo/secondary.svg';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

const LeftSection = () => {
  return (
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
  );
};

export default LeftSection;
