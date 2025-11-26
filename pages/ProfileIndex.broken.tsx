import React from 'react'
import { RecruiterProfilePage } from './recruiter/RecruiterProfilePage'
import Profile from './artist/Profile'

const ProfileIndex = () => {
  const role = localStorage.getItem('role')

  switch (role) {
    case 'artist':
      return <Profile />
    case 'recruiter':
      return <RecruiterProfilePage />
    default:
      return (
        <div className='text-center p-6'>
          No Profile available for your role.
        </div>
      )
  }
}

export default ProfileIndex
