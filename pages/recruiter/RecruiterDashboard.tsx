import React, { useState } from 'react'
import { Card } from '../../components/Card'
import { Applicant, Page } from '../../types'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { useNavigate } from 'react-router-dom'

const stats = [
  { name: 'Active Jobs', value: '12', change: '+2', changeType: 'positive' },
  {
    name: 'Total Applicants',
    value: '316',
    change: '+20%',
    changeType: 'positive',
  },
  { name: 'New Messages', value: '8', change: '-3', changeType: 'negative' },
  { name: 'Total Hires', value: '24', change: '+1', changeType: 'positive' },
]

const chartData = [
  { name: 'Jan', applicants: 40 },
  { name: 'Feb', applicants: 30 },
  { name: 'Mar', applicants: 50 },
  { name: 'Apr', applicants: 48 },
  { name: 'May', applicants: 60 },
  { name: 'Jun', applicants: 55 },
  { name: 'Jul', applicants: 72 },
]
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
  const baseClasses = 'px-2 py-0.5 text-xs font-medium rounded-full'
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

export const RecruiterDashboard = () => {
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)
  const latestApplicants = applicants.slice(0, 3)

  const handleViewProfile = (applicant: Applicant) => {
    navigate('/applicant-profile', { state: { applicant } })
  }

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map(stat => (
          <Card key={stat.name}>
            <p className='text-sm font-medium text-gray-500'>{stat.name}</p>
            <div className='flex items-baseline mt-1.5'>
              <p className='text-3xl font-bold text-gray-900'>{stat.value}</p>
              <p
                className={`ml-2 text-sm font-semibold ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                {stat.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Applicant Trends
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#A855F7' stopOpacity={0.4} />
                  <stop offset='95%' stopColor='#A855F7' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
              <XAxis dataKey='name' stroke='#9ca3af' fontSize={12} />
              <YAxis stroke='#9ca3af' fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
              <Area
                type='monotone'
                dataKey='applicants'
                stroke='#A855F7'
                strokeWidth={2}
                fillOpacity={1}
                fill='url(#colorUv)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card padding='sm'>
        <h3 className='text-lg font-semibold text-gray-800 px-6 pt-4'>
          Latest Applicants
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 mt-4'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Applied for
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
              {latestApplicants.map(applicant => (
                <tr key={applicant.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <img
                          className='h-10 w-10 rounded-full'
                          src={applicant.avatarUrl}
                          alt=''
                        />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {applicant.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {applicant.skills.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{applicant.job}</div>
                    <div className='text-sm text-gray-500'>
                      {applicant.appliedDate}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <StatusBadge status={applicant.status} />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button
                      onClick={() => handleViewProfile(applicant)}
                      className='text-primary hover:text-primary-hover font-medium'>
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
