'use client'

import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'

interface Props {
  contentId: string
  title: string | null
  date: string
}

export default function OneContentListView({ contentId, title, date }: Props) {
  return (
    <a href={`/app/saved/${contentId}`} className='w-full h-fit flex items-center justify-between gap-10 flex-nowrap'>
      <section className='flex items-center justify-center gap-2 font-normal sm:text-lg text-base w-full max-w-full truncate'>
        <FontAwesomeIcon icon={faNewspaper} />
        <p className='w-full max-w-full truncate'>{title ?? 'No Title'}</p>
      </section>

      <div className='min-w-fit h-fit'>
        <p className='font-light text-base sm:block hidden'>{moment(date).format('MMMM DD, YYYY HH:mm')}</p>

        <p className='font-light text-xs sm:hidden block'>{moment(date).format('MM/DD/YY')}</p>
      </div>
    </a>
  )
}
