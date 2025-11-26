import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import applicationsService, { ApplicationRequest } from '@/services/applicationsService'
import { toast } from 'react-toastify'

interface ApplyJobModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobId: number | null
  jobTitle?: string
  onSubmitted?: () => void
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  onSubmitted,
}) => {
  const [coverLetter, setCoverLetter] = useState('')
  const [expectedSalary, setExpectedSalary] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const salaryNum = Number(expectedSalary)
  const canSubmit = !!jobId && coverLetter.trim().length > 0 && !Number.isNaN(salaryNum) && salaryNum > 0

  const handleSubmit = async () => {
    if (!jobId) return

    // Basic client-side validation before submitting
    const trimmedCover = coverLetter.trim()
    const salary = Number(expectedSalary)
    if (trimmedCover.length < 10) {
      const msg = 'Please write at least 10 characters in your cover letter.'
      setError(msg)
      toast.error(msg)
      return
    }
    if (Number.isNaN(salary) || salary <= 0) {
      const msg = 'Please enter a valid expected salary greater than 0.'
      setError(msg)
      toast.error(msg)
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      const payload: ApplicationRequest = {
        coverLetter: trimmedCover,
        jobId: jobId,
        expectedSalary: salary,
      }
      await applicationsService.createApplication(payload)
      onOpenChange(false)
      setCoverLetter('')
      setExpectedSalary('')
      toast.success(`Applied to ${jobTitle || 'job'} successfully`)
      if (onSubmitted) onSubmitted()
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error
      const message = backendMessage || err?.message || 'Failed to submit application'
      setError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] bg-white'>
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle || 'Job'}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className='text-red-600 text-sm mb-2'>{error}</div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Cover Letter</label>
            <Textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder='Write a brief cover letter...'
              rows={5}
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Expected Salary</label>
            <Input
              type='number'
              step='0.01'
              value={expectedSalary}
              onChange={e => setExpectedSalary(e.target.value)}
              placeholder='e.g., 7530.12'
            />
          </div>
        </div>

        <DialogFooter className='mt-4'>
          <Button variant='secondary' onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? 'Submitting...' : 'Apply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApplyJobModal