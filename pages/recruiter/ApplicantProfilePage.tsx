import React, { useEffect } from 'react'
import { Card } from '../../components/Card'
import { Applicant, Page } from '../../types'
import {
  MailIcon,
  PhoneIcon,
  LinkIcon,
  CalendarIcon,
  XCircleIcon,
  CheckCircleIcon,
} from '../../components/icons/IconComponents'
import { useLocation, useNavigate } from 'react-router-dom'

const StatusBadge: React.FC<{ status: Applicant['status'] }> = ({ status }) => {
  const baseClasses =
    'px-2.5 py-1 text-xs font-semibold rounded-full inline-block'
  const statusClasses = {
    New: 'bg-blue-100 text-blue-800',
    Viewed: 'bg-amber-100 text-amber-800',
    Interviewing: 'bg-yellow-100 text-yellow-800',
    Hired: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  )
}

const handleUpdateApplicantStatus = (
  applicantId: number,
  status: Applicant['status'],
) => {
  alert(status)
}

export const ApplicantProfilePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const applicant = location.state.applicant
  console.log(location.state)

  useEffect(() => {}, [applicant])

  if (!applicant) {
    return (
      <div className='text-center py-16'>
        <h3 className='text-lg font-medium text-gray-900'>
          No Applicant Selected
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
          Please go back to the applicants list and select a profile to view.
        </p>
        <button
          onClick={() => navigate(-1)}
          className='mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700'>
          Go to Jobs
        </button>
      </div>
    )
  }

  const Actions = () => {
    const baseButtonClasses =
      'w-full inline-flex justify-center items-center px-4 py-2.5 border text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2'
    const primaryButtonClasses = `${baseButtonClasses} border-transparent text-white bg-amber-600 hover:bg-amber-700 focus:ring-amber-500`
    const secondaryButtonClasses = `${baseButtonClasses} border-gray-300 text-gray-700 bg-white hover:bg-amber-50 focus:ring-amber-500`
    const hireButtonClasses = `${baseButtonClasses} border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500`

    switch (applicant.status) {
      case 'New':
      case 'Viewed':
        return (
          <div className='space-y-3'>
            <button
              onClick={() =>
                handleUpdateApplicantStatus(applicant.id, 'Interviewing')
              }
              className={primaryButtonClasses}>
              <CalendarIcon className='mr-2 h-5 w-5' />
              Schedule Interview
            </button>
            <button
              onClick={() =>
                handleUpdateApplicantStatus(applicant.id, 'Rejected')
              }
              className={secondaryButtonClasses}>
              <XCircleIcon className='mr-2 h-5 w-5' />
              Reject Applicant
            </button>
          </div>
        )
      case 'Interviewing':
        return (
          <div className='space-y-3'>
            <button
              onClick={() => handleUpdateApplicantStatus(applicant.id, 'Hired')}
              className={hireButtonClasses}>
              <CheckCircleIcon className='mr-2 h-5 w-5' />
              Make Offer & Hire
            </button>
            <button
              onClick={() =>
                handleUpdateApplicantStatus(applicant.id, 'Rejected')
              }
              className={secondaryButtonClasses}>
              <XCircleIcon className='mr-2 h-5 w-5' />
              Reject Applicant
            </button>
          </div>
        )
      default:
        return (
          <p className='text-sm text-gray-500 text-center py-4'>
            No further actions available for a {applicant.status.toLowerCase()}{' '}
            candidate.
          </p>
        )
    }
  }

  return (
    <div>
      <div className='flex items-center mb-6 gap-4'>
        <button
          onClick={() => navigate(-1)}
          className='text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors'
          aria-label='Back to Applicants'>
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
        <h2 className='text-3xl font-bold text-gray-900'>Applicant Profile</h2>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          <Card>
            <div className='flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0'>
              <img
                className='h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-white'
                src={applicant.avatarUrl}
                alt={applicant.name}
              />
              <div className='flex-1'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900'>
                      {applicant.name}
                    </h3>
                    <p className='text-md text-gray-600'>
                      Applying for:{' '}
                      <span className='font-semibold'>{applicant.job}</span>
                    </p>
                  </div>
                  <div className='flex-shrink-0 pt-1'>
                    <StatusBadge status={applicant.status} />
                  </div>
                </div>
                <div className='mt-3 text-sm text-gray-500 flex items-center'>
                  <CalendarIcon className='h-4 w-4 mr-2 text-gray-400' />
                  <span>Applied {applicant.appliedDate}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className='text-lg font-semibold text-gray-800 mb-4'>
              About {applicant.name.split(' ')[0]}
            </h4>
            <p className='text-gray-600 leading-relaxed'>
              {applicant.bio || 'No biography provided.'}
            </p>
          </Card>

          <Card>
            <h4 className='text-lg font-semibold text-gray-800 mb-4'>Skills</h4>
            <div className='flex flex-wrap gap-2'>
              {applicant.skills.map(skill => (
                <span
                  key={skill}
                  className='px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-800 rounded-lg'>
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
            <Actions />
          </Card>
          <Card>
            <h4 className='text-lg font-semibold text-gray-800 mb-4'>
              Contact & Links
            </h4>
            <ul className='space-y-3 text-sm'>
              {applicant.email && (
                <li className='flex items-center'>
                  <MailIcon className='h-5 w-5 text-gray-400 mr-3' />
                  <a
                    href={`mailto:${applicant.email}`}
                    className='text-amber-600 hover:underline hover:text-amber-800'>
                    {applicant.email}
                  </a>
                </li>
              )}
              {applicant.phone && (
                <li className='flex items-center'>
                  <PhoneIcon className='h-5 w-5 text-gray-400 mr-3' />
                  <span className='text-gray-700'>{applicant.phone}</span>
                </li>
              )}
              {applicant.portfolioUrl && (
                <li className='flex items-center'>
                  <LinkIcon className='h-5 w-5 text-gray-400 mr-3' />
                  <a
                    href={applicant.portfolioUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-amber-600 hover:underline hover:text-amber-800 truncate'>
                    {applicant.portfolioUrl.replace('https://', '')}
                  </a>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
