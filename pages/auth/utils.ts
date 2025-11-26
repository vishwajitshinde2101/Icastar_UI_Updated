import { UserRole } from '@/types/types'
import { Camera, Globe, Mic, Music, Star, Users } from 'lucide-react'

export const roles = [
  {
    id: UserRole.ARTIST,
    title: 'Artist',
    subtitle: 'Showcase Your Talent',
    description:
      'Create your profile, audition for roles, and connect with top recruiters in the entertainment industry. Build your portfolio and get discovered.',
    icon: Star,
    color: 'from-orange-600 to-amber-500',
    features: [
      'Digital Portfolio',
      'Video Auditions',
      'Direct Messaging',
      'Profile Analytics',
      'Casting Alerts',
    ],
  },
  {
    id: UserRole.RECRUITER,
    title: 'Recruiter',
    subtitle: 'Discover Amazing Talent',
    description:
      'Post casting calls, discover talented artists, conduct live auditions, and manage your talent pipeline with powerful tools.',
    icon: Users,
    color: 'from-orange-500 to-yellow-400',
    features: [
      'Casting Management',
      'Talent Search',
      'Live Auditions',
      'Subscription Plans',
      'Analytics Dashboard',
    ],
  },
]

export const features = [
  {
    icon: Camera,
    title: 'Video Auditions',
    description:
      'Record and submit auditions with professional-grade video tools and live streaming capabilities.',
  },
  {
    icon: Music,
    title: 'Talent Showcase',
    description:
      'Create stunning portfolios with photos, videos, and performance reels to showcase your unique talent.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description:
      'Connect with casting directors, agents, and talent from around the world in one unified platform.',
  },
  {
    icon: Mic,
    title: 'Live Casting',
    description:
      'Participate in real-time casting calls and auditions with interactive features and instant feedback.',
  },
]
