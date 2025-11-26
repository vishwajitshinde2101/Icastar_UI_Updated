import React, { useState, useMemo, useEffect } from 'react'
import { Card } from '../../components/Card'
import { RecentHireDto, getHires } from '../../services/recruiterHiresService'
import { Pagination } from '../../components/Pagination'
import { SearchIcon } from '../../components/icons/IconComponents'
import { useNavigate } from 'react-router-dom'

// Server returns ISO dates; format for display
const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

export const PastHiresPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [jobFilter, setJobFilter] = useState('All')
  const ITEMS_PER_PAGE = 5
  const [hires, setHires] = useState<RecentHireDto[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const jobTitles = useMemo(() => {
    const titles = hires.map(hire => hire.jobTitle)
    return ['All', ...Array.from(new Set(titles))]
  }, [hires])

  const filteredHires = useMemo(() => {
    return hires.filter(hire => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        searchLower === '' ||
        (hire.artistName || '').toLowerCase().includes(searchLower) ||
        hire.jobTitle.toLowerCase().includes(searchLower) ||
        (hire.artistCategory || '').toLowerCase().includes(searchLower)

      const matchesJob = jobFilter === 'All' || hire.jobTitle === jobFilter

      return matchesSearch && matchesJob
    })
  }, [searchTerm, jobFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, jobFilter])

  useEffect(() => {
    const fetchHires = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getHires({ page: currentPage - 1, size: ITEMS_PER_PAGE })
        setHires(res.items)
        setTotalElements(res.totalElements)
        setTotalPages(res.totalPages)
      } catch (e: any) {
        setError(e?.message || 'Failed to load hires')
      } finally {
        setLoading(false)
      }
    }
    fetchHires()
  }, [currentPage])

  const handleClearFilters = () => {
    setSearchTerm('')
    setJobFilter('All')
  }

  // Server-side pagination; filter applies within current page
  const currentHires = filteredHires

  const handleViewDetails = (hire: RecentHireDto) => {
    navigate('/past-hires', { state: { hire } })
  }

  return (
    <div>
      <h2 className='text-3xl font-bold text-gray-900 mb-6'>Past Hires</h2>

      <Card className='mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='md:col-span-2'>
            <label
              htmlFor='search-hires'
              className='block text-sm font-medium text-gray-700'>
              Search by Name, Title, or Skill
            </label>
            <div className='relative mt-1'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <SearchIcon className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                id='search-hires'
                className='block w-full rounded-lg border-gray-300 bg-white pl-10 shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5'
                placeholder='e.g., Elaine Benes, Copywriter, SEO'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='job-filter'
              className='block text-sm font-medium text-gray-700'>
              Filter by Job
            </label>
            <select
              id='job-filter'
              className='mt-1 block w-full rounded-lg border-gray-300 bg-white shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5 pr-10'
              value={jobFilter}
              onChange={e => setJobFilter(e.target.value)}>
              {jobTitles.map(title => (
                <option key={title} value={title}>
                  {title === 'All' ? 'All Jobs' : title}
                </option>
              ))}
            </select>
          </div>
          <div className='flex items-end'>
            <button
              onClick={handleClearFilters}
              className='w-full justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors'>
              Clear
            </button>
          </div>
        </div>
      </Card>

      <Card padding='sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Artist
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Hired For
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date Hired
                </th>
                <th scope='col' className='relative px-6 py-3'>
                  <span className='sr-only'>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan={4} className='text-center py-8 px-6 text-sm text-gray-500'>
                    Loading hires...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className='text-center py-8 px-6 text-sm text-red-600'>
                    {error}
                  </td>
                </tr>
              ) : currentHires.length > 0 ? (
                currentHires.map(hire => (
                  <tr key={hire.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-11 w-11'>
                          <div className='h-11 w-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs'>
                            {hire.artistName?.charAt(0) || '?'}
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-semibold text-gray-900'>
                            {hire.artistName || 'Unknown Artist'}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {hire.artistEmail || '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {hire.jobTitle}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatDate(hire.hiredAt)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        onClick={() => handleViewDetails(hire)}
                        className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors'>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='text-center py-16 px-6'>
                    <SearchIcon className='mx-auto h-12 w-12 text-gray-400' />
                    <h3 className='mt-2 text-lg font-medium text-gray-900'>
                      No Past Hires Found
                    </h3>
                    <p className='mt-1 text-sm text-gray-500'>
                      Try adjusting your search or filter criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalElements > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalElements}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={page => setCurrentPage(page)}
          />
        )}
      </Card>
    </div>
  )
}
