import apiClient from './apiClient'

export interface RecentHireDto {
  id: number
  jobId: number
  jobTitle: string
  artistId: number
  artistName: string
  artistEmail: string
  artistCategory?: string
  hireStatus?: string
  hiredAt?: string
  startDate?: string
  endDate?: string
  agreedSalary?: string
  currency?: string
  contractType?: string
  workLocation?: string
  workSchedule?: string
  performanceRating?: string
  feedback?: string
  isCompleted?: boolean
  isRecommended?: boolean
  canViewProfile?: boolean
  canRate?: boolean
  canRecommend?: boolean
  canRehire?: boolean
  canMessage?: boolean
}

export interface GetHiresParams {
  status?: string
  artistCategory?: string
  jobType?: string
  performanceRating?: string
  isCompleted?: boolean
  isRecommended?: boolean
  page?: number
  size?: number
}

export interface PagedHiresResult {
  items: RecentHireDto[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export async function getHires(params: GetHiresParams = {}): Promise<PagedHiresResult> {
  const { page = 0, size = 10, ...filters } = params
  const response = await apiClient.get('/recruiter/dashboard/hires', {
    params: { page, size, ...filters },
  })

  console.log('Raw API Response:', response.data)

  // Extract data from response.data.data structure
  const apiData = response.data?.data ?? {}
  console.log('Extracted apiData:', apiData)
  console.log('Hires array:', apiData.hires)

  return {
    items: Array.isArray(apiData.hires) ? apiData.hires : [],
    totalElements: apiData.totalElements ?? 0,
    totalPages: apiData.totalPages ?? 0,
    currentPage: apiData.currentPage ?? 0,
    size: apiData.size ?? size,
  }
}

export async function getHireDetails(hireId: number): Promise<Record<string, unknown>> {
  const response = await apiClient.get(`/recruiter/dashboard/hires/${hireId}`)
  return response.data?.data ?? {}
}