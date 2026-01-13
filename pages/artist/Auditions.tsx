import React, { useState, useEffect } from 'react'
import Icon from '@/components/Icon'
import auditionService from '@/services/auditionService'
import { toast } from 'react-toastify'

interface AuditionData {
  id: number
  type: string
  status: string
  scheduledAt: string
  durationMinutes?: number
  meetingLink?: string
  instructions?: string
  feedback?: string
  rating?: number
  job?: {
    jobId: number
    jobTitle: string
    company: string
    location: string
  }
  recruiter?: {
    id: number
    companyName: string
  }
}

const getIconForType = (type: string): string => {
  switch (type) {
    case 'LIVE_VIDEO':
      return 'Video'
    case 'LIVE_AUDIO':
      return 'Mic'
    case 'IN_PERSON':
      return 'MapPin'
    case 'RECORDED_SUBMISSION':
      return 'Camera'
    default:
      return 'Calendar'
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const AuditionItem: React.FC<{
  audition: AuditionData
  onCancel: (id: number) => void
}> = ({ audition, onCancel }) => {
  const icon = getIconForType(audition.type)
  const title = audition.job?.jobTitle || 'Audition'
  const date = formatDate(audition.scheduledAt)
  const location = audition.job?.location || 'Location TBD'
  const company = audition.job?.company || audition.recruiter?.companyName || 'Company'

  const getStatusBadge = () => {
    switch (audition.status) {
      case 'SCHEDULED':
        return <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold'>Scheduled</span>
      case 'COMPLETED':
        return <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold'>Completed</span>
      case 'CANCELLED':
        return <span className='px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold'>Cancelled</span>
      case 'IN_PROGRESS':
        return <span className='px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold'>In Progress</span>
      case 'NO_SHOW':
        return <span className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold'>No Show</span>
      default:
        return null
    }
  }

  return (
    <li className='bg-white/90 rounded-2xl p-5 flex items-center gap-5 hover:bg-amber-50 transition-colors duration-300 shadow-md border border-amber-50'>
      <div className='bg-amber-100 text-amber-800 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0'>
        <Icon name={icon as any} size={32} />
      </div>
      <div className='flex-grow'>
        <div className='flex items-center gap-2 mb-1'>
          <h3 className='font-bold text-lg'>{title}</h3>
          {getStatusBadge()}
        </div>
        <p className='text-sm text-gray-500'>{company}</p>
        {audition.durationMinutes && (
          <p className='text-xs text-gray-400 mt-1'>Duration: {audition.durationMinutes} minutes</p>
        )}
      </div>
      <div className='text-right flex-shrink-0'>
        <p className='font-semibold text-amber-700'>{date}</p>
        <p className='text-sm text-gray-600 flex items-center justify-end gap-1'>
          <Icon name='MapPin' size={14} />
          {location}
        </p>
        {audition.meetingLink && audition.status === 'SCHEDULED' && (
          <a
            href={audition.meetingLink}
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs text-blue-600 hover:text-blue-800 underline mt-1 block'>
            Join Meeting
          </a>
        )}
        {audition.status === 'SCHEDULED' && (
          <button
            onClick={() => onCancel(audition.id)}
            className='text-xs text-red-600 hover:text-red-800 mt-1 block'>
            Cancel
          </button>
        )}
      </div>
    </li>
  )
}

const Auditions: React.FC = () => {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [auditions, setAuditions] = useState<AuditionData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'open'>('open')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchAuditions = async () => {
    try {
      setLoading(true)
      let response

      if (filter === 'open') {
        // Open auditions - role-based filtering done by backend
        response = await auditionService.getOpenAuditions(page, 20)
        console.log('[Auditions] Open auditions - full response:', response)
        console.log('[Auditions] Open auditions - data array:', response?.data)
        console.log('[Auditions] Open auditions - count:', response?.data?.length)
        setAuditions(Array.isArray(response.data) ? response.data : [])
        setTotalPages(response.totalPages || 0)
      } else if (filter === 'upcoming') {
        const data = await auditionService.getUpcomingAuditions()
        console.log('[Auditions] Upcoming auditions - raw response:', data)
        console.log('[Auditions] Upcoming auditions - count:', data?.length)
        setAuditions(Array.isArray(data) ? data : [])
        setTotalPages(0)
      } else if (filter === 'past') {
        response = await auditionService.getPastAuditions(page, 20)
        console.log('[Auditions] Past auditions - full response:', response)
        console.log('[Auditions] Past auditions - data array:', response?.data)
        console.log('[Auditions] Past auditions - count:', response?.data?.length)
        setAuditions(Array.isArray(response.data) ? response.data : [])
        setTotalPages(response.totalPages || 0)
      } else {
        response = await auditionService.getMyAuditions({ page, size: 20 })
        console.log('[Auditions] All auditions - full response:', response)
        console.log('[Auditions] All auditions - data array:', response?.data)
        console.log('[Auditions] All auditions - count:', response?.data?.length)
        setAuditions(Array.isArray(response.data) ? response.data : [])
        setTotalPages(response.totalPages || 0)
      }
    } catch (error: any) {
      console.error('[Auditions] Failed to fetch auditions:', error)
      console.error('[Auditions] Error details:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to load auditions')
      setAuditions([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditions()
  }, [filter, page])

  const handleCancelAudition = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this audition?')) {
      return
    }

    try {
      await auditionService.cancelMyAudition(id)
      toast.success('Audition cancelled successfully')
      fetchAuditions() // Refresh the list
    } catch (error: any) {
      console.error('Failed to cancel audition:', error)
      toast.error('Failed to cancel audition')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl font-bold'>My Auditions</h1>
          <p className='text-gray-600'>Your scheduled auditions and interviews.</p>
        </div>
        <div className='flex items-center gap-2'>
          {/* Filter Buttons */}
          <div className='flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm mr-2'>
            <button
              onClick={() => {
                setFilter('open')
                setPage(0)
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'open'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-gray-600 hover:bg-amber-50'
              }`}>
              Open Auditions
            </button>
            <button
              onClick={() => {
                setFilter('upcoming')
                setPage(0)
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'upcoming'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-gray-600 hover:bg-amber-50'
              }`}>
              Upcoming
            </button>
            <button
              onClick={() => {
                setFilter('past')
                setPage(0)
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'past' ? 'bg-amber-600 text-white shadow' : 'text-gray-600 hover:bg-amber-50'
              }`}>
              Past
            </button>
            <button
              onClick={() => {
                setFilter('all')
                setPage(0)
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'all' ? 'bg-amber-600 text-white shadow' : 'text-gray-600 hover:bg-amber-50'
              }`}>
              All
            </button>
          </div>

          {/* View Toggle */}
          <div className='flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm'>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                view === 'list'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-gray-600 hover:bg-amber-50'
              }`}>
              <Icon name='List' size={20} className='inline mr-2' />
              List
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                view === 'map' ? 'bg-amber-600 text-white shadow' : 'text-gray-600 hover:bg-amber-50'
              }`}>
              <Icon name='Map' size={20} className='inline mr-2' />
              Map
            </button>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <>
          {loading ? (
            <div className='bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto'></div>
                <p className='text-gray-600 mt-4'>Loading auditions...</p>
              </div>
            </div>
          ) : auditions.length === 0 ? (
            <div className='bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center'>
              <div className='text-center'>
                <Icon name='Calendar' size={64} className='mx-auto text-gray-300 mb-4' />
                <h3 className='text-xl font-bold text-gray-700'>No Auditions Found</h3>
                <p className='text-gray-500'>
                  {filter === 'open'
                    ? 'No open auditions available for your role at the moment. Check back later!'
                    : filter === 'upcoming'
                    ? 'You have no upcoming auditions scheduled.'
                    : filter === 'past'
                    ? 'You have no past auditions.'
                    : 'You have no auditions yet.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <ul className='space-y-4'>
                {auditions.map((audition) => (
                  <AuditionItem key={audition.id} audition={audition} onCancel={handleCancelAudition} />
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex justify-center gap-2 mt-6'>
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className='px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50'>
                    Previous
                  </button>
                  <span className='px-4 py-2 bg-white rounded-lg shadow'>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className='px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50'>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className='bg-white rounded-2xl shadow-lg p-6 h-[60vh] flex items-center justify-center text-center'>
          <div>
            <img
              src='https://i.imgur.com/gX3A1v3.png'
              alt='Map placeholder'
              className='rounded-xl'
            />
            <h3 className='text-xl font-bold mt-4 text-gray-700'>Map View is Coming Soon!</h3>
            <p className='text-gray-500'>Visually explore auditions near you.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Auditions
