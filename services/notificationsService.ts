import apiClient from './apiClient'

export interface Notification {
  id: number
  userId: number
  type: string
  title: string
  message: string
  actionUrl?: string
  metadata?: Record<string, any>
  isRead: boolean
  createdAt: string
}

export interface NotificationResponse {
  notifications: Notification[]
  totalElements: number
  totalPages: number
  currentPage: number
  hasUnread: boolean
}

export interface UnreadCountResponse {
  count: number
}

const notificationsService = {
  /**
   * Get all notifications with pagination
   */
  async getNotifications(page: number = 0, size: number = 20): Promise<NotificationResponse> {
    const response = await apiClient.get('/notifications', {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count')
    return response.data.count
  },

  /**
   * Mark a specific notification as read
   */
  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`)
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.put('/notifications/mark-all-read')
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`)
  }
}

export default notificationsService
