import React, { useState, useEffect, useRef } from 'react'
import { Recruiter, Page, Notification } from '../types'
import {
  BellIcon,
  ChevronDownIcon,
  CogIcon,
  LogOutIcon,
  UserCircleIcon,
  UsersIcon,
  BriefcaseIcon,
  MailIcon,
  MenuIcon,
} from './icons/IconComponents'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import userService from '@/services/userService'

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'applicant',
    text: 'Lana Steiner applied for Senior Product Designer.',
    time: '2m ago',
    read: false,
  },
  {
    id: 2,
    type: 'job',
    text: 'Your job post "Lead Illustrator" is expiring soon.',
    time: '1h ago',
    read: false,
  },
  {
    id: 3,
    type: 'message',
    text: 'You have a new message from John Appleseed.',
    time: '1d ago',
    read: true,
  },
  {
    id: 4,
    type: 'applicant',
    text: 'George Costanza applied for Architectural Photographer.',
    time: '2d ago',
    read: true,
  },
]
const initialRecruiterData: Recruiter = {
  name: 'Alex Morgan',
  title: 'Recruiter',
  email: 'alex.morgan@creativ.com',
  avatarUrl: 'https://picsum.photos/seed/recruiter/100/100',
  companyName: 'Creativ Inc.',
  companyWebsite: 'https://creativ.com',
  companyBio:
    "Creativ is a platform connecting the world's best artists with innovative companies. We believe in the power of creativity to drive progress.",
  verificationStatus: 'Verified',
  recruiterType: 'In-house',
}
interface HeaderProps {
  onMenuClick: () => void
}

const NotificationIcon: React.FC<{
  type: Notification['type']
  className?: string
}> = ({ type, className }) => {
  switch (type) {
    case 'applicant':
      return <UsersIcon className={className} />
    case 'job':
      return <BriefcaseIcon className={className} />
    case 'message':
      return <MailIcon className={className} />
    default:
      return <BellIcon className={className} />
  }
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications)
  const [recruiter, setRecruiter] =
    useState<Recruiter>(initialRecruiterData)
  const hasUnreadNotifications = notifications.some(n => !n.read)
  const role = localStorage.getItem('role')
  const user = localStorage.getItem('user')
  console.log(role, user)

  useEffect(() => {
    try {
      const storedUser = userService.getStoredUser()
      if (storedUser?.email) {
        setUserEmail(storedUser.email)
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNavigation = (page: Page) => {
    console.log(page)
    navigate(`/${page}`)
    setIsDropdownOpen(false)
  }

  const handleToggleNotifications = () => {
    const willBeOpen = !isNotificationOpen
    setIsNotificationOpen(willBeOpen)

    if (willBeOpen && hasUnreadNotifications) {
      // Mark as read after a short delay to give user time to see what was new
      setTimeout(() => {
        setNotifications(prevNotifications =>
          prevNotifications.map(n => ({ ...n, read: true })),
        )
      }, 2000)
    }
  }

  const handleViewAll = () => {
    navigate('/notifications')
    setIsNotificationOpen(false)
  }

  return (
    <header className='h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:justify-end lg:px-8 shrink-0'>
      <button
        onClick={onMenuClick}
        className='lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700'
        aria-label='Open menu'>
        <MenuIcon className='h-6 w-6' />
      </button>
      <div className='flex items-center space-x-3 sm:space-x-5'>
        <div className='relative' ref={notificationRef}>
          <button
            onClick={handleToggleNotifications}
            className='p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 relative'
            aria-expanded={isNotificationOpen}
            aria-haspopup='true'>
            <BellIcon className='h-6 w-6' />
            {hasUnreadNotifications && (
              <span className='absolute top-1 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white'></span>
            )}
          </button>

          {isNotificationOpen && (
            <div className='origin-top-right absolute right-0 mt-2 w-80 max-w-sm rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 focus:outline-none'>
              <div className='py-1'>
                <div className='px-4 py-3 border-b border-gray-100'>
                  <p className='text-sm font-semibold text-gray-900'>
                    Notifications
                  </p>
                </div>
                <div className='divide-y divide-gray-100 max-h-80 overflow-y-auto'>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300 ${
                          !notification.read ? 'bg-purple-50' : ''
                        }`}>
                        <div className='flex-shrink-0 mt-0.5'>
                          <NotificationIcon
                            type={notification.type}
                            className='h-5 w-5 text-gray-400'
                          />
                        </div>
                        <div className='ml-3 w-0 flex-1'>
                          <p className='text-sm text-gray-800 leading-snug'>
                            {notification.text}
                          </p>
                          <p className='mt-1 text-xs text-gray-500'>
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='px-4 py-8 text-center'>
                      <p className='text-sm text-gray-500'>
                        No new notifications
                      </p>
                    </div>
                  )}
                </div>
                <div className='px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl'>
                  <button
                    onClick={handleViewAll}
                    className='block w-full text-center text-sm font-medium text-primary hover:text-primary-hover'>
                    View All Notifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center space-x-3 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors'
            aria-expanded={isDropdownOpen}
            aria-haspopup='true'>
            <img
              className='h-10 w-10 rounded-full object-cover'
              src={recruiter.avatarUrl}
              alt='User avatar'
            />
            <div className='hidden md:block text-left'>
              <p className='text-sm font-semibold text-gray-800'>
              {userEmail ?? recruiter.email}
              </p>
              <p className='text-xs text-gray-500'>{role}</p>
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 hidden md:block transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className='origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 focus:outline-none'>
              <div className='py-1'>
                <div className='px-4 py-3 border-b border-gray-100'>
                  <p className='text-sm font-semibold text-gray-900 leading-tight'>
                     {userEmail ?? recruiter.email}
                  </p>
                  <p className='text-sm text-gray-500 truncate'>
                    {userEmail ?? recruiter.email}
                  </p>
                </div>
                <button
                  onClick={() => handleNavigation(Page.Profile)}
                  className='flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100'>
                  <UserCircleIcon className='mr-3 h-5 w-5 text-gray-400' />
                  My Profile
                </button>
                <button
                  onClick={() => handleNavigation(Page.Settings)}
                  className='flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100'>
                  <CogIcon className='mr-3 h-5 w-5 text-gray-400' />
                  Settings
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    userService.logout();
                    toast.success('You have been logged out successfully');
                    navigate('/auth');
                  }}
                  className='flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100 mt-1 pt-2'>
                  <LogOutIcon className='mr-3 h-5 w-5 text-gray-400' />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
