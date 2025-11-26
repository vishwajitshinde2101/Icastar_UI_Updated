import React, { useEffect, useMemo, useState } from 'react'
import Icon from '@/components/Icon'
import { jobsService, JobType, ExperienceLevel } from '@/services/jobsService'
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ApplyJobModal from '@/components/ApplyJobModal'
import { bookmarksService } from '@/services/bookmarksService'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'


type JobCardProps = (any)[0] & {
  id?: number
  onApply?: (job: { id?: number; title: string }) => void
  onBookmark?: (jobId?: number) => void
  bookmarking?: boolean
}

const JobCard: React.FC<JobCardProps> = ({
  icon,
  title,
  company,
  location,
  pay,
  color,
  id,
  onApply,
  onBookmark,
  bookmarking,
}) => (
  <div className='bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
    <div>
      <div className='flex items-start justify-between'>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon name={icon as any} size={24} />
        </div>
        <span className='text-xs font-semibold bg-amber-100 text-amber-800 py-1 px-3 rounded-full'>
          Full-Time
        </span>
      </div>
      <h3 className='text-xl font-bold mt-4'>{title}</h3>
      <p className='text-gray-500 font-medium'>{company}</p>
    </div>
    <div className='mt-6'>
      <div className='flex items-center text-gray-600 text-sm gap-2'>
        <Icon name='MapPin' size={16} />
        <span>{location}</span>
      </div>
      <div className='flex items-center text-gray-600 text-sm gap-2 mt-2'>
        <Icon name='IndianRupee' size={16} />
        <span>{pay}</span>
      </div>
      <div className='flex gap-2 mt-4'>
        <button
          onClick={() => onBookmark && onBookmark(id)}
          disabled={!!bookmarking}
          className='flex-1 bg-amber-50 text-amber-800 font-semibold text-sm py-2 px-3 rounded-xl hover:bg-amber-100 transition-all'
        >
          <span className='inline-flex items-center justify-center gap-2'>
            <Icon name='Bookmark' size={16} />
            {bookmarking ? 'Saving...' : 'Bookmark'}
          </span>
        </button>
        <button
          onClick={() => onApply && onApply({ id, title })}
          className='flex-1 bg-gradient-to-r from-primary to-amber-500 text-white font-semibold text-sm py-2 px-3 rounded-xl shadow-md hover:shadow-lg transition-all'
        >
          Apply Now
        </button>
      </div>
    </div>
  </div>
)

const FilterButton: React.FC<{ label: string; icon: any }> = ({
  label,
  icon,
}) => (
  <button className='flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-amber-50 transition-colors'>
    <Icon name={icon} size={18} className='text-gray-500' />
    <span className='font-medium'>{label}</span>
    <Icon name='ChevronDown' size={16} className='text-gray-400' />
  </button>
)

const Jobs: React.FC = () => {
  const [uiJobs, setUiJobs] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [jobType, setJobType] = useState<JobType | ''>('')
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | ''>('')
  // 1-based page index for UI; convert to 0-based for API
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [total, setTotal] = useState(0)
  const [applyOpen, setApplyOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<{ id?: number; title?: string } | null>(null)
const [bookmarkLoadingId, setBookmarkLoadingId] = useState<number | null>(null)
const [confirmBookmarkOpen, setConfirmBookmarkOpen] = useState(false)
const [confirmBookmarkJobId, setConfirmBookmarkJobId] = useState<number | null>(null)

  const jobTypes: JobType[] = useMemo(
    () => ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP', 'PROJECT_BASED'],
    [],
  )
  const expLevels: ExperienceLevel[] = useMemo(
    () => ['ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'EXPERT_LEVEL'],
    [],
  )

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const { items, total: t } = await jobsService.listJobs({
          page: Math.max(0, currentPage - 1),
          size: pageSize,
          sortBy: 'createdAt',
          sortDir: 'desc',
          search: search || undefined,
          jobType: jobType || undefined,
          experienceLevel: experienceLevel || undefined,
        })
        const mapped = items.map(j => ({
          icon: 'Briefcase',
          title: j.title ?? 'Untitled Role',
          company: (j.company as string) ?? '—',
          location: (j.location as string) ?? '—',
          pay: (j.pay as string) ?? '—',
          color: 'bg-amber-100 text-amber-800',
          id: j.id,
        })) as any
        setUiJobs(mapped)
        setTotal(t ?? mapped.length)
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentPage, pageSize, search, jobType, experienceLevel])

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize))

const askBookmark = (jobId?: number) => {
  if (!jobId) return
  setConfirmBookmarkJobId(jobId)
  setConfirmBookmarkOpen(true)
}

const handleBookmark = async (jobId?: number) => {
  if (!jobId) return
  try {
    setBookmarkLoadingId(jobId)
    await bookmarksService.bookmarkJob(jobId, {})
  } catch (err) {
    console.error('Failed to bookmark job', err)
  } finally {
    setBookmarkLoadingId(null)
  }
}

const pageNumbers = useMemo(() => {
  const nums: (number | '...')[] = []
  const range = 2
  let start = Math.max(2, currentPage - range)
  let end = Math.min(totalPages - 1, currentPage + range)
  nums.push(1)
  if (start > 2) nums.push('...')
  for (let i = start; i <= end; i++) nums.push(i)
  if (end < totalPages - 1) nums.push('...')
  if (totalPages > 1) nums.push(totalPages)
  return nums
}, [currentPage, totalPages])

  return (
    <div className='space-y-6'>
      <h1 className='text-4xl font-bold'>Find Your Next Gig</h1>
      <p className='text-gray-600'>
        Explore thousands of opportunities tailored for artists like you.
      </p>

      {/* Loading handled with skeletons in the grid below */}
      {error && (
        <div className='bg-white border border-red-200 text-red-700 px-4 py-3 rounded-xl'>
          {error}
        </div>
      )}

      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm'>
          <Icon name='Search' size={18} className='text-gray-500' />
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder='Search jobs...'
            className='outline-none text-sm text-gray-700'
          />
        </div>
        <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm'>
          <Icon name='LayoutGrid' size={18} className='text-gray-500' />
          <select
            value={jobType}
            onChange={e => {
              setJobType((e.target.value || '') as JobType | '')
              setCurrentPage(1)
            }}
            className='text-sm text-gray-700 outline-none'>
            <option value=''>All Types</option>
            {jobTypes.map(jt => (
              <option key={jt} value={jt}>{jt}</option>
            ))}
          </select>
        </div>
        <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm'>
          <Icon name='Users' size={18} className='text-gray-500' />
          <select
            value={experienceLevel}
            onChange={e => {
              setExperienceLevel((e.target.value || '') as ExperienceLevel | '')
              setCurrentPage(1)
            }}
            className='text-sm text-gray-700 outline-none'>
            <option value=''>All Experience</option>
            {expLevels.map(el => (
              <option key={el} value={el}>{el}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setSearch('')
            setJobType('')
            setExperienceLevel('')
            setCurrentPage(1)
          }}
          className='flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm text-gray-500 hover:bg-amber-50 transition-colors'>
          <Icon name='X' size={18} />
          <span className='font-medium'>Clear</span>
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {loading ? (
          Array.from({ length: Math.min(pageSize, 8) }).map((_, i) => (
            <div key={i} className='bg-white rounded-2xl shadow-lg p-6'>
              <div className='flex items-start justify-between'>
                <Skeleton className='h-12 w-12 rounded-xl' />
                <Skeleton className='h-6 w-20 rounded-full' />
              </div>
              <div className='mt-4 space-y-2'>
                <Skeleton className='h-5 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
              <div className='mt-6 space-y-2'>
                <Skeleton className='h-4 w-1/3' />
                <Skeleton className='h-4 w-1/4' />
              </div>
              <Skeleton className='mt-4 h-10 w-full rounded-xl' />
            </div>
          ))
        ) : uiJobs.length > 0 ? (
          uiJobs.map((job, index) => (
            <JobCard
              key={index}
              {...job}
              onApply={(j) => {
                setSelectedJob(j)
                setApplyOpen(true)
              }}
              onBookmark={(jobId) => askBookmark(jobId)}
              bookmarking={bookmarkLoadingId === job.id}
            />
          ))
        ) : (
          <div className='col-span-full flex flex-col items-center justify-center py-12 text-gray-500'>
            <Icon name='Briefcase' size={48} className='mb-3 text-gray-400' />
            <div className='text-lg font-medium'>No job found</div>
          </div>
        )}
      </div>

      <div className='flex justify-center items-center pt-6'>
        <UIPagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                aria-label='Previous page'
                onClick={e => {
                  e.preventDefault()
                  setCurrentPage(p => Math.max(1, p - 1))
                }}
                className='disabled:opacity-50'
              >
                <ChevronLeft className='h-4 w-4' />
              </PaginationPrevious>
            </PaginationItem>
            {pageNumbers.map((n, idx) => (
              n === '...'
                ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
                : (
                  <PaginationItem key={n as number}>
                    <PaginationLink
                      href='#'
                      isActive={currentPage === (n as number)}
                      onClick={e => {
                        e.preventDefault()
                        setCurrentPage(n as number)
                      }}
                    >
                      {n as number}
                    </PaginationLink>
                  </PaginationItem>
                )
            ))}
            <PaginationItem>
              <PaginationNext
                href='#'
                aria-label='Next page'
                onClick={e => {
                  e.preventDefault()
                  setCurrentPage(p => Math.min(totalPages, p + 1))
                }}
                className='disabled:opacity-50'
              >
                <ChevronRight className='h-4 w-4' />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </UIPagination>
      </div>

      <AlertDialog open={confirmBookmarkOpen} onOpenChange={setConfirmBookmarkOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will add the job to your bookmarks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bookmarkLoadingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (confirmBookmarkJobId) {
                  await handleBookmark(confirmBookmarkJobId)
                }
                setConfirmBookmarkOpen(false)
              }}
              className='bg-amber-600 hover:bg-amber-700 text-white text-sm h-9 px-3'
              disabled={bookmarkLoadingId !== null}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ApplyJobModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        jobId={selectedJob?.id ?? null}
        jobTitle={selectedJob?.title}
        onSubmitted={() => {
          // Optionally refresh jobs or show a success state
        }}
      />
    </div>
  )
}

export default Jobs
