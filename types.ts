export enum Page {
  Dashboard = 'Dashboard',
  Jobs = 'Jobs',
  Applicants = 'Applicants',
  BrowseArtists = 'Browse Artists',
  Suggestions = 'Suggestions',
  ChatCredits = 'Chat Credits',
  PastHires = 'Past Hires',
  PastHireDetail = 'Past Hire Detail',
  ApplicantProfile = 'Applicant Profile',
  ArtistProfile = 'Artist Profile',
  Profile = 'profile',
  Settings = 'settings',
  Notifications = 'Notifications',
  Bookmarks = 'Bookmarks',
  VerifiedBadge = 'Verified Badge',
  Auditions = 'Auditions',
  Applications = 'Applications',
  Messages = 'Messages',
}

export type VerificationStatus = 'Verified' | 'Pending' | 'Not Verified'
export type RecruiterType = 'In-house' | 'Agency' | 'Freelance'

export interface Recruiter {
  name: string
  title: string
  email: string
  avatarUrl: string
  companyName?: string
  companyWebsite?: string
  companyBio?: string
  verificationStatus?: VerificationStatus
  recruiterType?: RecruiterType
}

export interface Applicant {
  id: number
  name: string
  avatarUrl: string
  skills: string[]
  status: 'New' | 'Viewed' | 'Interviewing' | 'Hired' | 'Rejected'
  job: string
  jobId: number
  appliedDate: string
  email?: string
  phone?: string
  bio?: string
  portfolioUrl?: string
}

export interface Notification {
  id: number
  type: 'applicant' | 'job' | 'message'
  text: string
  time: string
  read: boolean
}

export interface Artist {
  id: number
  name: string
  avatarUrl: string
  bio: string
  skills: string[]
  email?: string
  portfolioUrl?: string
}

export interface SuggestedArtist extends Artist {
  matchScore: number
  reason: string
}

export interface Hire {
  id: number
  artist: Artist
  jobTitle: string
  jobId: number
  hiredDate: string
}

export interface Job {
  id: number
  title: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance'
  applicants: number
  status: 'Active' | 'Draft' | 'Closed'
  postedDate: string // For display
  createdDate: string // ISO String for manipulation
  description?: string
  skills?: string
  boosted?: boolean
}

export enum ArtistCategory {
  Actor = 'Actor / Actress / Model',
  Dancer = 'Dancers & Choreographers',
  Director = 'Director',
  Writer = 'Writer',
  Makeup = 'Makeup & Hair Dresser',
  Singer = 'Singer',
  Musician = 'Musician',
  Comedian = 'Stand-up Comedian',
  Band = 'Band / Music Group',
  DJ_RJ = 'DJ / RJ',
}