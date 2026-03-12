import React, { useState, useEffect } from 'react'
import Icon from './Icon'
import artistService from '@/services/artistService'

const Navbar: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string>('')

  useEffect(() => {
    // Read user name from localStorage
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const user = JSON.parse(stored)
        setFullName(user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim())
      } catch {}
    }

    // Fetch profile photo from API
    artistService.getMyProfile().then((data) => {
      if (data?.profilePhoto) setProfilePhoto(data.profilePhoto)
      if (!fullName && data?.fullName) setFullName(data.fullName)
    }).catch(() => {})
  }, [])

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
          <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0'>
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={fullName || 'Profile'}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-amber-100 flex items-center justify-center'>
                <Icon name='User' size={18} className='text-amber-600' />
              </div>
            )}
          </div>
          <div>
            <p className='font-semibold text-sm'>{fullName || 'Artist'}</p>
            <p className='text-xs text-gray-500'>Artist</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
