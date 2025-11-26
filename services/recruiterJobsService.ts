import api from './apiClient'
import { PaginatedResult } from './types'
import { JobType, ExperienceLevel } from './jobsService'

// DTOs aligned with backend recruiter job controller
export interface CreateJobInput {
  title: string
  description: string
  requirements?: string
  jobType: JobType
  experienceLevel: ExperienceLevel
  budgetMin?: number
  budgetMax?: number
  currency?: string
  durationDays?: number
  startDate?: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
  applicationDeadline?: string // YYYY-MM-DD
  location?: string
  isRemote?: boolean
  isUrgent?: boolean
  isFeatured?: boolean
  tags?: string[]
  skillsRequired?: string[]
  benefits?: string
  contactEmail?: string
  contactPhone?: string
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  status?: 'ACTIVE' | 'DRAFT' | 'CLOSED' | 'ARCHIVED'
}

export interface RecruiterJobDto {
  id: number
  title: string
  description?: string
  requirements?: string
  location?: string
  jobType?: JobType
  experienceLevel?: ExperienceLevel
  budgetMin?: number
  budgetMax?: number
  currency?: string
  durationDays?: number
  startDate?: string
  endDate?: string
  applicationDeadline?: string
  isRemote?: boolean
  isUrgent?: boolean
  isFeatured?: boolean
  status?: 'ACTIVE' | 'DRAFT' | 'CLOSED' | 'ARCHIVED'
  viewsCount?: number
  applicationsCount?: number
  tags?: string[]
  skillsRequired?: string[]
  benefits?: string
  contactEmail?: string
  contactPhone?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

const normalizePage = (data: any): PaginatedResult<RecruiterJobDto> => {
  if (data && Array.isArray(data.content) && typeof data.totalElements === 'number') {
    return {
      items: data.content,
      total: data.totalElements,
      page: typeof data.number === 'number' ? data.number : 0,
      pageSize: typeof data.size === 'number' ? data.size : data.content.length,
    }
  }
  if (data && Array.isArray(data.items) && typeof data.total === 'number') {
    return {
      items: data.items,
      total: data.total,
      page: typeof data.page === 'number' ? data.page : 0,
      pageSize: typeof data.pageSize === 'number' ? data.pageSize : data.items.length,
    }
  }
  const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
  return { items, total: items.length, page: 0, pageSize: items.length }
}

const toBackendPayload = (input: CreateJobInput | UpdateJobInput) => {
  const payload: any = { ...input }
  // Convert arrays to JSON strings for fields expected as JSON in DTO
  if ((input as CreateJobInput).tags) {
    payload.tags = JSON.stringify((input as CreateJobInput).tags)
  }
  if ((input as CreateJobInput).skillsRequired) {
    payload.skillsRequired = JSON.stringify((input as CreateJobInput).skillsRequired)
  }
  return payload
}

export const recruiterJobsService = {
  async createJob(data: CreateJobInput): Promise<RecruiterJobDto> {
    const response = await api.post('/recruiter/jobs', toBackendPayload(data))
    return response.data
  },

  async listMyJobs(params: { page?: number; size?: number; sortBy?: string; sortDir?: 'asc' | 'desc' } = {}): Promise<PaginatedResult<RecruiterJobDto>> {
    const defaults = { page: 0, size: 20, sortBy: 'createdAt', sortDir: 'desc' as const }
    const response = await api.get('/recruiter/jobs', { params: { ...defaults, ...params } })
    return normalizePage(response.data)
  },

  async getMyJob(jobId: number | string): Promise<RecruiterJobDto> {
    const response = await api.get(`/recruiter/jobs/${jobId}`)
    return response.data
  },

  async updateJob(jobId: number | string, data: UpdateJobInput): Promise<RecruiterJobDto> {
    const response = await api.put(`/recruiter/jobs/${jobId}`, toBackendPayload(data))
    return response.data
  },

  async deleteJob(jobId: number | string): Promise<{ message: string }> {
    const response = await api.delete(`/recruiter/jobs/${jobId}`)
    return response.data
  },

  async toggleVisibility(jobId: number | string): Promise<RecruiterJobDto> {
    const response = await api.post(`/recruiter/jobs/${jobId}/toggle-visibility`)
    return response.data
  },

  async getStats(): Promise<{ totalJobs: number; [key: string]: any }> {
    const response = await api.get('/recruiter/jobs/stats')
    return response.data
  },

  async bulkUpload(file: File): Promise<{ success: boolean; message?: string; summary?: any }> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/recruiter/jobs/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}

export default recruiterJobsService