import { useState, useEffect, useCallback } from 'react'
import notificationsService from '../services/notificationsService'

/**
 * Custom hook for managing notifications with automatic polling
 * @param pollingInterval - Interval in milliseconds to poll for new notifications (default: 30000ms = 30s)
 * @param enabled - Whether to enable polling (default: true)
 */
export const useNotifications = (pollingInterval: number = 30000, enabled: boolean = true) => {
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
      // Don't show error to user for polling failures
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchUnreadCount()
    }
  }, [enabled, fetchUnreadCount])

  // Set up polling
  useEffect(() => {
    if (!enabled || pollingInterval <= 0) return

    const intervalId = setInterval(() => {
      fetchUnreadCount()
    }, pollingInterval)

    return () => {
      clearInterval(intervalId)
    }
  }, [enabled, pollingInterval, fetchUnreadCount])

  const refreshUnreadCount = useCallback(() => {
    return fetchUnreadCount()
  }, [fetchUnreadCount])

  return {
    unreadCount,
    setUnreadCount,
    refreshUnreadCount,
    isLoading
  }
}
