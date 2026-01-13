import api from './apiClient'

export interface User {
  id: string | number
  email: string
  mobile?: string
  fullName?: string
  firstName?: string
  lastName?: string
  phone?: string
  profilePicture?: string
  authProvider?: string
  emailVerified?: boolean
  lastLoginAt?: string
  createdAt?: string
  updatedAt?: string
  roles?: string[]
  role?: string
  status?: string
  isVerified?: boolean
  isOnboardingComplete?: boolean
  artistProfile?: {
    artistProfileId: number
    stageName?: string
    isVerified: boolean
    isProfileComplete: boolean
    artistType?: {
      id: number
      name: string
      displayName: string
    }
  }
  recruiterProfile?: {
    recruiterProfileId: number
    companyName?: string
    isVerifiedCompany: boolean
  }
}

export interface AuthResponse {
  data: {
    token: string
    email: string
    mobile?: string
    role: string
    status: string
    isVerified: boolean
    firstName?: string
    lastName?: string
    fullName?: string
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  firstName: string
  lastName: string
  mobile?: string
  role: string
}

// Auth functions
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      console.log('Login response:', response.data.data)

      const { token, email, mobile, role, status, isVerified, firstName, lastName, fullName } = response.data.data

      // Store tokens and user data
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify({ email, mobile, role, status, isVerified, firstName, lastName, fullName }))

      // Set default auth header for future requests
      api.interceptors.request.use(config => {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      })

      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData)
      return response.data
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/auth/me')
      const data = response.data?.data ?? response.data
      return data
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    }
  },

  async getMe(): Promise<User> {
    return this.getCurrentUser()
  },

  logout(): void {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    // Clear auth header from axios instance
    if (api.defaults.headers.common) {
      delete api.defaults.headers.common['Authorization']
    }
  },

  getStoredUser(): User | null {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken')
  },
}

export default authService
