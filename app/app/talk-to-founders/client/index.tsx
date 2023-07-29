'use client'

import { Button } from '@/components/ui/button'
import { faSlack, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faCalendar, faMailReply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from '@/utils/cn'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import Image from 'next/image'
import FurqonFace from './images/faces/furqon.svg'
import AldiFace from './images/faces/aldi.svg'
import RizqyFace from './images/faces/rizqy.svg'
import FurqonBody from './images/body/furqon.svg'
import AldiBody from './images/body/aldi.svg'
import RizqyBody from './images/body/rizqy.svg'
import { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'
import { SLACK_AUDEANCE_INVITATION_URL } from '@/utils/constant'

export default function Client() {
  useEffect(() => {
    const getCal = async () => {
      const cal = await getCalApi()
      cal('ui', { styles: { branding: { brandColor: '#000000' } }, hideEventTypeDetails: false, layout: 'month_view' })
    }

    getCal()
  }, [])

  const teams = [
    {
      name: 'Furqon Wilogo',
      value: 'furqon',
      face: FurqonFace,
      body: FurqonBody,
      description: `Meet Furqon Wilogo, the Co-Founder of Audea! With a solid background in International Business and Business Analytics from the prestigious University of Sydney, Furqon brings a unique blend of business acumen and technical expertise to the team. Passionate about software engineering, they thrive on tackling complex challenges and finding innovative solutions. As a remote work enthusiast, Furqon embodies Audea's values of adaptability and collaboration, helping to build a cohesive and dynamic team that pushes the boundaries of what's possible.`,
      whatsapp: { link: '#', disabled: true },
      email: { link: 'mailto:furqon@durrrian.com', disabled: false },
    },
    {
      name: 'Aldi Megantara',
      value: 'aldi',
      face: AldiFace,
      body: AldiBody,
      description: `Introducing Aldi Megantara, the Co-Founder of Audea! With over 5 years of invaluable experience in the IT industry, Aldi brings a wealth of knowledge and expertise to our team. Their passion for technology and innovation has been the driving force behind Audea's cutting-edge solutions. As a visionary leader, Aldi's strategic mindset and dedication have played a pivotal role in shaping the company's success. Together with our team, they continue to pave the way for a brighter future, where technology transforms lives and empowers businesses.`,
      whatsapp: { link: 'https://wa.me/6281335085063', disabled: false },
      email: { link: 'mailto:aldi@durrrian.com', disabled: false },
    },
    {
      name: 'Rizqy Fachri',
      value: 'rizqy',
      face: RizqyFace,
      body: RizqyBody,
      description: `Meet Rizqy Fachri, the Co-Founder of Audea and the creative force behind our innovative designs! Holding an MBA from Institut Teknologi Bandung, Rizqy brings a perfect blend of business acumen and design expertise to the table. As a startup enthusiast, they are driven by a relentless passion for building groundbreaking solutions that redefine industries. With a keen eye for detail and a deep understanding of user experience, Rizqy crafts intuitive and visually captivating interfaces that leave a lasting impression on our clients and users. Together with our team, they are committed to revolutionizing the way we interact with technology and creating products that make a meaningful impact in the world.`,
      whatsapp: { link: 'https://wa.me/6287788405014', disabled: false },
      email: { link: 'mailto:furqon@durrrian.com', disabled: false },
    },
  ]

  return (
    <motion.section className='select-none space-y-20' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className='space-y-4'>
        <header className='space-y-2 text-lg'>
          <p>We believe in building the Audea with you, our user.</p>

          <p>If you have any feedback, suggestion, or anything at all, please don&apos;t hesitate to reach us.</p>

          <p>
            Fun fact: Audea is an Indonesian🇮🇩 startup, and is a part of our software house,{' '}
            <a href='https://durrrian.com' target='_blank' rel='noreferrer' className='text-blue-500 underline'>
              durrrian
            </a>
            .
          </p>
        </header>

        <section className='flex items-center flex-wrap gap-4'>
          <Button asChild>
            <a href={SLACK_AUDEANCE_INVITATION_URL} target='_blank' rel='noreferrer'>
              <FontAwesomeIcon icon={faSlack} className='mr-2' /> Join slack
            </a>
          </Button>
          <Button data-cal-link='durrrian/audea' data-cal-config='{"layout":"month_view"}'>
            <FontAwesomeIcon icon={faCalendar} className='mr-2' />
            Book a meeting
          </Button>
        </section>
      </section>

      <section className='space-y-8'>
        <h1 className='text-4xl font-bold'>Meet the team</h1>

        <Tabs
          defaultValue={(() => {
            const values = ['furqon', 'rizqy', 'aldi']
            return values[Math.floor(Math.random() * 3)]
          })()}
          className='w-full h-fit'
        >
          <TabsList className={cn('w-full h-fit md:flex-row flex-col')}>
            {teams.map(({ name, value, face }, i) => {
              return (
                <TabsTrigger value={value} className={cn('w-full md:text-lg text-base h-fit')} key={`${i}-header`}>
                  <Image src={face} alt={`${name} face`} width={25} quality={100} draggable={false} className='mr-2' />{' '}
                  {name}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {teams.map(({ value, body, name, description, whatsapp, email }, i) => {
            return (
              <TabsContent
                value={value}
                key={`${i}-content`}
                className={cn('md:grid md:grid-cols-[0.5fr_1fr] flex flex-col items-center justify-center gap-4')}
              >
                <div className='w-full h-fit flex items-center justify-center'>
                  <Image src={body} alt={`${name} body`} height={300} quality={100} draggable={false} />
                </div>

                <section className='w-full flex flex-col gap-4'>
                  <p className='text-justify'>{description}</p>

                  <section className='flex items-center gap-4'>
                    <Button asChild variant='secondary'>
                      <a
                        href={whatsapp.link}
                        target={whatsapp.disabled ? undefined : '_blank'}
                        rel={whatsapp.disabled ? undefined : 'noreferrer'}
                        className={`${
                          whatsapp.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'
                        }`}
                      >
                        <FontAwesomeIcon icon={faWhatsapp} className='mr-2 h-4 w-4' />
                        WhatsApp
                      </a>
                    </Button>

                    <Button asChild variant='secondary'>
                      <a
                        href={email.link}
                        target={email.disabled ? undefined : '_blank'}
                        rel={email.disabled ? undefined : 'noreferrer'}
                        className={`${email.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
                      >
                        <FontAwesomeIcon icon={faMailReply} className='mr-2 h-4 w-4' />
                        Email
                      </a>
                    </Button>
                  </section>
                </section>
              </TabsContent>
            )
          })}
        </Tabs>
      </section>
    </motion.section>
  )
}
