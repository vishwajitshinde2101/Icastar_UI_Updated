import React, { useEffect, useState } from 'react'
import { Card } from '../../components/Card'
import { Recruiter, VerificationStatus } from '../../types'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '../../components/icons/IconComponents'
import { getRecruiterProfile } from '@/services/recruiterProfileService'

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

interface InputFieldProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  autoComplete?: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  autoComplete = 'off',
}) => (
  <div>
    <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
      {label}
    </label>
    <input
      type={type}
      name={id}
      id={id}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className='mt-1 block w-full rounded-lg border-gray-300 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5'
    />
  </div>
)

interface TextAreaFieldProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}
const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  id,
  value,
  onChange,
  rows = 4,
}) => (
  <div>
    <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
      {label}
    </label>
    <textarea
      rows={rows}
      name={id}
      id={id}
      value={value}
      onChange={onChange}
      className='mt-1 block w-full rounded-lg border-gray-300 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5'
    />
  </div>
)

const VerificationStatusCard: React.FC<{ status: VerificationStatus }> = ({
  status,
}) => {
  const statusConfig = {
    Verified: {
      text: 'Profile Verified',
      description: 'Your profile is verified and trusted.',
      icon: CheckCircleIcon,
      colorClasses: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-500',
    },
    Pending: {
      text: 'Verification Pending',
      description: 'Your profile is under review.',
      icon: ClockIcon,
      colorClasses: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-500',
    },
    'Not Verified': {
      text: 'Profile Not Verified',
      description: 'Submit your profile for verification.',
      icon: ExclamationCircleIcon,
      colorClasses: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-500',
    },
  }

  const config = statusConfig[status] || statusConfig['Not Verified']
  const Icon = config.icon

  return (
    <div
      className={`flex items-center p-3 rounded-lg border ${config.colorClasses}`}>
      <Icon className={`h-6 w-6 mr-3 flex-shrink-0 ${config.iconColor}`} />
      <div className='flex-grow'>
        <p className={`font-semibold text-sm`}>{config.text}</p>
        <p className='text-sm opacity-80'>{config.description}</p>
      </div>
      {status !== 'Verified' && (
        <button className='ml-4 flex-shrink-0 text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-lg'>
          {status === 'Pending' ? 'Check Status' : 'Submit for Verification'}
        </button>
      )}
    </div>
  )
}

export const RecruiterProfilePage = () => {
  const [recruiter, setRecruiter] = useState<Recruiter>(initialRecruiterData)
  const [formData, setFormData] = useState<Recruiter>(recruiter)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getRecruiterProfile()
        setRecruiter(data)
        setFormData(data)
      } catch (e: any) {
        setError(e?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // setRecruiterData(formData)
    alert('Profile saved successfully!')
  }

  const handleCancel = () => {
    setFormData(recruiter)
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-3xl font-bold text-gray-900 mb-6'>My Profile</h2>

      {error && (
        <div className='mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm'>
          {error}
        </div>
      )}

      <div className='space-y-8'>
        <VerificationStatusCard
          status={formData.verificationStatus || 'Not Verified'}
        />

        <Card>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            Personal Information
          </h3>
          <p className='text-sm text-gray-500 mb-6'>
            Update your photo and personal details here.
          </p>

          <div className='flex items-center gap-6 mb-8'>
            <img
              className='h-20 w-20 rounded-full object-cover'
              src={formData.avatarUrl}
              alt='Current avatar'
            />
            <div>
              <button className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors'>
                Change Avatar
              </button>
              <p className='text-xs text-gray-500 mt-2'>
                JPG, GIF or PNG. 1MB max.
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <InputField
              label='Full Name'
              id='name'
              value={formData.name || ''}
              onChange={handleChange}
            />
            <InputField
              label='Title'
              id='title'
              value={formData.title || ''}
              onChange={handleChange}
            />
            <div className='sm:col-span-1'>
              <label
                htmlFor='recruiterType'
                className='block text-sm font-medium text-gray-700'>
                Recruiter Type
              </label>
              <select
                id='recruiterType'
                name='recruiterType'
                value={formData.recruiterType || 'In-house'}
                onChange={handleChange}
                className='mt-1 block w-full rounded-lg border-gray-300 bg-white shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5 pr-10'>
                <option>In-house</option>
                <option>Agency</option>
                <option>Freelance</option>
              </select>
            </div>
            <div className='sm:col-span-1'>
              <InputField
                label='Email Address'
                id='email'
                type='email'
                value={formData.email || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            Company Information
          </h3>
          <p className='text-sm text-gray-500 mb-6'>
            Details about the company you represent.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div className='sm:col-span-2'>
              <InputField
                label='Company Name'
                id='companyName'
                value={formData.companyName || ''}
                onChange={handleChange}
              />
            </div>
            <div className='sm:col-span-2'>
              <InputField
                label='Company Website'
                id='companyWebsite'
                type='url'
                value={formData.companyWebsite || ''}
                onChange={handleChange}
              />
            </div>
            <div className='sm:col-span-2'>
              <TextAreaField
                label='Company Bio'
                id='companyBio'
                value={formData.companyBio || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className='mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3'>
        <button
          onClick={handleCancel}
          className='px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors'>
          Cancel
        </button>
        <button
          onClick={handleSave}
          className='inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
          Save Changes
        </button>
      </div>
    </div>
  )
}
