import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Card } from '../../components/Card'
import { Recruiter, VerificationStatus } from '../../types'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '../../components/icons/IconComponents'
import { getRecruiterProfile, updateRecruiterProfile } from '@/services/recruiterProfileService'
import uploadService from '@/services/uploadService'

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
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = uploadService.validateFile(file, 'image')
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)
      const fileUrl = await uploadService.uploadFile(file, 'PROFILE_PHOTO', setUploadProgress)
      setFormData(prev => ({ ...prev, avatarUrl: fileUrl }))
      toast.success('Photo uploaded! Click Save Changes to save.')
    } catch (err: any) {
      toast.error('Failed to upload photo. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteAvatar = () => {
    setFormData(prev => ({ ...prev, avatarUrl: '' }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const updated = await updateRecruiterProfile({
        contactPersonName: formData.name,
        designation: formData.title,
        email: formData.email,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        companyDescription: formData.companyBio,
        companyLogoUrl: formData.avatarUrl,
      })
      setRecruiter(updated)
      setFormData(updated)
      toast.success('Profile saved successfully!')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
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
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              accept='image/jpeg,image/jpg,image/png,image/webp'
              onChange={handleAvatarFileChange}
            />

            {/* Avatar preview */}
            <div className='relative flex-shrink-0'>
              {formData.avatarUrl ? (
                <img
                  className='h-20 w-20 rounded-full object-cover ring-2 ring-gray-200'
                  src={formData.avatarUrl}
                  alt='Profile photo'
                />
              ) : (
                <div className='h-20 w-20 rounded-full bg-gray-100 ring-2 ring-gray-200 flex items-center justify-center'>
                  <svg className='h-10 w-10 text-gray-400' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8c0 2.208-1.792 4-3.998 4-2.208 0-4-1.792-4-4s1.792-4 4-4c2.206 0 3.998 1.792 3.998 4z' />
                  </svg>
                </div>
              )}
              {isUploading && (
                <div className='absolute inset-0 rounded-full bg-black/50 flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>{uploadProgress}%</span>
                </div>
              )}
            </div>

            {/* Upload buttons */}
            <div>
              {!formData.avatarUrl ? (
                <button
                  type='button'
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50'>
                  Add Photo
                </button>
              ) : (
                <div className='flex gap-2'>
                  <button
                    type='button'
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50'>
                    {isUploading ? `Uploading... ${uploadProgress}%` : 'Change Photo'}
                  </button>
                  <button
                    type='button'
                    disabled={isUploading}
                    onClick={handleDeleteAvatar}
                    className='px-4 py-2 border border-red-200 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50'>
                    Delete Photo
                  </button>
                </div>
              )}

              {isUploading && (
                <div className='mt-2 w-48 bg-gray-200 rounded-full h-1.5'>
                  <div
                    className='bg-primary h-1.5 rounded-full transition-all duration-300'
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <p className='text-xs text-gray-500 mt-2'>JPG, PNG or WebP. 5MB max.</p>
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
          disabled={loading || isUploading}
          className='inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed'>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
