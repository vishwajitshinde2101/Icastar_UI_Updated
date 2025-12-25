import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { UserRole } from '@/types/types'
import artistService from '@/services/artistService'

const DashLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState<string>('dashboard')
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)
  const navigate = useNavigate()

  // Example dummy data for header props
  const recruiterData = { name: 'John Doe', role: 'Admin' }
  const [notifications, setNotifications] = useState<string[]>(['Welcome!'])

  // Check if artist profile exists
  useEffect(() => {
    const checkProfile = async () => {
      const role = localStorage.getItem('role') as UserRole

      if (role === UserRole.ARTIST) {
        // Check if profile exists via API
        try {
          const profile = await artistService.getMyProfile()

          // If profile exists, update localStorage with isOnboardingComplete status
          if (profile) {
            const isOnboardingComplete = profile?.isOnboardingComplete === true
            localStorage.setItem('isOnboardingComplete', String(isOnboardingComplete))
            // Profile exists, allow access to dashboard
          } else {
            // Profile doesn't exist, redirect to onboarding
            localStorage.setItem('isOnboardingComplete', 'false')
            navigate('/onboarding', { replace: true })
            return
          }
        } catch (error) {
          // If API fails (profile doesn't exist), redirect to onboarding
          console.error('Failed to fetch profile:', error)
          localStorage.setItem('isOnboardingComplete', 'false')
          navigate('/onboarding', { replace: true })
          return
        }
      }

      setIsCheckingOnboarding(false)
    }

    checkProfile()
  }, [navigate])

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Show loading state while checking onboarding
  if (isCheckingOnboarding) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-base-bg font-sans">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleToggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          recruiter={recruiterData}
          setActivePage={setActivePage}
          notifications={notifications}
          setNotifications={setNotifications}
          onMenuClick={handleToggleSidebar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-bg p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashLayout
