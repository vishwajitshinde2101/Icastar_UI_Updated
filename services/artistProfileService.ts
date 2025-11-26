import { Artist } from '../types'

export interface ArtistProfileApi {
  id?: number
  name?: string
  fullName?: string
  avatarUrl?: string
  profileImageUrl?: string
  bio?: string
  about?: string
  skills?: string[]
  topSkills?: string[]
  email?: string
  portfolioUrl?: string
  websiteUrl?: string
}

const toArtist = (api: ArtistProfileApi): Artist => ({
  id: api.id ?? 0,
  name: api.name ?? api.fullName ?? 'Unknown Artist',
  avatarUrl: api.avatarUrl ?? api.profileImageUrl ?? '',
  bio: api.bio ?? api.about ?? '',
  skills: api.skills ?? api.topSkills ?? [],
  email: api.email,
  portfolioUrl: api.portfolioUrl ?? api.websiteUrl,
})

export const getArtistProfileById = async (id: number): Promise<Artist> => {
  const resp = await fetch(`/api/artists/profile/${id}`)
  if (!resp.ok) {
    throw new Error(`Failed to fetch artist profile: ${resp.status}`)
  }
  const data: ArtistProfileApi = await resp.json()
  return toArtist(data)
}