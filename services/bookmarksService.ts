import apiClient from './apiClient'

export interface CreateBookmarkDto {
  notes?: string
}

export interface BookmarkedJobDto {
  id: number
  jobId: number
  jobTitle: string
  jobDescription?: string
  jobLocation?: string
  jobType?: string
  experienceLevel?: string
  budgetMin?: number
  budgetMax?: number
  currency?: string
  isRemote?: boolean
  isUrgent?: boolean
  isFeatured?: boolean
  status?: string
  applicationsCount?: number
  bookmarkedAt?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface BookmarkResponse {
  success: boolean
  message: string
  data?: BookmarkedJobDto
  error?: string
}

export const bookmarksService = {
  async bookmarkJob(jobId: number, dto: CreateBookmarkDto = {}): Promise<BookmarkResponse> {
    const res = await apiClient.post(`/bookmarks/${jobId}`, dto)
    return res.data
  },
}

export default bookmarksService