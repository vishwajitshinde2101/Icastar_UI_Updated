import React, { useState } from 'react'
import { Card } from '../../components/Card'
import { Applicant, Job, Page } from '../../types'
import { UsersIcon } from '../../components/icons/IconComponents'
import { useLocation, useNavigate } from 'react-router-dom'

const initialApplicants: Applicant[] = [
  {
    id: 1,
    jobId: 1,
    name: 'Lana Steiner',
    avatarUrl: 'https://picsum.photos/seed/lana/100/100',
    skills: ['UI/UX Design', 'Figma', 'Prototyping', 'User Research'],
    status: 'New',
    job: 'Senior Product Designer',
    appliedDate: '2 days ago',
    email: 'lana.steiner@example.com',
    phone: '555-123-4567',
    bio: 'A passionate product designer with 5+ years of experience creating intuitive and beautiful user experiences for B2B and B2C products.',
    portfolioUrl: 'https://dribbble.com/example',
  },
  {
    id: 2,
    jobId: 2,
    name: 'John Appleseed',
    avatarUrl: 'https://picsum.photos/seed/john/100/100',
    skills: ['Illustration', 'Animation', 'After Effects'],
    status: 'Viewed',
    job: 'Lead Illustrator',
    appliedDate: '3 days ago',
    email: 'john.appleseed@example.com',
    phone: '555-234-5678',
    bio: 'Creative illustrator and animator who brings stories to life with vibrant visuals and compelling motion graphics.',
    portfolioUrl: 'https://behance.net/example',
  },
  {
    id: 3,
    jobId: 1,
    name: 'Mia Wong',
    avatarUrl: 'https://picsum.photos/seed/mia/100/100',
    skills: ['Brand Identity', 'Graphic Design', 'Adobe Suite'],
    status: 'Interviewing',
    job: 'Senior Product Designer',
    appliedDate: '5 days ago',
    email: 'mia.wong@example.com',
    phone: '555-345-6789',
    bio: 'Strategic brand designer focused on creating memorable and impactful brand identities across digital and print media.',
    portfolioUrl: 'https://example.com/miawong',
  },
  {
    id: 4,
    jobId: 5,
    name: 'George Costanza',
    avatarUrl: 'https://picsum.photos/seed/george/100/100',
    skills: ['Architectural Design', 'Photography'],
    status: 'New',
    job: 'Architectural Photographer',
    appliedDate: '1 day ago',
    email: 'george.c@example.com',
    phone: '555-456-7890',
    bio: 'Architectural photographer with a keen eye for detail, light, and form. Also an expert in latex import/export.',
    portfolioUrl: 'https://vandelayindustries.com',
  },
  {
    id: 5,
    jobId: 4,
    name: 'Elaine Benes',
    avatarUrl: 'https://picsum.photos/seed/elaine/100/100',
    skills: ['Copywriting', 'Editing', 'Content Strategy'],
    status: 'Hired',
    job: 'Creative Copywriter',
    appliedDate: '2 weeks ago',
    email: 'elaine.b@example.com',
    phone: '555-567-8901',
    bio: 'Witty and sharp copywriter with a knack for creating compelling narratives for catalogs and campaigns.',
    portfolioUrl: 'https://jpeterman.com',
  },
  {
    id: 6,
    jobId: 2,
    name: 'Cosmo Kramer',
    avatarUrl: 'https://picsum.photos/seed/kramer/100/100',
    skills: ['Performance Art', 'Industrial Design'],
    status: 'Viewed',
    job: 'Lead Illustrator',
    appliedDate: '6 days ago',
    email: 'cosmo.k@example.com',
    phone: '555-678-9012',
    bio: 'An ideas man. Known for unconventional approaches to problem-solving and a unique artistic vision.',
    portfolioUrl: 'https://kramerica.com',
  },
  {
    id: 7,
    jobId: 1,
    name: 'Jerry Seinfeld',
    avatarUrl: 'https://picsum.photos/seed/jerry/100/100',
    skills: ['Figma', 'Web Design'],
    status: 'Interviewing',
    job: 'Senior Product Designer',
    appliedDate: '4 days ago',
    email: 'jerry.s@example.com',
    phone: '555-789-0123',
    bio: 'Observational designer who finds the humor and usability flaws in everyday digital interactions.',
    portfolioUrl: 'https://whats-the-deal-with.com',
  },
]
const StatusBadge: React.FC<{ status: Applicant['status'] }> = ({ status }) => {
  const baseClasses =
    'px-2.5 py-1 text-xs font-semibold rounded-full inline-block'
  const statusClasses = {
    New: 'bg-blue-100 text-blue-800',
    Viewed: 'bg-primary-light text-primary',
    Interviewing: 'bg-yellow-100 text-yellow-800',
    Hired: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  )
}

export const ApplicantsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)
  const job = location.state.job
  if (!job) {
    return null
  }

  const handleViewProfile = (applicant: Applicant) => {
    navigate('/applicant-profile', { state: { applicant } })
  }

  const filteredApplicants = applicants.filter(a => a.jobId === job.id)

  return (
    <div>
      <div className='flex items-center mb-6 gap-4'>
        <button
          onClick={() => navigate(-1)}
          className='text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors'
          aria-label='Back to Jobs'>
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
        <h2 className='text-3xl font-bold text-gray-900'>
          Applicants for "{job.title}"
        </h2>
      </div>
      <Card padding='sm'>
        {filteredApplicants.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Candidate
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Skills
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th scope='col' className='relative px-6 py-3'>
                    <span className='sr-only'>View</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredApplicants.map(applicant => (
                  <tr key={applicant.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-11 w-11'>
                          <img
                            className='h-11 w-11 rounded-full object-cover'
                            src={applicant.avatarUrl}
                            alt={applicant.name}
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-semibold text-gray-900'>
                            {applicant.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            Applied {applicant.appliedDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex flex-wrap gap-1.5'>
                        {applicant.skills.slice(0, 3).map(skill => (
                          <span
                            key={skill}
                            className='px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md'>
                            {skill}
                          </span>
                        ))}
                        {applicant.skills.length > 3 && (
                          <span className='px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-md'>
                            +{applicant.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <StatusBadge status={applicant.status} />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        onClick={() => handleViewProfile(applicant)}
                        className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors'>
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center py-16'>
            <UsersIcon className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-2 text-lg font-medium text-gray-900'>
              No Applicants Yet
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Check back later or boost this job to attract more candidates.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
