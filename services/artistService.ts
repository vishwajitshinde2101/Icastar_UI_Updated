import api from './apiClient'

export interface ArtistProfile {
  id?: number
  fullName?: string
  email?: string
  phone?: string
  gender?: string
  city?: string
  languages?: string[] | string
  bio?: string
  profilePhoto?: string
  actorType?: 'skilled' | 'known'
  age?: number
  height?: string
  weight?: number
  danceStyles?: string[]
  experienceYears?: string | number
  danceVideo?: string
  [key: string]: any
}

export interface UpdateArtistProfileInput extends Partial<ArtistProfile> {}

export const artistService = {
  async getMyProfile(): Promise<ArtistProfile | null> {
    const res = await api.get('/artists/profile')
    return res.data ?? null
  },

  async getMyCompleteProfile(): Promise<ArtistProfile | null> {
    const res = await api.get('/artists/profile/complete')
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