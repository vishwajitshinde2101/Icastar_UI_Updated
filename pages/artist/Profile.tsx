import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Icon from '@/components/Icon'
import { ArtistCategory } from '@/types'
import artistService from '@/services/artistService'

interface ArtistProfile {
  category: string
  fullName: string
  firstName?: string
  lastName?: string
  stageName?: string
  email: string
  phone: string
  gender: string
  city: string
  languages: string
  bio: string
  profilePhoto?: string
  idProof?: string
  faceVerification?: string
  isVerifiedBadge?: boolean
  isProfileComplete?: boolean
  // Actor specific
  actorType?: 'skilled' | 'known'
  age?: number
  dateOfBirth?: string
  height?: string
  weight?: number
  hairColor?: string
  hairLength?: string
  hasTattoo?: boolean
  hasMole?: boolean
  shoeSize?: string
  // Dancer specific
  danceStyles?: string[]
  experienceYears?: string
  danceVideo?: string
  // Additional fields
  skills?: string
  maritalStatus?: string
  comfortableAreas?: string
  travelCities?: string
  hourlyRate?: number
  totalApplications?: number
  successfulHires?: number
  artistTypeId?: number
  artistType?: {
    id: number
    name: string
    displayName: string
    fields?: {
      name: string
      label: string
      type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'FILE' | 'URL' | 'BOOLEAN'
      required?: boolean
      placeholder?: string
      options?: string[]
    }[]
  }
  dynamicFields?: { fieldName: string; value: any }[]
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<ArtistProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await artistService.getMyProfile()
        if (!data) {
          setProfile(null)
          return
        }
        // Calculate age from dateOfBirth
        const calculateAge = (dob: string | undefined): number | undefined => {
          if (!dob) return undefined
          const birthDate = new Date(dob)
          const today = new Date()
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          return age
        }

        const normalized: ArtistProfile = {
          category: data.category ?? data.artistType?.displayName ?? '',
          fullName: data.fullName ?? '',
          firstName: data.firstName,
          lastName: data.lastName,
          stageName: data.stageName,
          email: data.email ?? '',
          phone: data.phone ?? '',
          gender: data.gender ?? '',
          city: data.city ?? data.location ?? '',
          languages: Array.isArray(data.languages)
            ? data.languages.join(', ')
            : Array.isArray(data.languagesSpoken)
              ? data.languagesSpoken.join(', ')
              : (data.languages as string) ?? '',
          bio: data.bio ?? '',
          profilePhoto: data.profilePhoto ?? data.avatarUrl ?? undefined,
          isVerifiedBadge: data.isVerifiedBadge,
          isProfileComplete: data.isProfileComplete,
          actorType: data.actorType,
          age: data.age ?? calculateAge(data.dateOfBirth),
          dateOfBirth: data.dateOfBirth,
          height: data.height ?? undefined,
          weight: data.weight ?? undefined,
          hairColor: data.hairColor,
          hairLength: data.hairLength,
          hasTattoo: data.hasTattoo,
          hasMole: data.hasMole,
          shoeSize: data.shoeSize,
          danceStyles: data.danceStyles ?? undefined,
          experienceYears: data.experienceYears ? String(data.experienceYears) : undefined,
          danceVideo: data.danceVideo ?? undefined,
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
          maritalStatus: data.maritalStatus,
          comfortableAreas: Array.isArray(data.comfortableAreas) ? data.comfortableAreas.join(', ') : data.comfortableAreas,
          travelCities: Array.isArray(data.travelCities) ? data.travelCities.join(', ') : data.travelCities,
          hourlyRate: data.hourlyRate,
          totalApplications: data.totalApplications,
          successfulHires: data.successfulHires,
          artistTypeId: data.artistType?.id ?? data.artistTypeId,
          artistType: data.artistType,
          dynamicFields: data.dynamicFields ?? [],
        }
        setProfile(normalized)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleEditProfile = () => {
    setIsEditing(true)
    setEditedProfile(profile ? { ...profile } : null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedProfile(null)
  }

  const handleSaveProfile = async () => {
    if (!editedProfile) return

    try {
      setSaving(true)
      // Split fullName into firstName and lastName if not already set
      let firstName = editedProfile.firstName
      let lastName = editedProfile.lastName
      if (!firstName && !lastName && editedProfile.fullName) {
        const nameParts = editedProfile.fullName.trim().split(' ')
        firstName = nameParts[0] || ''
        lastName = nameParts.slice(1).join(' ') || ''
      }

      const payload = {
        firstName: firstName || '',
        lastName: lastName || '',
        artistTypeId: editedProfile.artistTypeId ?? editedProfile.artistType?.id,
        email: editedProfile.email,
        phone: editedProfile.phone,
        city: editedProfile.city,
        bio: editedProfile.bio,
        languagesSpoken: editedProfile.languages ? editedProfile.languages.split(',').map(l => l.trim()) : [],
        gender: editedProfile.gender,
        dateOfBirth: editedProfile.dateOfBirth,
        height: editedProfile.height,
        weight: editedProfile.weight,
        experienceYears: editedProfile.experienceYears ? Number(editedProfile.experienceYears) : undefined,
        hairColor: editedProfile.hairColor,
        hairLength: editedProfile.hairLength,
        hasTattoo: editedProfile.hasTattoo,
        hasMole: editedProfile.hasMole,
        shoeSize: editedProfile.shoeSize,
        maritalStatus: editedProfile.maritalStatus,
        skills: editedProfile.skills ? editedProfile.skills.split(',').map(s => s.trim()) : undefined,
        comfortableAreas: editedProfile.comfortableAreas ? editedProfile.comfortableAreas.split(',').map(a => a.trim()) : undefined,
        travelCities: editedProfile.travelCities ? editedProfile.travelCities.split(',').map(c => c.trim()) : undefined,
        hourlyRate: editedProfile.hourlyRate,
        dynamicFields: editedProfile.dynamicFields,
      }

      await artistService.updateMyProfile(payload)
      setProfile(editedProfile)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof ArtistProfile, value: any) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value })
    }
  }

  const handleDynamicFieldChange = (fieldName: string, value: any) => {
    if (editedProfile) {
      const currentFields = editedProfile.dynamicFields ? [...editedProfile.dynamicFields] : []
      const index = currentFields.findIndex(f => f.fieldName === fieldName)
      if (index >= 0) {
        currentFields[index] = { ...currentFields[index], value }
      } else {
        currentFields.push({ fieldName, value })
      }
      setEditedProfile({ ...editedProfile, dynamicFields: currentFields })
    }
  }

  const handleViewDocument = (docType: string) => {
    toast.info(`Viewing ${docType} document`)
    // Add document viewing logic here
  }

  const handleUploadDocument = async (file: File, docType: string) => {
    const toastId = toast.loading(`Uploading ${docType}...`)
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.dismiss(toastId)
      toast.success(`${docType} uploaded successfully`)
      // Refresh profile data or update state here
    } catch (error) {
      toast.dismiss(toastId)
      toast.error(`Failed to upload ${docType}`)
      console.error('Upload error:', error)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500'></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center p-6 text-center'>
        <div className='bg-amber-100 p-4 rounded-full mb-4'>
          <Icon name='User' size={24} className='text-amber-600' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Profile Not Found</h2>
        <p className='text-gray-600 mb-6'>Complete your profile to get started</p>
        <button
          onClick={() => navigate('/settings')}
          className='bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'
        >
          Complete Profile
        </button>
      </div>
    )
  }

  const renderActorDetails = () => (
    <div className='space-y-6'>
      <div className='bg-white rounded-xl p-6 shadow-sm'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Actor Details</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-500 mb-2'>Actor Type</p>
            {isEditing ? (
              <select
                value={currentProfile?.actorType || 'skilled'}
                onChange={(e) => handleInputChange('actorType', e.target.value as 'skilled' | 'known')}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              >
                <option value='skilled'>Skilled Actor</option>
                <option value='known'>Known Actor</option>
              </select>
            ) : (
              <p className='font-medium'>{currentProfile?.actorType === 'known' ? 'Known Actor' : 'Skilled Actor'}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-500 mb-2'>Age</p>
            {isEditing ? (
              <input
                type='number'
                value={currentProfile?.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              />
            ) : (
              <p className='font-medium'>{currentProfile?.age} years</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-500 mb-2'>Height</p>
            {isEditing ? (
              <input
                type='text'
                value={currentProfile?.height || ''}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="e.g., 5'8&quot;"
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              />
            ) : (
              <p className='font-medium'>{currentProfile?.height}</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-500 mb-2'>Weight</p>
            {isEditing ? (
              <input
                type='number'
                value={currentProfile?.weight || ''}
                onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              />
            ) : (
              <p className='font-medium'>{currentProfile?.weight} kg</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderDancerDetails = () => (
    <div className='space-y-6'>
      <div className='bg-white rounded-xl p-6 shadow-sm'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Dancer Details</h3>
        <div className='space-y-4'>
          <div>
            <p className='text-sm text-gray-500 mb-2'>Experience Years</p>
            {isEditing ? (
              <input
                type='text'
                value={currentProfile?.experienceYears || ''}
                onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                placeholder='e.g., 5 years'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              />
            ) : (
              <p className='font-medium'>{currentProfile?.experienceYears} years</p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-500 mb-2'>Dance Styles</p>
            {isEditing ? (
              <input
                type='text'
                value={currentProfile?.danceStyles?.join(', ') || ''}
                onChange={(e) => handleInputChange('danceStyles', e.target.value.split(',').map((s: string) => s.trim()))}
                placeholder='e.g., Ballet, Hip Hop, Contemporary'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              />
            ) : (
              <div className='flex flex-wrap gap-2'>
                {currentProfile?.danceStyles?.map((style, index) => (
                  <span key={index} className='bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full'>
                    {style}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-500 mb-2'>Showreel URL</p>
            {isEditing ? (
              <input
                type='url'
                value={currentProfile?.danceVideo || ''}
                onChange={(e) => handleInputChange('danceVideo', e.target.value)}
                placeholder='e.g., https://youtube.com/...'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              />
            ) : currentProfile?.danceVideo ? (
              <div className='aspect-w-16 aspect-h-9 rounded-lg overflow-hidden'>
                <iframe
                  src={currentProfile.danceVideo}
                  className='w-full h-64 rounded-lg'
                  title='Dance Showreel'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p className='text-gray-500'>No showreel uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderDynamicDetails = () => {
    const fields = currentProfile?.artistType?.fields
    if (!fields || fields.length === 0) {
      // Fallback or empty state if no metadata
      if (currentProfile?.category === ArtistCategory.Actor) return renderActorDetails()
      if (currentProfile?.category === ArtistCategory.Dancer) return renderDancerDetails()
      return null
    }

    const getDynamicValue = (name: string) => {
      return currentProfile?.dynamicFields?.find(f => f.fieldName === name)?.value || ''
    }

    return (
      <div className='space-y-6'>
        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            {currentProfile?.artistType?.displayName ?? 'Role'} Details
          </h3>
          <div className='grid grid-cols-1 gap-6'>
            {fields.map((field) => {
              const val = getDynamicValue(field.name)

              if (field.type === 'TEXTAREA') {
                return (
                  <div key={field.name}>
                    <label className='text-sm font-medium text-gray-700 mb-1 block'>
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {isEditing ? (
                      <textarea
                        value={val}
                        onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                      />
                    ) : (
                      <p className='text-gray-600 whitespace-pre-wrap'>{val || '-'}</p>
                    )}
                  </div>
                )
              }

              if (field.type === 'BOOLEAN') {
                return (
                  <div key={field.name} className="flex items-center gap-3">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) => handleDynamicFieldChange(field.name, e.target.checked)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                    ) : (
                      <Icon name={val ? 'CheckSquare' : 'Square'} size={20} className={val ? 'text-amber-600' : 'text-gray-400'} />
                    )}
                    <label className='text-sm font-medium text-gray-700'>
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                  </div>
                )
              }

              if (field.type === 'FILE') {
                return (
                  <div key={field.name}>
                    <label className='text-sm font-medium text-gray-700 mb-1 block'>
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={val}
                          readOnly
                          placeholder="Upload a file..."
                          className='flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'
                        />
                        <label className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Upload
                          <input type="file" className="hidden" onChange={(e) => {
                            if (e.target.files?.[0]) handleDynamicFieldChange(field.name, e.target.files[0].name) // limited mock
                          }} />
                        </label>
                      </div>
                    ) : (
                      val ? <span className="text-amber-600 font-medium">{val}</span> : <span className="text-gray-400">No file uploaded</span>
                    )}
                  </div>
                )
              }

              // Default TEXT, URL, NUMBER
              return (
                <div key={field.name}>
                  <label className='text-sm font-medium text-gray-700 mb-1 block'>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {isEditing ? (
                    <input
                      type={field.type === 'NUMBER' ? 'number' : field.type === 'URL' ? 'url' : 'text'}
                      value={val}
                      onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    />
                  ) : (
                    field.type === 'URL' && val ? (
                      <a href={val} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{val}</a>
                    ) : (
                      <p className='text-gray-600'>{val || '-'}</p>
                    )
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const currentProfile = isEditing ? editedProfile : profile

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    // Helper to check if a value is filled (handles strings, numbers, and arrays)
    const isFilled = (value: any): boolean => {
      if (value === null || value === undefined) return false
      if (typeof value === 'string') return value.trim() !== ''
      if (typeof value === 'number') return true // 0 is a valid value
      if (Array.isArray(value)) return value.length > 0
      return Boolean(value)
    }

    // Helper to format display value
    const formatDisplayValue = (value: any): string => {
      if (value === null || value === undefined) return ''
      if (typeof value === 'string') return value.length > 20 ? value.substring(0, 20) + '...' : value
      if (typeof value === 'number') return String(value)
      if (Array.isArray(value)) return value.join(', ')
      return String(value)
    }

    const emptyResult = {
      percentage: 0,
      missing: [] as string[],
      filled: 0,
      total: 0,
      fields: [] as { label: string; value: any; isFilled: boolean; displayValue: string }[]
    }

    if (!profile) return emptyResult

    const fieldsList = [
      { key: 'firstName', label: 'First Name', value: profile.firstName },
      { key: 'lastName', label: 'Last Name', value: profile.lastName },
      { key: 'stageName', label: 'Stage Name', value: profile.stageName },
      { key: 'email', label: 'Email', value: profile.email },
      { key: 'phone', label: 'Phone', value: profile.phone },
      { key: 'city', label: 'City', value: profile.city },
      { key: 'gender', label: 'Gender', value: profile.gender },
      { key: 'dateOfBirth', label: 'Date of Birth', value: profile.dateOfBirth },
      { key: 'bio', label: 'Bio', value: profile.bio },
      { key: 'languages', label: 'Languages', value: profile.languages },
      { key: 'experienceYears', label: 'Experience', value: profile.experienceYears },
      { key: 'skills', label: 'Skills', value: profile.skills },
      { key: 'height', label: 'Height', value: profile.height },
      { key: 'weight', label: 'Weight', value: profile.weight },
      { key: 'profilePhoto', label: 'Photo', value: profile.profilePhoto },
      { key: 'hourlyRate', label: 'Hourly Rate', value: profile.hourlyRate },
    ]

    // Add dynamic fields to completion check
    if (profile.artistType?.fields) {
      profile.artistType.fields.forEach(field => {
        const val = profile.dynamicFields?.find(df => df.fieldName === field.name)?.value
        fieldsList.push({
          key: field.name,
          label: field.label,
          value: val,
        })
      })
    }

    const fieldsWithStatus = fieldsList.map(f => ({
      label: f.label,
      value: f.value,
      isFilled: isFilled(f.value),
      displayValue: formatDisplayValue(f.value)
    }))

    const filledCount = fieldsWithStatus.filter(f => f.isFilled).length
    const missingFields = fieldsWithStatus.filter(f => !f.isFilled).map(f => f.label)
    const percentage = Math.round((filledCount / fieldsList.length) * 100)

    return {
      percentage,
      missing: missingFields,
      filled: filledCount,
      total: fieldsList.length,
      fields: fieldsWithStatus
    }
  }

  const profileCompletion = calculateProfileCompletion()

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>My Profile</h1>
        <div className='flex gap-3'>
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className='flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold'
              >
                <Icon name='X' size={16} />
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className='flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50'
              >
                <Icon name='Save' size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEditProfile}
              className='flex items-center gap-2 bg-white border border-amber-600 text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors'
            >
              <Icon name='Edit' size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column - Profile Card */}
        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-white rounded-xl p-6 shadow-sm text-center'>
            <div className='w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-amber-100'>
              <img
                src={currentProfile?.profilePhoto || '/default-avatar.png'}
                alt={currentProfile?.fullName}
                className='w-full h-full object-cover'
              />
            </div>

            {isEditing ? (
              <div className='space-y-3 text-left'>
                <div>
                  <label className='text-xs font-medium text-gray-500'>Full Name</label>
                  <input
                    type='text'
                    value={currentProfile?.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <input
                    type='text'
                    value={currentProfile?.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='text-xs font-medium text-gray-500'>Stage Name (Optional)</label>
                  <input
                    type='text'
                    value={currentProfile?.stageName || ''}
                    onChange={(e) => handleInputChange('stageName', e.target.value)}
                    className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='text-xs font-medium text-gray-500'>Date of Birth</label>
                  <input
                    type='date'
                    value={currentProfile?.dateOfBirth ? currentProfile.dateOfBirth.split('T')[0] : ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='text-xs font-medium text-gray-500'>Gender</label>
                  <select
                    value={currentProfile?.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <h2 className='text-xl font-bold text-gray-900'>{currentProfile?.fullName}</h2>
                {currentProfile?.stageName && <p className="text-gray-500 text-sm">({currentProfile.stageName})</p>}
                <p className='text-amber-600 font-medium'>{currentProfile?.category}</p>
                <div className='mt-2 text-gray-600 space-y-1'>
                  <p>{currentProfile?.city}</p>
                  {currentProfile?.dateOfBirth && <p className='text-xs text-gray-500'>Born: {new Date(currentProfile.dateOfBirth).toLocaleDateString()}</p>}
                  {currentProfile?.gender && <p className='text-xs text-gray-500'>{currentProfile.gender}</p>}
                </div>
              </>
            )}

            <div className='mt-6 pt-6 border-t border-gray-100'>
              <h3 className='text-sm font-medium text-gray-500 mb-3'>Contact Information</h3>
              {isEditing ? (
                <div className='space-y-3 text-left'>
                  <div>
                    <label className='text-xs font-medium text-gray-500'>Email</label>
                    <input
                      type='email'
                      value={currentProfile?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500'>Phone</label>
                    <input
                      type='tel'
                      value={currentProfile?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    />
                  </div>
                </div>
              ) : (
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center justify-center gap-2 text-gray-600'>
                    <Icon name='Mail' size={16} className='text-amber-500' />
                    <span>{currentProfile?.email}</span>
                  </div>
                  <div className='flex items-center justify-center gap-2 text-gray-600'>
                    <Icon name='Phone' size={16} className='text-amber-500' />
                    <span>{currentProfile?.phone}</span>
                  </div>
                </div>
              )}

              <div className='mt-4 pt-4 border-t border-gray-100'>
                <h3 className='text-sm font-medium text-gray-500 mb-3'>Languages</h3>
                {isEditing ? (
                  <input
                    type='text'
                    value={currentProfile?.languages || ''}
                    onChange={(e) => handleInputChange('languages', e.target.value)}
                    placeholder='e.g., English, Hindi, Tamil'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                ) : (
                  <div className='flex flex-wrap justify-center gap-2'>
                    {currentProfile?.languages.split(',').map((lang, index) => (
                      <span key={index} className='bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full'>
                        {lang.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Profile Completion</h3>
            <div className='mb-4'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium text-gray-700'>{profileCompletion.percentage}% Complete</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${profileCompletion.percentage >= 80 ? 'bg-green-100 text-green-700' :
                  profileCompletion.percentage >= 50 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                  {profileCompletion.percentage >= 80 ? 'Good' : profileCompletion.percentage >= 50 ? 'Needs Work' : 'Incomplete'}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${profileCompletion.percentage >= 80 ? 'bg-green-500' :
                    profileCompletion.percentage >= 50 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>
              <p className='text-xs text-gray-500 mt-2 text-center'>
                {profileCompletion.filled} of {profileCompletion.total} fields completed
              </p>
            </div>

            {/* All Fields Status */}
            <div className='mt-4 space-y-2'>
              <p className='text-xs font-medium text-gray-500 mb-2'>Field Status:</p>
              <div className='max-h-48 overflow-y-auto space-y-1.5'>
                {profileCompletion.fields.map((field, index) => (
                  <div key={index} className='flex items-center justify-between text-xs py-1.5 px-2 rounded bg-gray-50'>
                    <span className='text-gray-600'>{field.label}</span>
                    {field.isFilled ? (
                      <span className='flex items-center gap-1 text-green-600'>
                        <Icon name='Check' size={12} />
                        <span className='truncate max-w-[100px]' title={String(field.displayValue)}>
                          {field.displayValue}
                        </span>
                      </span>
                    ) : (
                      <span className='flex items-center gap-1 text-red-500'>
                        <Icon name='X' size={12} />
                        Missing
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {profileCompletion.percentage < 100 && (
              <button
                onClick={handleEditProfile}
                className='mt-4 w-full bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors'
              >
                Complete Your Profile
              </button>
            )}
          </div>

          {/* Verification Badge */}
          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Verification</h3>
            <div className='space-y-4'>
              <div className={`flex items-center p-3 rounded-lg ${profile.idProof ? 'bg-green-50' : 'bg-amber-50'}`}>
                <div className={`p-2 rounded-full ${profile.idProof ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  <Icon name={profile.idProof ? 'Check' : 'AlertCircle'} size={20} />
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900'>ID Proof</p>
                  <p className='text-xs text-gray-500'>{profile.idProof ? 'Verified' : 'Pending'}</p>
                </div>
              </div>
              <div className={`flex items-center p-3 rounded-lg ${profile.faceVerification ? 'bg-green-50' : 'bg-amber-50'}`}>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-gray-900'>Face Verification</p>
                  <p className='text-xs text-gray-500'>{profile.faceVerification ? 'Verified' : 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className='lg:col-span-2 space-y-6'>
          {/* About Section */}
          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>About</h3>
            {isEditing ? (
              <textarea
                value={currentProfile?.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none'
                placeholder='Tell us about yourself...'
              />
            ) : (
              <p className='text-gray-600'>{currentProfile?.bio}</p>
            )}
          </div>

          {/* Additional Core Details */}
          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Skills</label>
                {isEditing ? (
                  <input
                    type='text'
                    value={currentProfile?.skills || ''}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="Acting, Singing, Dancing"
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-600'>{currentProfile?.skills || '-'}</p>
                )}
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Height & Weight</label>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <input
                        type='text'
                        value={currentProfile?.height || ''}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="Height (e.g. 5'8)"
                        className='w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                      />
                      <input
                        type='number'
                        value={currentProfile?.weight || ''}
                        onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                        placeholder="Weight (kg)"
                        className='w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                      />
                    </>
                  ) : (
                    <p className='text-gray-600'>{currentProfile?.height || '-'} / {currentProfile?.weight ? `${currentProfile.weight} kg` : '-'}</p>
                  )}
                </div>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Experience (Years)</label>
                {isEditing ? (
                  <input
                    type='number'
                    value={currentProfile?.experienceYears || ''}
                    onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-600'>{currentProfile?.experienceYears || '-'}</p>
                )}
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>Hourly Rate</label>
                {isEditing ? (
                  <input
                    type='number'
                    value={currentProfile?.hourlyRate || ''}
                    onChange={(e) => handleInputChange('hourlyRate', Number(e.target.value))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-600'>{currentProfile?.hourlyRate ? `$${currentProfile.hourlyRate}/hr` : '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Artist Type Specific Details */}
          {renderDynamicDetails()}

          {/* Documents Section */}
          <div className='bg-white rounded-xl p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Documents</h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-gray-100 rounded-lg text-gray-600'>
                    <Icon name='FileText' size={20} />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>ID Proof</p>
                    <p className='text-xs text-gray-500'>Uploaded on 15 Aug 2023</p>
                  </div>
                </div>
                <button className='text-amber-600 hover:text-amber-700 text-sm font-medium'>
                  View
                </button>
              </div>

              {profile.category === ArtistCategory.Dancer && profile.danceVideo && (
                <div className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-gray-100 rounded-lg text-gray-600'>
                      <Icon name='Film' size={20} />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>Dance Showreel</p>
                      <p className='text-xs text-gray-500'>YouTube Link</p>
                    </div>
                  </div>
                  <a
                    href={profile.danceVideo}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-amber-600 hover:text-amber-700 text-sm font-medium'
                  >
                    Watch
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
