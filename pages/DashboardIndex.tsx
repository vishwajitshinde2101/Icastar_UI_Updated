import React from 'react'
import ArtistDashboard from './artist/ArtistDashboard'
import { RecruiterDashboard } from './recruiter/RecruiterDashboard'
import { UserRole } from '@/types/types'

const DashboardIndex = () => {
  const role = localStorage.getItem('role')

  switch (role) {
    case UserRole.ARTIST:
      return <ArtistDashboard />
    case UserRole.RECRUITER:
      return <RecruiterDashboard />
    default:
      return <ArtistDashboard />
  }
}

export default DashboardIndex
