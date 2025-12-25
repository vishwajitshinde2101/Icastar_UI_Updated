import React, { useState, useEffect } from 'react'
import { Card } from '../../components/Card'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import auditionService from '../../services/auditionService'
import { Audition, AuditionStatus } from '../../types'
import {
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  BriefcaseIcon,
  FilterIcon,
} from '../../components/icons/IconComponents'

export const AuditionsListPage: React.FC = () => {
  const navigate = useNavigate()
  const [auditions, setAuditions] = useState<Audition[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<AuditionStatus | 'All'>('All')
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card')
  const [stats, setStats] = useState({
    totalAuditions: 0,
    activeAuditions: 0,
    draftAuditions: 0,
    totalApplications: 0,
  })

  useEffect(() => {
    fetchAuditions()
    fetchStats()
  }, [filterStatus])

  const fetchAuditions = async () => {
    try {
      setLoading(true)
      const status = filterStatus === 'All' ? undefined : filterStatus
      const response = await auditionService.getAllAuditions({ status })
      setAuditions(response.data || [])
    } catch (error) {
      console.error('Failed to fetch auditions:', error)
      toast.error('Failed to load auditions')
      setAuditions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await auditionService.getAuditionStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleCloseAudition = async (id: number) => {
    if (!window.confirm('Are you sure you want to close this audition?')) return

    try {
      await auditionService.closeAudition(id)
      toast.success('Audition closed successfully')
      fetchAuditions()
      fetchStats()
    } catch (error) {
      console.error('Failed to close audition:', error)
      toast.error('Failed to close audition')
    }
  }

  const handleDeleteAudition = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this audition? This action cannot be undone.')) return

    try {
      await auditionService.deleteAudition(id)
      toast.success('Audition deleted successfully')
      fetchAuditions()
      fetchStats()
    } catch (error) {
      console.error('Failed to delete audition:', error)
      toast.error('Failed to delete audition')
    }
  }

  const getStatusBadge = (status: AuditionStatus) => {
    const badges = {
      DRAFT: 'bg-gray-100 text-gray-700',
      OPEN: 'bg-green-100 text-green-700',
      CLOSED: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-yellow-100 text-yellow-700',
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600 text-lg'>Loading auditions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Auditions</h1>
          <p className='text-sm text-gray-600 mt-1'>Manage your audition postings and applications</p>
        </div>
        <button
          onClick={() => navigate('/recruiter/auditions/create')}
          className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors'>
          <PlusIcon className='h-5 w-5' />
          Create Audition
        </button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='hover:shadow-lg transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Auditions</p>
              <p className='text-2xl font-bold text-gray-900 mt-1'>{stats.totalAuditions}</p>
            </div>
            <div className='bg-purple-100 p-3 rounded-lg'>
              <BriefcaseIcon className='h-6 w-6 text-purple-600' />
            </div>
          </div>
        </Card>

        <Card className='hover:shadow-lg transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Active Auditions</p>
              <p className='text-2xl font-bold text-green-600 mt-1'>{stats.activeAuditions}</p>
            </div>
            <div className='bg-green-100 p-3 rounded-lg'>
              <CalendarIcon className='h-6 w-6 text-green-600' />
            </div>
          </div>
        </Card>

        <Card className='hover:shadow-lg transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Draft Auditions</p>
              <p className='text-2xl font-bold text-gray-600 mt-1'>{stats.draftAuditions}</p>
            </div>
            <div className='bg-gray-100 p-3 rounded-lg'>
              <BriefcaseIcon className='h-6 w-6 text-gray-600' />
            </div>
          </div>
        </Card>

        <Card className='hover:shadow-lg transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Applications</p>
              <p className='text-2xl font-bold text-indigo-600 mt-1'>{stats.totalApplications}</p>
            </div>
            <div className='bg-indigo-100 p-3 rounded-lg'>
              <UsersIcon className='h-6 w-6 text-indigo-600' />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FilterIcon className='h-5 w-5 text-gray-600' />
            <span className='text-sm font-medium text-gray-700'>Filter by status:</span>
            {(['All', 'DRAFT', 'OPEN', 'CLOSED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {status === 'All' ? status : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                viewMode === 'card' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              Table View
            </button>
          </div>
        </div>
      </Card>

      {/* Auditions List */}
      {auditions.length === 0 ? (
        <Card>
          <div className='text-center py-12'>
            <BriefcaseIcon className='h-16 w-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>No auditions found</h3>
            <p className='text-gray-600 mb-4'>
              {filterStatus === 'All' ? 'Create your first audition to get started' : `No ${filterStatus.toLowerCase()} auditions`}
            </p>
            <button
              onClick={() => navigate('/recruiter/auditions/create')}
              className='inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700'>
              <PlusIcon className='h-5 w-5' />
              Create Audition
            </button>
          </div>
        </Card>
      ) : viewMode === 'card' ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {auditions.map((audition) => (
            <Card key={audition.id} className='hover:shadow-xl transition-all'>
              <div className='space-y-4'>
                {/* Header */}
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-1'>{audition.title}</h3>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <span className='bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium'>
                        {audition.roleType}
                      </span>
                      <span className='bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium'>
                        {audition.projectType}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(audition.status)}`}>
                    {audition.status.charAt(0) + audition.status.slice(1).toLowerCase()}
                  </span>
                </div>

                {/* Details */}
                <div className='space-y-2 text-sm text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <CalendarIcon className='h-4 w-4' />
                    <span>Deadline: {formatDate(audition.applicationDeadline)}</span>
                  </div>
                  {audition.auditionLocation && (
                    <div className='flex items-center gap-2'>
                      <MapPinIcon className='h-4 w-4' />
                      <span>{audition.auditionLocation}</span>
                    </div>
                  )}
                  <div className='flex items-center gap-2'>
                    <UsersIcon className='h-4 w-4' />
                    <span>{audition.totalApplications} Applications</span>
                  </div>
                </div>

                {/* Description */}
                <p className='text-sm text-gray-600 line-clamp-2'>{audition.description}</p>

                {/* Actions */}
                <div className='flex items-center gap-2 pt-4 border-t border-gray-200'>
                  <button
                    onClick={() => navigate(`/recruiter/auditions/${audition.id}/applications`)}
                    className='flex-1 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700'>
                    View Applications
                  </button>
                  <button
                    onClick={() => navigate(`/recruiter/auditions/${audition.id}/edit`)}
                    className='px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200'>
                    Edit
                  </button>
                  {audition.status === 'OPEN' && (
                    <button
                      onClick={() => handleCloseAudition(audition.id)}
                      className='px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100'>
                      Close
                    </button>
                  )}
                  {audition.status === 'DRAFT' && (
                    <button
                      onClick={() => handleDeleteAudition(audition.id)}
                      className='px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100'>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Title</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Role Type</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Deadline</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Applications</th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {auditions.map((audition) => (
                  <tr key={audition.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900'>{audition.title}</div>
                      <div className='text-xs text-gray-500'>{audition.projectType}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800'>
                        {audition.roleType}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>{formatDate(audition.applicationDeadline)}</td>
                    <td className='px-6 py-4'>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(audition.status)}`}>
                        {audition.status.charAt(0) + audition.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900'>{audition.totalApplications}</td>
                    <td className='px-6 py-4 text-right text-sm font-medium space-x-2'>
                      <button
                        onClick={() => navigate(`/recruiter/auditions/${audition.id}/applications`)}
                        className='text-purple-600 hover:text-purple-900'>
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/recruiter/auditions/${audition.id}/edit`)}
                        className='text-indigo-600 hover:text-indigo-900'>
                        Edit
                      </button>
                      {audition.status === 'OPEN' && (
                        <button onClick={() => handleCloseAudition(audition.id)} className='text-red-600 hover:text-red-900'>
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AuditionsListPage
