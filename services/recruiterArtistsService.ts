import { api } from './apiClient'
import { Artist } from '../types'

// DTO from backend RecruiterDashboardController /artists response
export interface ArtistSuggestionDto {
  artistId: number
  artistName: string
  artistEmail?: string
  artistCategory?: string
  artistType?: string
  location?: string
  bio?: string
  profilePhoto?: string
  matchScore?: number
  matchReasons?: string[]
  skills?: string[]
  genres?: string[]
  languages?: string[]
  experienceYears?: number
  experienceLevel?: string
  portfolioItems?: string[]
  achievements?: string[]
  certifications?: string[]
  availability?: string
  preferredJobType?: string
  expectedSalaryMin?: number
  expectedSalaryMax?: number
  currency?: string
  workLocation?: string
  workSchedule?: string
}

export interface BrowseArtistsParams {
  page?: number // 1-indexed for UI
  size?: number
  artistCategory?: string
  artistType?: string
  location?: string
  skills?: string
  genres?: string
  experienceLevel?: string
  availability?: string
  isVerified?: boolean
  isPremium?: boolean
}


export interface PagedArtistsResult {
  items: Artist[]
  totalElements: number
  totalPages: number
  currentPage: number // 1-indexed
  size: number
}

const toArtist = (dto: ArtistSuggestionDto): Artist => ({
  id: dto.artistId,
  name: dto.artistName,
  avatarUrl: dto.profilePhoto && dto.profilePhoto !== 'N/A' ? dto.profilePhoto : 'https://picsum.photos/seed/artist/300/300',
  bio: dto.bio && dto.bio !== 'N/A' ? dto.bio : '',
  skills: Array.isArray(dto.skills) ? dto.skills : [],
  email: dto.artistEmail,
  portfolioUrl: (dto.portfolioItems && dto.portfolioItems.length > 0) ? dto.portfolioItems[0] : undefined,
})

export async function browseArtists(params: BrowseArtistsParams): Promise<PagedArtistsResult> {
  const { page = 1, size = 12, ...filters } = params
  const response = await api.get<{ success: boolean; data: ArtistSuggestionDto[]; totalElements: number; totalPages: number; currentPage: number; size: number }>(
    '/recruiter/dashboard/artists',
    { params: { page: page - 1, size, ...filters } },
  )

  const payload = response.data
  const items = (payload.data || []).map(toArtist)
  return {
    items,
    totalElements: payload.totalElements || items.length,
    totalPages: payload.totalPages || 1,
    currentPage: (payload.currentPage ?? 0) + 1,
    size: payload.size || size,
  }
}

export async function getArtistSuggestions(params: Omit<BrowseArtistsParams, 'page' | 'size'> & { jobId?: number; limit?: number }): Promise<Artist[]> {
  const { limit = 10, ...filters } = params
  const response = await api.get<{ success: boolean; data: ArtistSuggestionDto[]; count: number }>(
    '/recruiter/dashboard/suggestions',
    { params: { ...filters, limit } },
  )
  return (response.data.data || []).map(toArtist)
}