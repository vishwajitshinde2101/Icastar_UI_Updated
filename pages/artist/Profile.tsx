import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Icon from '@/components/Icon'
import { ArtistCategory } from '@/types'
import artistService from '@/services/artistService'

interface ArtistProfile {
  category: ArtistCategory
  fullName: string
  email: string
  phone: string
  gender: string
  city: string
  languages: string
  bio: string
  profilePhoto?: string
  idProof?: string
  faceVerification?: string
  // Actor specific
  actorType?: 'skilled' | 'known'
  age?: number
  height?: string
  weight?: number
  // Dancer specific
  danceStyles?: string[]
  experienceYears?: string
  danceVideo?: string
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await artistService.getMyProfile()
        if (!data) {
          setProfile(null)
          return
        }
        const normalized: ArtistProfile = {
          category: (data.category as ArtistCategory) ?? ArtistCategory.Actor,
          fullName: data.fullName ?? data.name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          gender: (data.gender as string) ?? '',
          city: (data.city as string) ?? '',
          languages: Array.isArray(data.languages)
            ? (data.languages as string[]).join(', ')
            : (data.languages as string) ?? '',
          bio: data.bio ?? '',
          profilePhoto: data.profilePhoto ?? data.avatarUrl ?? undefined,
          actorType: data.actorType,
          age: data.age as number | undefined,
          height: data.height as string | undefined,
          weight: (data.weight as number | undefined) ?? undefined,
          danceStyles: (data.danceStyles as string[] | undefined) ?? undefined,
          experienceYears: (data.experienceYears as string | number | undefined) ?? undefined,
          danceVideo: (data.danceVideo as string | undefined) ?? undefined,
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
    toast.info('Loading profile editor...')
    navigate('/artist/onboarding')
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
          onClick={() => navigate('/artist/onboarding')}
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
            <p className='text-sm text-gray-500'>Actor Type</p>
            <p className='font-medium'>{profile.actorType === 'known' ? 'Known Actor' : 'Skilled Actor'}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Age</p>
            <p className='font-medium'>{profile.age} years</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Height</p>
            <p className='font-medium'>{profile.height}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Weight</p>
            <p className='font-medium'>{profile.weight} kg</p>
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
            <p className='text-sm text-gray-500'>Experience</p>
            <p className='font-medium'>{profile.experienceYears} years</p>
          </div>
          <div>
            <p className='text-sm text-gray-500 mb-2'>Dance Styles</p>
            <div className='flex flex-wrap gap-2'>
              {profile.danceStyles?.map((style, index) => (
                <span key={index} className='bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full'>
                  {style}
                </span>
              ))}
            </div>
          </div>
          {profile.danceVideo && (
            <div>
              <p className='text-sm text-gray-500 mb-2'>Showreel</p>
              <div className='aspect-w-16 aspect-h-9 rounded-lg overflow-hidden'>
                <iframe 
                  src={profile.danceVideo} 
                  className='w-full h-64 rounded-lg'
                  title='Dance Showreel'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>My Profile</h1>
        <button 
          onClick={handleEditProfile}
          className='flex items-center gap-2 bg-white border border-amber-600 text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors'
        >
          <Icon name='Edit' size={16} />
          Edit Profile
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column - Profile Card */}
        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-white rounded-xl p-6 shadow-sm text-center'>
            <div className='w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-amber-100'>
              <img 
                src={profile.profilePhoto || '/default-avatar.png'} 
                alt={profile.fullName}
                className='w-full h-full object-cover'
              />
            </div>
            <h2 className='text-xl font-bold text-gray-900'>{profile.fullName}</h2>
            <p className='text-amber-600 font-medium'>{profile.category}</p>
            <p className='mt-2 text-gray-600'>{profile.city}</p>
            
            <div className='mt-6 pt-6 border-t border-gray-100'>
              <h3 className='text-sm font-medium text-gray-500 mb-3'>Contact Information</h3>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center justify-center gap-2 text-gray-600'>
                  <Icon name='Mail' size={16} className='text-amber-500' />
                  <span>{profile.email}</span>
                </div>
                <div className='flex items-center justify-center gap-2 text-gray-600'>
                  <Icon name='Phone' size={16} className='text-amber-500' />
                  <span>{profile.phone}</span>
                </div>
              </div>
              
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <h3 className='text-sm font-medium text-gray-500 mb-3'>Languages</h3>
                <div className='flex flex-wrap justify-center gap-2'>
                  {profile.languages.split(',').map((lang, index) => (
                    <span key={index} className='bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full'>
                      {lang.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
            <p className='text-gray-600'>{profile.bio}</p>
          </div>

          {/* Artist Type Specific Details */}
          {profile.category === ArtistCategory.Actor ? renderActorDetails() : renderDancerDetails()}

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
