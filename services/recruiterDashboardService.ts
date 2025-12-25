import apiClient from './apiClient'

// Types for API responses
export interface DashboardMetrics {
  activeJobs: {
    value: number
    trend: number
    label: string
  }
  applications: {
    value: number
    trend: number
    label: string
  }
  interviews: {
    value: number
    trend: number
    label: string
  }
  offers: {
    value: number
    trend: number
    label: string
  }
  hires: {
    value: number
    trend: number
    label: string
  }
  rejections: {
    value: number
    trend: number
    label: string
  }
}

export interface LatestApplicant {
  id: number
  name: string
  avatar: string
  job: string
  skills: string
  status: string
  appliedAt: string
  email: string
}

export interface ApplicationsTrend {
  months: string[]
  applications: number[]
  interviews: number[]
  hires: number[]
}

export interface ApplicationStatus {
  labels: string[]
  data: number[]
  percentages: number[]
  total: number
}

export interface InterviewOutcomes {
  labels: string[]
  data: number[]
}

const recruiterDashboardService = {
  /**
   * Get dashboard KPI metrics
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get('/recruiter/dashboard/metrics')
    return response.data.data
  },

  /**
   * Get latest applicants
   */
  async getLatestApplicants(limit: number = 10): Promise<LatestApplicant[]> {
    const response = await apiClient.get('/recruiter/dashboard/latest-applicants', {
      params: { limit }
    })
    return response.data.data
  },

  /**
   * Get applications trend data
   */
  async getApplicationsTrend(): Promise<ApplicationsTrend> {
    const response = await apiClient.get('/recruiter/dashboard/applications-trend')
    return response.data.data
  },

  /**
   * Get application status breakdown
   */
  async getApplicationStatus(): Promise<ApplicationStatus> {
    const response = await apiClient.get('/recruiter/dashboard/application-status')
    return response.data.data
  },

  /**
   * Get interview outcomes
   */
  async getInterviewOutcomes(): Promise<InterviewOutcomes> {
    const response = await apiClient.get('/recruiter/dashboard/interview-outcomes')
    return response.data.data
  }
}

export default recruiterDashboardService
