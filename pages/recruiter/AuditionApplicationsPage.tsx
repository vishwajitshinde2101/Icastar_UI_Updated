import React, { useState, useEffect } from 'react'
import { Card } from '../../components/Card'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import auditionService from '../../services/auditionService'
import { Audition, AuditionApplication, AuditionApplicationStatus } from '../../types'
import {
  UserCircleIcon,
  CalendarIcon,
  FilterIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '../../components/icons/IconComponents'

export const AuditionApplicationsPage: React.FC = () => {
  const navigate = useNavigate()
  const { auditionId } = useParams<{ auditionId: string }>()
  const [audition, setAudition] = useState<Audition | null>(null)
  const [applications, setApplications] = useState<AuditionApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<AuditionApplicationStatus | 'All'>('All')
  const [selectedApplications, setSelectedApplications] = useState<number[]>([])

  useEffect(() => {
    if (auditionId) {
      fetchAuditionDetails()
      fetchApplications()
    }
  }, [auditionId, filterStatus])

  const fetchAuditionDetails = async () => {
    try {
      const data = await auditionService.getAuditionById(Number(auditionId))
      setAudition(data)
    } catch (error) {
      console.error('Failed to fetch audition:', error)
      toast.error('Failed to load audition details')
    }
  }

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const status = filterStatus === 'All' ? undefined : filterStatus
      const response = await auditionService.getAuditionApplications(Number(auditionId), status)

      console.log('[AuditionApplications] Full response:', response)
      console.log('[AuditionApplications] Response data array:', response?.data)
      console.log('[AuditionApplications] Count:', response?.data?.length)

      // Extract applications array from PaginatedResponse
      const applicationsArray = Array.isArray(response?.data) ? response.data : []
      console.log('[AuditionApplications] Setting applications array:', applicationsArray)

      setApplications(applicationsArray)
    } catch (error) {
      console.error('[AuditionApplications] Failed to fetch applications:', error)
      console.error('[AuditionApplications] Error details:', (error as any).response?.data)
      toast.error('Failed to load applications')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (applicationId: number, status: AuditionApplicationStatus) => {
    try {
      await auditionService.updateApplicationStatus(Number(auditionId), applicationId, status)
      toast.success(`Application ${status.toLowerCase()} successfully`)
      fetchApplications()
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update application status')
    }
  }

  const handleBulkAction = async (status: AuditionApplicationStatus) => {
    if (selectedApplications.length === 0) {
      toast.error('Please select at least one application')
      return
    }

    try {
      await auditionService.bulkUpdateApplicationStatus(Number(auditionId), selectedApplications, status)
      toast.success(`${selectedApplications.length} applications updated successfully`)
      setSelectedApplications([])
      fetchApplications()
    } catch (error) {
      console.error('Failed to bulk update:', error)
      toast.error('Failed to update applications')
    }
  }

  const toggleSelectApplication = (id: number) => {
    setSelectedApplications((prev) => (prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([])
    } else {
      setSelectedApplications(applications.map((app) => app.id))
    }
  }

  const getStatusBadge = (status: AuditionApplicationStatus) => {
    const badges = {
      Applied: 'bg-blue-100 text-blue-700',
      Shortlisted: 'bg-purple-100 text-purple-700',
      Rejected: 'bg-red-100 text-red-700',
      Accepted: 'bg-green-100 text-green-700',
      Withdrawn: 'bg-gray-100 text-gray-700',
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
          <p className='text-gray-600 text-lg'>Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <button onClick={() => navigate('/recruiter/auditions')} className='text-purple-600 hover:text-purple-700 mb-2 text-sm'>
            ← Back to Auditions
          </button>
          <h1 className='text-3xl font-bold text-gray-900'>{audition?.title || 'Audition Applications'}</h1>
          <p className='text-sm text-gray-600 mt-1'>
            {audition?.roleType} • {audition?.projectType}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold'>
            {applications.length} Total Applications
          </span>
        </div>
      </div>

      {/* Audition Info Card */}
      {audition && (
        <Card className='bg-gradient-to-r from-purple-50 to-indigo-50'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div>
              <p className='text-sm text-gray-600'>Submission Deadline</p>
              <p className='text-lg font-semibold text-gray-900'>
                <CalendarIcon className='inline h-4 w-4 mr-1' />
                {formatDate(audition.submissionDeadline)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Audition Mode</p>
              <p className='text-lg font-semibold text-gray-900'>{audition.auditionMode}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Status</p>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-${audition.status === 'Open' ? 'green' : 'gray'}-100 text-${audition.status === 'Open' ? 'green' : 'gray'}-700`}>
                {audition.status}
              </span>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Compensation</p>
              <p className='text-lg font-semibold text-gray-900'>
                {audition.compensationType === 'Paid' ? `${audition.currency} ${audition.budgetMin} - ${audition.budgetMax}` : audition.compensationType}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and Bulk Actions */}
      <Card>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-center gap-2'>
            <FilterIcon className='h-5 w-5 text-gray-600' />
            <span className='text-sm font-medium text-gray-700'>Filter by status:</span>
            {(['All', 'Applied', 'Shortlisted', 'Accepted', 'Rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {status}
              </button>
            ))}
          </div>

          {selectedApplications.length > 0 && (
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>{selectedApplications.length} selected</span>
              <button
                onClick={() => handleBulkAction('Shortlisted')}
                className='px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700'>
                Shortlist
              </button>
              <button
                onClick={() => handleBulkAction('Accepted')}
                className='px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700'>
                Accept
              </button>
              <button
                onClick={() => handleBulkAction('Rejected')}
                className='px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700'>
                Reject
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <div className='text-center py-12'>
            <UserCircleIcon className='h-16 w-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>No applications yet</h3>
            <p className='text-gray-600'>
              {filterStatus === 'All' ? 'Applications will appear here once artists apply' : `No ${filterStatus.toLowerCase()} applications`}
            </p>
          </div>
        </Card>
      ) : (
        <div className='space-y-4'>
          {/* Select All Checkbox */}
          <Card className='bg-gray-50'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={selectedApplications.length === applications.length && applications.length > 0}
                onChange={toggleSelectAll}
                className='w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
              />
              <span className='text-sm font-medium text-gray-700'>Select All ({applications.length} applications)</span>
            </label>
          </Card>

          {/* Application Cards */}
          {applications.map((application) => (
            <Card key={application.id} className='hover:shadow-lg transition-all'>
              <div className='flex items-start gap-4'>
                {/* Checkbox */}
                <input
                  type='checkbox'
                  checked={selectedApplications.includes(application.id)}
                  onChange={() => toggleSelectApplication(application.id)}
                  className='mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
                />

                {/* Avatar */}
                <div className='shrink-0'>
                  {application.artistAvatar ? (
                    <img
                      src={application.artistAvatar}
                      alt={application.artistName}
                      className='w-16 h-16 rounded-full object-cover'
                    />
                  ) : (
                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-xl'>
                      {application.artistName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Application Details */}
                <div className='flex-1'>
                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-900'>{application.artistName}</h3>
                      <p className='text-sm text-gray-600'>{application.artistEmail}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(application.status)}`}>
                      {application.status}
                    </span>
                  </div>

                  <div className='flex items-center gap-4 text-sm text-gray-600 mb-3'>
                    <span className='bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium'>
                      {application.artistCategory}
                    </span>
                    <span className='flex items-center gap-1'>
                      <CalendarIcon className='h-4 w-4' />
                      Applied {formatDate(application.appliedAt)}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className='flex flex-wrap gap-2 mb-3'>
                    {application.artistSkills.slice(0, 5).map((skill) => (
                      <span key={skill} className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'>
                        {skill}
                      </span>
                    ))}
                    {application.artistSkills.length > 5 && (
                      <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'>
                        +{application.artistSkills.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Cover Letter */}
                  {application.coverLetter && (
                    <div className='bg-gray-50 p-3 rounded-lg mb-3'>
                      <p className='text-sm text-gray-700 line-clamp-2'>{application.coverLetter}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className='flex items-center gap-2 flex-wrap'>
                    <button
                      onClick={() => navigate(`/recruiter/artists/${application.artistId}`)}
                      className='flex items-center gap-1 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700'>
                      <EyeIcon className='h-4 w-4' />
                      View Profile
                    </button>

                    {application.portfolioUrl && (
                      <a
                        href={application.portfolioUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700'>
                        View Portfolio
                      </a>
                    )}

                    {application.status !== 'Shortlisted' && application.status !== 'Accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(application.id, 'Shortlisted')}
                        className='flex items-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-100'>
                        <CheckCircleIcon className='h-4 w-4' />
                        Shortlist
                      </button>
                    )}

                    {application.status !== 'Accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(application.id, 'Accepted')}
                        className='flex items-center gap-1 px-3 py-2 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100'>
                        <CheckCircleIcon className='h-4 w-4' />
                        Accept
                      </button>
                    )}

                    {application.status !== 'Rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(application.id, 'Rejected')}
                        className='flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100'>
                        <XCircleIcon className='h-4 w-4' />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuditionApplicationsPage
