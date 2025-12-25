import apiClient from './apiClient'
import {
  Audition,
  AuditionApplication,
  CreateAuditionDto,
  AuditionApplicationStatus,
  AuditionFilters,
  ApplicationFilters,
  PaginatedResponse,
  AuditionStats,
} from '../types'

/**
 * Audition/Casting Call Management Service
 * Handles all API calls related to casting calls for recruiters
 */
const auditionService = {
  /**
   * Get all casting calls for the current recruiter with filtering and pagination
   */
  async getAllAuditions(filters?: AuditionFilters): Promise<PaginatedResponse<Audition>> {
    const response = await apiClient.get('/recruiter/auditions', {
      params: {
        searchTerm: filters?.searchTerm,
        status: filters?.status,
        roleType: filters?.roleType,
        projectType: filters?.projectType,
        location: filters?.location,
        isUrgent: filters?.isUrgent,
        isFeatured: filters?.isFeatured,
        page: filters?.page ?? 0,
        size: filters?.size ?? 20,
      },
    })
    return response.data
  },

  /**
   * Get a single casting call by ID
   */
  async getAuditionById(id: number): Promise<Audition> {
    const response = await apiClient.get(`/recruiter/auditions/${id}`)
    return response.data.data
  },

  /**
   * Create a new casting call
   */
  async createAudition(data: CreateAuditionDto): Promise<Audition> {
    const response = await apiClient.post('/recruiter/auditions', data)
    return response.data.data
  },

  /**
   * Update an existing casting call
   */
  async updateAudition(id: number, data: Partial<CreateAuditionDto>): Promise<Audition> {
    const response = await apiClient.put(`/recruiter/auditions/${id}`, data)
    return response.data.data
  },

  /**
   * Delete a draft casting call
   */
  async deleteAudition(id: number): Promise<void> {
    await apiClient.delete(`/recruiter/auditions/${id}`)
  },

  /**
   * Publish a casting call (change from Draft to Open)
   */
  async publishAudition(id: number): Promise<Audition> {
    const response = await apiClient.post(`/recruiter/auditions/${id}/publish`)
    return response.data.data
  },

  /**
   * Close a casting call
   */
  async closeAudition(id: number): Promise<Audition> {
    const response = await apiClient.post(`/recruiter/auditions/${id}/close`)
    return response.data.data
  },

  /**
   * Get all applications for a specific casting call
   */
  async getAuditionApplications(
    auditionId: number,
    filters?: ApplicationFilters
  ): Promise<PaginatedResponse<AuditionApplication>> {
    const response = await apiClient.get(`/recruiter/auditions/${auditionId}/applications`, {
      params: {
        status: filters?.status,
        isShortlisted: filters?.isShortlisted,
        minRating: filters?.minRating,
        page: filters?.page ?? 0,
        size: filters?.size ?? 20,
      },
    })
    return response.data
  },

  /**
   * Get application details
   */
  async getApplicationById(auditionId: number, applicationId: number): Promise<AuditionApplication> {
    const response = await apiClient.get(`/recruiter/auditions/${auditionId}/applications/${applicationId}`)
    return response.data.data
  },

  /**
   * Update application status with optional notes, rating, callback info, etc.
   */
  async updateApplicationStatus(
    auditionId: number,
    applicationId: number,
    status: AuditionApplicationStatus,
    options?: {
      notes?: string
      rating?: number
      callbackDate?: string
      callbackLocation?: string
      callbackNotes?: string
      feedback?: string
      rejectionReason?: string
    }
  ): Promise<AuditionApplication> {
    const response = await apiClient.put(
      `/recruiter/auditions/${auditionId}/applications/${applicationId}/status`,
      {
        status,
        notes: options?.notes,
        rating: options?.rating,
        callbackDate: options?.callbackDate,
        callbackLocation: options?.callbackLocation,
        callbackNotes: options?.callbackNotes,
        feedback: options?.feedback,
        rejectionReason: options?.rejectionReason,
      }
    )
    return response.data.data
  },

  /**
   * Bulk update application statuses
   */
  async bulkUpdateApplicationStatus(
    auditionId: number,
    applicationIds: number[],
    status: AuditionApplicationStatus,
    options?: {
      notes?: string
      rejectionReason?: string
    }
  ): Promise<{
    totalRequested: number
    successful: number
    failed: number
    errorMessages: string[]
    successfulIds: number[]
    failedIds: number[]
  }> {
    const response = await apiClient.post(`/recruiter/auditions/${auditionId}/applications/bulk-update`, {
      applicationIds,
      status,
      notes: options?.notes,
      rejectionReason: options?.rejectionReason,
    })
    return response.data.data
  },

  /**
   * Add private notes and rating to an application
   */
  async addApplicationNotes(
    auditionId: number,
    applicationId: number,
    notes: string,
    rating?: number
  ): Promise<AuditionApplication> {
    const response = await apiClient.put(`/recruiter/auditions/${auditionId}/applications/${applicationId}/notes`, {
      notes,
      rating,
    })
    return response.data.data
  },

  /**
   * Get casting call statistics
   */
  async getAuditionStats(): Promise<AuditionStats> {
    const response = await apiClient.get('/recruiter/auditions/stats')
    return response.data.data
  },
}

export default auditionService
