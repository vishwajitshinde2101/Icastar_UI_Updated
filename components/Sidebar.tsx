import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Page } from '../types'
import {
  LayoutGrid,
  Briefcase,
  Bookmark,
  BadgeCheck,
  MicVocal,
  FileText,
  MessageSquare,
} from 'lucide-react'
import {
  BriefcaseIcon,
  CreditCardIcon,
  DashboardIcon,
  HistoryIcon,
  WandSparklesIcon,
  SearchIcon,
  XIcon,
} from './icons/IconComponents'
import logo from '../assets/icaster.png'
import { UserRole } from '@/types/types'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

// Define role-wise nav items
const roleBasedNavItems: Record<
  string,
  { page: Page; icon: any; path: string }[]
> = {
  [UserRole.RECRUITER]: [
    { page: Page.Dashboard, icon: DashboardIcon, path: '/dashboard' },
    { page: Page.Jobs, icon: BriefcaseIcon, path: '/my-jobs' },
    { page: Page.BrowseArtists, icon: SearchIcon, path: '/artists' },
    { page: Page.ChatCredits, icon: CreditCardIcon, path: '/chat-credits' },
    { page: Page.PastHires, icon: HistoryIcon, path: '/hires' },
  ],
  [UserRole.ARTIST]: [
    { page: Page.Dashboard, icon: DashboardIcon, path: '/dashboard' },
    { page: Page.Jobs, icon: BriefcaseIcon, path: '/jobs' },
    { page: Page.Bookmarks, icon: Bookmark, path: '/bookmarks' },
    // {
    //   page: Page.VerifiedBadge,
    //   icon: BadgeCheck,
    //   path: '/verified-badge',
    // },
    { page: Page.Auditions, icon: MicVocal, path: '/auditions' },
    { page: Page.Applications, icon: FileText, path: '/applications' },
    // { page: Page.Messages, icon: MessageSquare, path: '/messages' },
  ],
  [UserRole.ADMIN]: [
    { page: Page.Dashboard, icon: DashboardIcon, path: '/dashboard' },
    { page: Page.BrowseArtists, icon: SearchIcon, path: '/artists' },
    { page: Page.Jobs, icon: BriefcaseIcon, path: '/jobs' },
    { page: Page.ChatCredits, icon: CreditCardIcon, path: '/chat-credits' },
  ],
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem('role')
  console.log(role)
  const handleNavigation = (path: string) => {
    navigate(path)
    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }

  // Pick nav items based on role
  const navItems = roleBasedNavItems[role] || []

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 flex flex-col z-40 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <div className='h-20 w-full flex items-center justify-between px-8 shrink-0'>
        <div className='flex items-center'>
          <img
            src={logo}
            alt='iCaster'
            className='h-14 w-full object-contain'
          />
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className='lg:hidden p-1 text-gray-500 hover:text-gray-800'
          aria-label='Close menu'>
          <XIcon className='h-6 w-6' />
        </button>
      </div>

      {/* Separator */}
      <div className='px-4 py-2'>
        <div className='border-t border-gray-200'></div>
      </div>

      <nav className='flex-1 px-3 py-2 overflow-y-auto'>
        <ul>
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.page}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center w-full text-left px-4 py-2.5 my-1 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-light text-primary font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}>
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      isActive ? 'text-primary' : 'text-gray-400'
                    }`}
                  />
                  {item.page}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Upgrade box only for recruiter role (optional) */}
      {role === UserRole.RECRUITER && (
        <div className='p-4 shrink-0'>
          <div className='bg-primary-light rounded-lg p-4 text-center'>
            <h3 className='font-semibold text-gray-800'>Upgrade your Plan</h3>
            <p className='text-sm text-gray-600 mt-1 mb-3'>
              Get access to premium features.
            </p>
            <button className='w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors'>
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
