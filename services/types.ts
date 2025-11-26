// Service-layer shared types for requests and responses.
// These complement the UI types in src-level `types.ts`.

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiListParams {
  page?: number
  pageSize?: number
  search?: string
  sort?: string
  [key: string]: unknown
}

export interface ArtistProfileDTO {
  id: number
  name: string
  avatarUrl?: string
  bio?: string
  skills?: string[]
  email?: string
  portfolioUrl?: string
  // Extend with fields from your registration flow as needed
  [key: string]: unknown
}

export interface UpdateArtistProfileInput {
  name?: string
  avatarUrl?: string
  bio?: string
  skills?: string[]
  email?: string
  portfolioUrl?: string
  [key: string]: unknown
}

export interface JobDTO {
  id: number
  title: string
  company?: string
  type?: string
  description?: string
  skills?: string
  postedDate?: string
  createdDate?: string
  boosted?: boolean
}

export type ApplicationStatus = 'Applied' | 'Interview' | 'Rejected' | 'Offer'

export interface ApplicationDTO {
  id: number
  jobId: number
  jobTitle: string
  company?: string
  appliedAt: string
  status: ApplicationStatus
}

export interface MessageDTO {
  id: number
  from: string
  to: string
  body: string
  sentAt: string
  read?: boolean
}

// ---- Auth / User ----
export type UserRole = 'artist' | 'recruiter'

export interface UserDTO {
  id: number
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
}

export interface AuthResponse {
  token: string
  user: UserDTO
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface OtpResponse {
  success: boolean
  message?: string
}

// Detailed user shape aligned with external auth response mapping
export interface User {
  id: number | string
  email: string
  fullName?: string
  phone?: string
  profilePicture?: string
  authProvider?: string
  emailVerified?: boolean
  lastLoginAt?: string
  createdAt?: string
  updatedAt?: string
  roles?: string[]
}

// Backward compatible alias for login
export type LoginRequest = LoginInput

// Extended auth response supporting refresh tokens and detailed user
export interface FullAuthResponse {
  token: string
  refreshToken?: string
  user: User
}
