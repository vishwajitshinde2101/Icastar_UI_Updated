import apiClient from './apiClient'

// Types for API responses
export interface ArtistDashboardMetrics {
  profileViews: {
    value: number
    change: string
    changeType: string
  }
  jobInvitations: {
    value: number
    change: string
    changeType: string
  }
  applicationsSent: {
    value: number
    change: string
    changeType: string
  }
  interviewsScheduled: {
    value: number
    change: string
    changeType: string
  }
  projectsCompleted: {
    value: number
    change: string
    changeType: string
  }
  creditsBalance: {
    value: number
    change: string
    changeType: string
    currency: string
  }
}

export interface ProfileViewsTrend {
  trend: Array<{
    month: string
    views: number
  }>
  totalViews: number
  growthRate: number
}

export interface ApplicationStatus {
  statusBreakdown: Array<{
    name: string
    value: number
    color: string
  }>
  total: number
}

export interface EarningsTrend {
  trend: Array<{
    month: string
    earnings: number
  }>
  totalEarnings: number
  averageEarnings: number
  highestMonth: string
  growthRate: number
}

export interface JobOpportunity {
  id: number
  title: string
  company: string
  companyLogo: string | null
  budget: string
  budgetMin: number
  budgetMax: number
  currency: string
  matchScore: number
  type: string
  location: string
  postedAt: string
  skills: string[]
  description: string
}

export interface RecentActivity {
  id: number
  type: string
  title: string
  company: string
  timestamp: string
  relativeTime: string
  metadata: Record<string, any>
}

export interface PortfolioItem {
  id: number
  title: string
  description: string
  imageUrl: string
  thumbnailUrl: string
  views: number
  likes: number
  category: string
  tags: string[]
  uploadedAt: string
}

export interface ProfileCompletion {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  recommendations: Array<{
    field: string
    importance: string
    message: string
  }>
}

const artistDashboardService = {
  /**
   * Get artist dashboard KPI metrics
   */
  async getDashboardMetrics(): Promise<ArtistDashboardMetrics> {
    const response = await apiClient.get('/artist/dashboard/metrics')
    return response.data.data
  },

  /**
   * Get profile views trend data
   */
  async getProfileViewsTrend(period: '7' | '30' | '90' = '30'): Promise<ProfileViewsTrend> {
    const response = await apiClient.get('/artist/dashboard/profile-views-trend', {
      params: { period }
    })
    return response.data.data
  },

  /**
   * Get application status distribution
   */
  async getApplicationStatus(): Promise<ApplicationStatus> {
    const response = await apiClient.get('/artist/dashboard/application-status')
    return response.data.data
  },

  /**
   * Get earnings trend data
   */
  async getEarningsTrend(period: '7' | '30' | '90' = '30'): Promise<EarningsTrend> {
    const response = await apiClient.get('/artist/dashboard/earnings-trend', {
      params: { period }
    })
    return response.data.data
  },

  /**
   * Get AI-matched job opportunities
   */
  async getJobOpportunities(limit: number = 4): Promise<JobOpportunity[]> {
    const response = await apiClient.get('/artist/dashboard/job-opportunities', {
      params: { limit }
    })
    return response.data.data
  },

  /**
   * Get recent activity timeline
   */
  async getRecentActivity(limit: number = 4): Promise<RecentActivity[]> {
    const response = await apiClient.get('/artist/dashboard/recent-activity', {
      params: { limit }
    })
    return response.data.data
  },

  /**
   * Get portfolio items
   */
  async getPortfolio(limit: number = 4, sortBy: 'recent' | 'popular' = 'recent'): Promise<PortfolioItem[]> {
    const response = await apiClient.get('/artist/dashboard/portfolio', {
      params: { limit, sortBy }
    })
    return response.data.data
  },

  /**
   * Get profile completion status
   */
  async getProfileCompletion(): Promise<ProfileCompletion> {
    const response = await apiClient.get('/artist/profile/completion')
    return response.data.data
  }
}

export default artistDashboardService
