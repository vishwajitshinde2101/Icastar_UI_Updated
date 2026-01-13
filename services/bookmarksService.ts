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

export interface PagedBookmarkResponse {
  content: BookmarkedJobDto[]
  totalElements: number
  totalPages: number
  number: number
  size: number
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

  async getBookmarksWithNotes(page = 0, size = 10, activeOnly = false): Promise<PagedBookmarkResponse> {
    const res = await apiClient.get('/bookmarks/with-notes', {
      params: { page, size, activeOnly }
    })
    return res.data
  },

  async getBookmarks(params: {
    page?: number;
    size?: number;
    activeOnly?: boolean;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    jobTitle?: string;
    companyName?: string;
    jobType?: string;
    location?: string;
  } = {}): Promise<PagedBookmarkResponse> {
    const { page = 0, size = 10, activeOnly = false, sortBy = 'bookmarkedAt', sortDir = 'desc', ...filters } = params;
    const res = await apiClient.get('/bookmarks', {
      params: { page, size, activeOnly, sortBy, sortDir, ...filters }
    })
    return res.data
  },

  async removeBookmark(bookmarkId: number): Promise<void> {
    await apiClient.delete(`/bookmarks/${bookmarkId}`)
  },

  async unbookmarkByJobId(jobId: number): Promise<void> {
    await apiClient.delete(`/bookmarks/job/${jobId}`)
  },
}

export default bookmarksService