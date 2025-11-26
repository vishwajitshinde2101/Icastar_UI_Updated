import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import AuthPage from '@/pages/auth/AuthPage'
import Auth from '@/pages/auth/Auth'
import DashLayout from '@/layouts/DashLayout'
import { PostJobPage } from '@/pages/recruiter/PostJobPage'
import { BrowseArtistsPage } from '@/pages/recruiter/BrowseArtistsPage'
import { ChatCreditsPage } from '@/pages/recruiter/ChatCreditsPage'
import { PastHiresPage } from '@/pages/recruiter/PastHiresPage'
import { ApplicantProfilePage } from '@/pages/recruiter/ApplicantProfilePage'
import { ApplicantsPage } from '@/pages/recruiter/ApplicantsPage'
import { ArtistProfilePage } from '@/pages/recruiter/ArtistProfilePage'
import { PastHireDetailPage } from '@/pages/recruiter/PastHireDetailPage'
import { NotificationsPage } from '@/pages/recruiter/NotificationsPage'
import { SettingsPage } from '@/pages/recruiter/SettingsPage'
import DashboardIndex from '@/pages/DashboardIndex'
import Jobs from '@/pages/artist/Jobs'
import Bookmarks from '@/pages/artist/Bookmarks'
import Auditions from '@/pages/artist/Auditions'
import Applications from '@/pages/artist/Applications'
import Messages from '@/pages/artist/Messages'
import ProfileIndex from '@/pages/ProfileIndex'
import ArtistRegistrationForm from '@/pages/artist/ArtistRegistrationForm'

const AppRouter = () =>
  createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        {
          path: '/',
          element: <AuthPage />,
        },
        {
          path: '/auth',
          element: <Auth />,
        },
        {
          path: '/onboarding',
          element: <ArtistRegistrationForm />,
        },
        {
          element: <DashLayout />,
          children: [
            {
              path: '/dashboard',
              element: <DashboardIndex />,
            },
            {
              path: '/my-jobs',
              element: <PostJobPage />,
            },
            {
              path: '/jobs',
              element: <Jobs />,
            },
            {
              path: '/bookmarks',
              element: <Bookmarks />,
            },
            // {
            //   path: '/verified-badge',
            //   element: <VerifiedBadge />,
            // },
            {
              path: '/auditions',
              element: <Auditions />,
            },
            {
              path: '/applications',
              element: <Applications />,
            },
            {
              path: '/messages',
              element: <Messages />,
            },
            {
              path: '/artists',
              element: <BrowseArtistsPage />,
            },
            {
              path: '/chat-credits',
              element: <ChatCreditsPage />,
            },
            {
              path: '/hires',
              element: <PastHiresPage />,
            },
            {
              path: '/applicant-profile',
              element: <ApplicantProfilePage />,
            },
            {
              path: '/applicants',
              element: <ApplicantsPage />,
            },
            {
              path: '/artist-profile',
              element: <ArtistProfilePage />,
            },
            {
              path: '/past-hires',
              element: <PastHireDetailPage />,
            },
            {
              path: '/notifications',
              element: <NotificationsPage />,
            },
            {
              path: '/profile',
              element: <ProfileIndex />,
            },
            {
              path: '/settings',
              element: <SettingsPage />,
            },
            {
              path: '*',
              element: <Navigate to='/' replace />,
            },
          ],
        },
      ],
    },
  ])

export default AppRouter
