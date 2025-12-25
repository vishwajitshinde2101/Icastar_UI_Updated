import api from './apiClient'

export interface ArtistProfile {
  id?: number
  userId?: number
  artistProfileId?: number
  fullName?: string
  firstName?: string
  lastName?: string
  stageName?: string
  email?: string
  phone?: string
  gender?: string
  city?: string
  location?: string
  languages?: string[] | string
  languagesSpoken?: string[] | string
  bio?: string
  profilePhoto?: string
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
  danceStyles?: string[]
  experienceYears?: string | number
  danceVideo?: string
  skills?: string[] | string
  maritalStatus?: string
  comfortableAreas?: string[] | string
  projectsWorked?: number
  travelCities?: string[] | string
  hourlyRate?: number
  isVerifiedBadge?: boolean
  isProfileComplete?: boolean
  isOnboardingComplete?: boolean
  isActive?: boolean
  totalApplications?: number
  successfulHires?: number
  artistType?: {
    id: number
    name: string
    displayName: string
    description?: string
    iconUrl?: string
    fields?: {
      name: string
      label: string
      type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'FILE' | 'URL' | 'BOOLEAN'
      required?: boolean
      placeholder?: string
      options?: string[] // For select/multiselect if needed
    }[]
  }
  artistTypeId?: number
  artistTypeName?: string
  category?: string
  documents?: any[]
  dynamicFields?: any[]
  [key: string]: any
}

export interface UpdateArtistProfileInput extends Partial<ArtistProfile> { }

export const artistService = {
  async getMyProfile(): Promise<ArtistProfile | null> {
    const res = await api.get('/artist-profiles/complete')
    const responseData = res.data?.data ?? res.data
    if (!responseData) return null

    // Map API response to ArtistProfile
    return {
      id: responseData.artistProfileId ?? responseData.id,
      oderId: responseData.userId,
      firstName: responseData.firstName,
      lastName: responseData.lastName,
      fullName: responseData.firstName && responseData.lastName
        ? `${responseData.firstName} ${responseData.lastName}`
        : responseData.firstName || responseData.lastName || '',
      stageName: responseData.stageName,
      email: responseData.email,
      phone: responseData.phone,
      bio: responseData.bio,
      dateOfBirth: responseData.dateOfBirth,
      gender: responseData.gender,
      location: responseData.location,
      city: responseData.city ?? responseData.location,
      maritalStatus: responseData.maritalStatus,
      languagesSpoken: responseData.languagesSpoken,
      languages: responseData.languagesSpoken,
      comfortableAreas: responseData.comfortableAreas,
      projectsWorked: responseData.projectsWorked,
      skills: responseData.skills,
      experienceYears: responseData.experienceYears,
      weight: responseData.weight,
      height: responseData.height,
      hairColor: responseData.hairColor,
      hairLength: responseData.hairLength,
      hasTattoo: responseData.hasTattoo,
      hasMole: responseData.hasMole,
      shoeSize: responseData.shoeSize,
      travelCities: responseData.travelCities,
      hourlyRate: responseData.hourlyRate,
      isVerifiedBadge: responseData.isVerifiedBadge,
      isProfileComplete: responseData.isProfileComplete,
      isOnboardingComplete: responseData.isOnboardingComplete,
      totalApplications: responseData.totalApplications,
      successfulHires: responseData.successfulHires,
      artistType: responseData.artistType ?? {
        id: responseData.artistTypeId,
        name: responseData.artistTypeName,
        displayName: responseData.artistTypeName?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      },
      category: responseData.artistTypeName?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      documents: responseData.documents,
      dynamicFields: responseData.dynamicFields,
    }
  },

  async getMyCompleteProfile(): Promise<ArtistProfile | null> {
    const res = await api.get('/artist-profiles/complete')
    return res.data ?? null
  },

  async getProfileById(id: number | string): Promise<ArtistProfile | null> {
    const res = await api.get(`/artists/profile/${id}`)
    return res.data ?? null
  },

  async getCompleteProfileById(id: number | string): Promise<ArtistProfile | null> {
    const res = await api.get(`/artists/profile/${id}/complete`)
    return res.data ?? null
  },

  async updateMyProfile(input: UpdateArtistProfileInput): Promise<ArtistProfile> {
    const res = await api.put('/artists/profile', input)
    return res.data
  },
}

export default artistService