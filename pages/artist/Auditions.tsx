import React, { useState } from 'react'
import Icon from '@/components/Icon'

const auditions = [
  {
    icon: 'Video',
    title: 'TV Ad Shoot',
    date: '20 Aug 2025',
    location: 'Mumbai',
    company: 'AdWorks',
  },
  {
    icon: 'Mic',
    title: 'Music Album Recording',
    date: '25 Aug 2025',
    location: 'Worli',
    company: 'Symphony Records',
  },
  {
    icon: 'Drama',
    title: 'Theatre Play "The Last Act"',
    date: '05 Sep 2025',
    location: 'Delhi',
    company: 'StageKraft',
  },
  {
    icon: 'Radio',
    title: 'Radio Jockey Hunt',
    date: '12 Sep 2025',
    location: 'Bangalore',
    company: 'FM Rainbow',
  },
]

const AuditionItem: React.FC<(typeof auditions)[0]> = ({
  icon,
  title,
  date,
  location,
  company,
}) => (
  <li className='bg-white/90 rounded-2xl p-5 flex items-center gap-5 hover:bg-amber-50 transition-colors duration-300 shadow-md border border-amber-50'>
    <div className='bg-amber-100 text-amber-800 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0'>
      <Icon name={icon as any} size={32} />
    </div>
    <div className='flex-grow'>
      <h3 className='font-bold text-lg'>{title}</h3>
      <p className='text-sm text-gray-500'>{company}</p>
    </div>
    <div className='text-right flex-shrink-0'>
      <p className='font-semibold text-amber-700'>{date}</p>
      <p className='text-sm text-gray-600 flex items-center justify-end gap-1'>
        <Icon name='MapPin' size={14} />
        {location}
      </p>
    </div>
  </li>
)

const Auditions: React.FC = () => {
  const [view, setView] = useState<'list' | 'map'>('list')

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl font-bold'>Upcoming Auditions</h1>
          <p className='text-gray-600'>
            Your chance to shine. Don't miss these opportunities.
          </p>
        </div>
        <div className='flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm'>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              view === 'list'
                ? 'bg-amber-600 text-white shadow'
                : 'text-gray-600 hover:bg-amber-50'
            }`}>
            <Icon name='List' size={20} className='inline mr-2' />
            List View
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              view === 'map'
                ? 'bg-amber-600 text-white shadow'
                : 'text-gray-600 hover:bg-amber-50'
            }`}>
            <Icon name='Map' size={20} className='inline mr-2' />
            Map View
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <ul className='space-y-4'>
          {auditions.map((aud, index) => (
            <AuditionItem key={index} {...aud} />
          ))}
        </ul>
      ) : (
        <div className='bg-white rounded-2xl shadow-lg p-6 h-[60vh] flex items-center justify-center text-center'>
          <div>
            <img
              src='https://i.imgur.com/gX3A1v3.png'
              alt='Map placeholder'
              className='rounded-xl'
            />
            <h3 className='text-xl font-bold mt-4 text-gray-700'>
              Map View is Coming Soon!
            </h3>
            <p className='text-gray-500'>
              Visually explore auditions near you.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Auditions
