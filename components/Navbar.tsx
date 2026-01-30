import React from 'react'
import Icon from './Icon'

const Navbar: React.FC = () => {
  return (
    <header className='flex-shrink-0 bg-white/30 backdrop-blur-sm h-20 flex items-center justify-between px-8 border-b border-purple-100'>
      <div className='flex items-center gap-4'>
        <div className='relative'>
          <Icon
            name='Search'
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            size={20}
          />
          <input
            type='text'
            placeholder='Search for jobs, artists...'
            className='w-80 h-12 pl-10 pr-4 bg-white rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all'
          />
        </div>
      </div>
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-3'>
          <img
            src='https://picsum.photos/seed/useravatar/40/40'
            alt='User Avatar'
            className='w-10 h-10 rounded-full'
          />
          <div>
            <p className='font-semibold text-sm'>Aria Sharma</p>
            <p className='text-xs text-gray-500'>Artist</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
