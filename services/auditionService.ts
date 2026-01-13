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

    // Handle nested response structure from backend
    const apiData = response.data?.data || response.data

    // Transform to match PaginatedResponse interface
    return {
      success: response.data?.success ?? true,
      data: Array.isArray(apiData) ? apiData : (apiData?.applications || apiData?.data || []),
      totalElements: apiData?.totalElements || 0,
      totalPages: apiData?.totalPages || 0,
      currentPage: apiData?.currentPage || 0,
      size: filters?.size ?? 20,
    }
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

  // ==================== ARTIST AUDITION APIs ====================

  /**
   * Get all auditions for the artist (role-based)
   * New API format: response.data.data contains { auditions, currentPage, totalPages, ... }
   */
  async getMyAuditions(filters?: {
    page?: number
    size?: number
    status?: string
    type?: string
  }): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/artist/auditions', {
      params: {
        page: filters?.page ?? 0,
        size: filters?.size ?? 20,
        status: filters?.status,
        type: filters?.type,
      },
    })

    // New API returns: { success: true, data: { auditions: [...], totalPages, ... } }
    const apiData = response.data?.data || response.data

    // Transform to match PaginatedResponse interface
    return {
      success: response.data?.success ?? true,
      data: apiData.auditions || [],
      totalElements: apiData.totalElements || 0,
      totalPages: apiData.totalPages || 0,
      currentPage: apiData.currentPage || 0,
      size: filters?.size ?? 20,
    }
  },

  /**
   * Get upcoming auditions for the artist
   * Returns array directly (no pagination for upcoming)
   */
  async getUpcomingAuditions(): Promise<any[]> {
    const response = await apiClient.get('/artist/auditions/upcoming')
    const data = response.data?.data || response.data

    // If response has 'auditions' array, use it; otherwise assume data is the array
    return Array.isArray(data) ? data : (data.auditions || [])
  },

  /**
   * Get past auditions for the artist
   * Returns paginated response
   */
  async getPastAuditions(page: number = 0, size: number = 20): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/artist/auditions/past', {
      params: { page, size },
    })

    // New API returns: { success: true, data: { auditions: [...], totalPages, ... } }
    const apiData = response.data?.data || response.data

    // Transform to match PaginatedResponse interface
    return {
      success: response.data?.success ?? true,
      data: apiData.auditions || [],
      totalElements: apiData.totalElements || 0,
      totalPages: apiData.totalPages || 0,
      currentPage: apiData.currentPage || 0,
      size: size,
    }
  },

  /**
   * Get audition details by ID
   */
  async getMyAuditionById(id: number): Promise<any> {
    const response = await apiClient.get(`/artist/auditions/${id}`)
    return response.data.data
  },

  /**
   * Update audition status (e.g., cancel)
   */
  async updateMyAuditionStatus(id: number, status: string): Promise<any> {
    const response = await apiClient.put(`/artist/auditions/${id}/status`, { status })
    return response.data.data
  },

  /**
   * Cancel an audition
   */
  async cancelMyAudition(id: number): Promise<any> {
    const response = await apiClient.post(`/artist/auditions/${id}/cancel`)
    return response.data.data
  },

  /**
   * Get audition statistics for artist
   */
  async getMyAuditionStats(): Promise<{
    upcomingAuditions: number
    hasUpcomingAuditions: boolean
  }> {
    const response = await apiClient.get('/artist/auditions/stats')
    return response.data.data
  },

  // ==================== OPEN AUDITION APIs ====================

  /**
   * Get open auditions for artist (role-based filtering done by backend)
   */
  async getOpenAuditions(page: number = 0, size: number = 20): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/artist/auditions/open', {
      params: { page, size },
    })

    // API returns: { success: true, data: { auditions: [...], totalPages, ... } }
    const apiData = response.data?.data || response.data

    // Transform to match PaginatedResponse interface
    return {
      success: response.data?.success ?? true,
      data: apiData.auditions || [],
      totalElements: apiData.totalElements || 0,
      totalPages: apiData.totalPages || 0,
      currentPage: apiData.currentPage || 0,
      size: size,
    }
  },

  /**
   * Get single open audition details
   */
  async getOpenAuditionById(id: number): Promise<any> {
    const response = await apiClient.get(`/artist/auditions/open/${id}`)
    return response.data.data
  },

  // ==================== RECRUITER OPEN AUDITION APIs ====================

  /**
   * Create open audition (Recruiter only)
   */
  async createOpenAudition(data: any): Promise<any> {
    const response = await apiClient.post('/recruiter/open-auditions', data)
    return response.data
  },

  /**
   * Get recruiter's open auditions
   */
  async getRecruiterOpenAuditions(page: number = 0, size: number = 20): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get('/recruiter/open-auditions', {
      params: { page, size },
    })

    const apiData = response.data?.data || response.data

    return {
      success: response.data?.success ?? true,
      data: apiData.auditions || apiData || [],
      totalElements: apiData.totalElements || 0,
      totalPages: apiData.totalPages || 0,
      currentPage: apiData.currentPage || 0,
      size: size,
    }
  },

  /**
   * Update open audition (Recruiter only)
   */
  async updateOpenAudition(id: number, data: any): Promise<any> {
    const response = await apiClient.put(`/recruiter/open-auditions/${id}`, data)
    return response.data
  },

  /**
   * Delete open audition (Recruiter only)
   */
  async deleteOpenAudition(id: number): Promise<any> {
    const response = await apiClient.delete(`/recruiter/open-auditions/${id}`)
    return response.data
  },
}

export default auditionService
