import React, { useState } from 'react'
import { Card } from '../../components/Card'
import { Job } from '../../types'
import {
  MailIcon,
  LinkIcon,
  BriefcaseIcon,
} from '../../components/icons/IconComponents'
import { HireRequestModal } from '../../components/HireRequestModal'
import { useLocation, useNavigate } from 'react-router-dom'
const initialJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Product Designer',
    type: 'Full-time',
    applicants: 18,
    status: 'Active',
    postedDate: '5 days ago',
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      'We are looking for a senior product designer to join our team.',
    skills: 'Figma, UI/UX, Prototyping',
    boosted: true,
  },
  {
    id: 2,
    title: 'Lead Illustrator',
    type: 'Contract',
    applicants: 32,
    status: 'Active',
    postedDate: '1 week ago',
    createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Seeking a talented illustrator for a new project.',
    skills: 'Illustration, Procreate',
    boosted: false,
  },
  {
    id: 3,
    title: 'Brand Designer',
    type: 'Full-time',
    applicants: 0,
    status: 'Draft',
    postedDate: '2 days ago',
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Join our marketing team as a brand designer.',
    skills: 'Branding, Adobe Suite',
    boosted: false,
  },
  {
    id: 4,
    title: 'Creative Copywriter',
    type: 'Part-time',
    applicants: 56,
    status: 'Closed',
    postedDate: '1 month ago',
    createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Write compelling copy for our creative campaigns.',
    skills: 'Copywriting, SEO',
    boosted: false,
  },
  {
    id: 5,
    title: 'Architectural Photographer',
    type: 'Contract',
    applicants: 21,
    status: 'Active',
    postedDate: '3 days ago',
    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Capture stunning photos of architectural projects.',
    skills: 'Photography, Lightroom',
    boosted: false,
  },
  {
    id: 6,
    title: 'Motion Graphics Artist',
    type: 'Full-time',
    applicants: 12,
    status: 'Active',
    postedDate: '10 days ago',
    createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Create engaging motion graphics for our videos.',
    skills: 'After Effects, Cinema 4D',
    boosted: false,
  },
  {
    id: 7,
    title: 'Junior UI Designer',
    type: 'Full-time',
    applicants: 45,
    status: 'Active',
    postedDate: '12 days ago',
    createdDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Assist our design team with UI tasks.',
    skills: 'Figma, Sketch',
    boosted: false,
  },
  {
    id: 8,
    title: 'Sound Designer',
    type: 'Freelance',
    applicants: 8,
    status: 'Closed',
    postedDate: '2 months ago',
    createdDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Design sound for our new game.',
    skills: 'Pro Tools, Sound Design',
    boosted: false,
  },
  {
    id: 9,
    title: 'SEO Specialist',
    type: 'Part-time',
    applicants: 25,
    status: 'Active',
    postedDate: '15 days ago',
    createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Optimize our web content for search engines.',
    skills: 'SEO, Google Analytics',
    boosted: true,
  },
  {
    id: 10,
    title: 'Videographer',
    type: 'Contract',
    applicants: 15,
    status: 'Active',
    postedDate: '20 days ago',
    createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Shoot and edit video content for social media.',
    skills: 'Premiere Pro, Videography',
    boosted: false,
  },
  {
    id: 11,
    title: 'Head of Content',
    type: 'Full-time',
    applicants: 3,
    status: 'Draft',
    postedDate: '1 day ago',
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Lead our content strategy and team.',
    skills: 'Content Strategy, Management',
    boosted: false,
  },
]
export const ArtistProfilePage = () => {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const artist = location.state.artist

  if (!artist) {
    // This is a fallback in case the page is rendered without a selected artist.
    return (
      <div className='text-center py-16'>
        <h3 className='text-lg font-medium text-gray-900'>
          No Artist Selected
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
          Please go back and select an artist to view their profile.
        </p>
        <button
          onClick={() => navigate(-1)}
          className='mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover'>
          Browse Artists
        </button>
      </div>
    )
  }

  const handleOpenHireModal = () => {
    setIsHireModalOpen(true)
  }

  const handleSendRequest = (jobId: string, message: string) => {
    const selectedJob = jobs.find(j => j.id === parseInt(jobId))
    console.log({
      artistId: artist.id,
      jobId,
      jobTitle: selectedJob?.title,
      message,
    })
    alert(
      `Hire request sent to ${artist.name} for the role of ${selectedJob?.title}!`,
    )
    setIsHireModalOpen(false)
  }

  return (
    <>
      <HireRequestModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        onSendRequest={handleSendRequest}
        artist={artist}
        jobs={jobs.filter(j => j.status === 'Active')}
      />
      <div>
        <div className='flex items-center mb-6 gap-4'>
          <button
            onClick={() => navigate(-1)}
            className='text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors'
            aria-label='Back to Browse Artists'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='M19 12H5' />
              <path d='m12 19-7-7 7-7' />
            </svg>
          </button>
          <h2 className='text-3xl font-bold text-gray-900'>Artist Profile</h2>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <Card>
              <div className='flex items-start space-x-6'>
                <img
                  className='h-28 w-28 rounded-full object-cover ring-4 ring-white'
                  src={artist.avatarUrl}
                  alt={artist.name}
                />
                <div className='pt-2'>
                  <h3 className='text-2xl font-bold text-gray-900'>
                    {artist.name}
                  </h3>
                  <p className='text-md text-gray-600 leading-relaxed mt-2'>
                    {artist.bio || 'No biography provided.'}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h4 className='text-lg font-semibold text-gray-800 mb-4'>
                Skills
              </h4>
              <div className='flex flex-wrap gap-2'>
                {artist.skills.map(skill => (
                  <span
                    key={skill}
                    className='px-3 py-1.5 text-sm font-medium bg-primary-light text-primary rounded-full'>
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <div className='lg:col-span-1 space-y-8'>
            <Card>
              <h4 className='text-lg font-semibold text-gray-800 mb-4'>
                Actions
              </h4>
              <button
                onClick={handleOpenHireModal}
                className='w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
                <BriefcaseIcon className='mr-2 h-5 w-5' />
                Send Hire Request
              </button>
            </Card>
            <Card>
              <h4 className='text-lg font-semibold text-gray-800 mb-4'>
                Contact & Links
              </h4>
              <ul className='space-y-3 text-sm'>
                {artist.email && (
                  <li className='flex items-center'>
                    <MailIcon className='h-5 w-5 text-gray-400 mr-3' />
                    <a
                      href={`mailto:${artist.email}`}
                      className='text-primary hover:underline'>
                      {artist.email}
                    </a>
                  </li>
                )}
                {artist.portfolioUrl && (
                  <li className='flex items-center'>
                    <LinkIcon className='h-5 w-5 text-gray-400 mr-3' />
                    <a
                      href={artist.portfolioUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary hover:underline truncate'>
                      {artist.portfolioUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                )}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
