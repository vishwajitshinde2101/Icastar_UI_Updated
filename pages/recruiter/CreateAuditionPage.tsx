import React, { useState } from 'react'
import { Card } from '../../components/Card'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import auditionService from '../../services/auditionService'
import {
  AuditionRoleType,
  AuditionProjectType,
  GenderPreference,
  ExperienceLevel,
  AuditionMode,
  CompensationType,
  AuditionVisibility,
  ArtistCategory,
  CreateAuditionDto,
} from '../../types'
import { CalendarIcon, MapPinIcon, BriefcaseIcon } from '../../components/icons/IconComponents'

export const CreateAuditionPage: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState<CreateAuditionDto>({
    title: '',
    roleType: 'Actor',
    projectType: 'Movie',
    description: '',
    ageRangeMin: undefined,
    ageRangeMax: undefined,
    gender: 'Any',
    languages: [],
    skills: [],
    category: ArtistCategory.Actor,
    experienceLevel: 'Any',
    auditionMode: 'Online',
    location: '',
    auditionDate: '',
    auditionTime: '',
    submissionDeadline: '',
    compensationType: 'Paid',
    budgetMin: undefined,
    budgetMax: undefined,
    currency: 'USD',
    visibility: 'Public',
    invitedArtistIds: [],
    categoryFilter: [],
    isPublished: false,
  })

  const [languageInput, setLanguageInput] = useState('')
  const [skillInput, setSkillInput] = useState('')

  // Handle input changes
  const handleInputChange = (field: keyof CreateAuditionDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Add language tag
  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()],
      }))
      setLanguageInput('')
    }
  }

  // Remove language tag
  const removeLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }))
  }

  // Add skill tag
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput('')
    }
  }

  // Remove skill tag
  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  // Save as draft
  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true)
      const draftData = { ...formData, isPublished: false }
      await auditionService.createAudition(draftData)
      toast.success('Audition saved as draft!')
      navigate('/recruiter/auditions')
    } catch (error: any) {
      console.error('Failed to save draft:', error)
      toast.error(error.response?.data?.message || 'Failed to save draft')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Publish audition
  const handlePublish = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter an audition title')
      return
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description')
      return
    }
    if (!formData.submissionDeadline) {
      toast.error('Please set a submission deadline')
      return
    }

    try {
      setIsSubmitting(true)
      const publishData = { ...formData, isPublished: true }
      await auditionService.createAudition(publishData)
      toast.success('Audition published successfully!')
      navigate('/recruiter/auditions')
    } catch (error: any) {
      console.error('Failed to publish audition:', error)
      toast.error(error.response?.data?.message || 'Failed to publish audition')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-6 p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Create New Audition</h1>
          <p className='text-sm text-gray-600 mt-1'>Post an audition and find the perfect talent for your project</p>
        </div>
        <button
          onClick={() => navigate('/recruiter/auditions')}
          className='px-4 py-2 text-gray-600 hover:text-gray-900 font-medium'>
          Cancel
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Form */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Basic Details */}
          <Card>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Basic Details</h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Audition Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder='e.g., Lead Actor for Action Thriller'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Role Type</label>
                  <select
                    value={formData.roleType}
                    onChange={(e) => handleInputChange('roleType', e.target.value as AuditionRoleType)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                    <option value='Actor'>Actor</option>
                    <option value='Singer'>Singer</option>
                    <option value='Dancer'>Dancer</option>
                    <option value='Voice Artist'>Voice Artist</option>
                    <option value='Model'>Model</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value as AuditionProjectType)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                    <option value='Movie'>Movie</option>
                    <option value='Ad Campaign'>Ad Campaign</option>
                    <option value='Web Series'>Web Series</option>
                    <option value='TV Show'>TV Show</option>
                    <option value='Event'>Event</option>
                    <option value='Music Video'>Music Video</option>
                    <option value='Theatre'>Theatre</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, project details, and what you are looking for..."
                  rows={5}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
              </div>
            </div>
          </Card>

          {/* Requirements */}
          <Card>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Requirements</h3>

            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Age Range (Min)</label>
                  <input
                    type='number'
                    value={formData.ageRangeMin || ''}
                    onChange={(e) => handleInputChange('ageRangeMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder='18'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Age Range (Max)</label>
                  <input
                    type='number'
                    value={formData.ageRangeMax || ''}
                    onChange={(e) => handleInputChange('ageRangeMax', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder='35'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value as GenderPreference)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                    <option value='Any'>Any</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Non-Binary'>Non-Binary</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value as ExperienceLevel)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                    <option value='Any'>Any</option>
                    <option value='Beginner'>Beginner</option>
                    <option value='Intermediate'>Intermediate</option>
                    <option value='Expert'>Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value as ArtistCategory)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                  {Object.values(ArtistCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Languages</label>
                <div className='flex gap-2 mb-2'>
                  <input
                    type='text'
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                    placeholder='Add language (e.g., English, Hindi)'
                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  />
                  <button
                    type='button'
                    onClick={addLanguage}
                    className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700'>
                    Add
                  </button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {formData.languages.map((lang) => (
                    <span
                      key={lang}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm'>
                      {lang}
                      <button type='button' onClick={() => removeLanguage(lang)} className='hover:text-purple-900'>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Skills</label>
                <div className='flex gap-2 mb-2'>
                  <input
                    type='text'
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder='Add skill (e.g., Acting, Singing)'
                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  />
                  <button
                    type='button'
                    onClick={addSkill}
                    className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700'>
                    Add
                  </button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm'>
                      {skill}
                      <button type='button' onClick={() => removeSkill(skill)} className='hover:text-indigo-900'>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Audition Info */}
          <Card>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Audition Information</h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Audition Mode</label>
                <select
                  value={formData.auditionMode}
                  onChange={(e) => handleInputChange('auditionMode', e.target.value as AuditionMode)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                  <option value='Online'>Online</option>
                  <option value='In-Person'>In-Person</option>
                  <option value='Hybrid'>Hybrid</option>
                </select>
              </div>

              {(formData.auditionMode === 'In-Person' || formData.auditionMode === 'Hybrid') && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    <MapPinIcon className='inline h-4 w-4 mr-1' />
                    Location
                  </label>
                  <input
                    type='text'
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder='e.g., Mumbai, Maharashtra'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  />
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    <CalendarIcon className='inline h-4 w-4 mr-1' />
                    Audition Date
                  </label>
                  <input
                    type='date'
                    value={formData.auditionDate}
                    onChange={(e) => handleInputChange('auditionDate', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Audition Time</label>
                  <input
                    type='time'
                    value={formData.auditionTime}
                    onChange={(e) => handleInputChange('auditionTime', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Submission Deadline <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.submissionDeadline}
                  onChange={(e) => handleInputChange('submissionDeadline', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
              </div>
            </div>
          </Card>

          {/* Compensation */}
          <Card>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Compensation</h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Compensation Type</label>
                <select
                  value={formData.compensationType}
                  onChange={(e) => handleInputChange('compensationType', e.target.value as CompensationType)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                  <option value='Paid'>Paid</option>
                  <option value='Unpaid'>Unpaid</option>
                  <option value='Negotiable'>Negotiable</option>
                </select>
              </div>

              {formData.compensationType === 'Paid' && (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Budget Min</label>
                    <input
                      type='number'
                      value={formData.budgetMin || ''}
                      onChange={(e) => handleInputChange('budgetMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder='10000'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Budget Max</label>
                    <input
                      type='number'
                      value={formData.budgetMax || ''}
                      onChange={(e) => handleInputChange('budgetMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder='50000'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                      <option value='USD'>USD</option>
                      <option value='INR'>INR</option>
                      <option value='EUR'>EUR</option>
                      <option value='GBP'>GBP</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Visibility Settings */}
          <Card>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Visibility & Publish</h3>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Visibility</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => handleInputChange('visibility', e.target.value as AuditionVisibility)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                  <option value='Public'>Open to All Artists</option>
                  <option value='Category Based'>Category Based</option>
                  <option value='Invited Only'>Invited Only</option>
                </select>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <p className='text-sm text-blue-800'>
                  <BriefcaseIcon className='inline h-4 w-4 mr-1' />
                  {formData.visibility === 'Public' && 'This audition will be visible to all artists on the platform.'}
                  {formData.visibility === 'Category Based' &&
                    'This audition will only be shown to artists matching the selected category.'}
                  {formData.visibility === 'Invited Only' && 'Only invited artists will be able to see and apply to this audition.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Actions</h3>

            <div className='space-y-3'>
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className='w-full px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'>
                {isSubmitting ? 'Publishing...' : 'Publish Audition'}
              </button>

              <button
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className='w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'>
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>

              <button
                onClick={() => navigate('/recruiter/auditions')}
                className='w-full px-4 py-3 text-gray-600 hover:text-gray-900 font-medium'>
                Cancel
              </button>
            </div>
          </Card>

          {/* Help Card */}
          <Card className='bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'>
            <h3 className='text-sm font-semibold text-purple-900 mb-2'>💡 Tips for Great Auditions</h3>
            <ul className='text-xs text-purple-800 space-y-2'>
              <li>• Be specific about the role requirements</li>
              <li>• Add clear submission deadlines</li>
              <li>• Provide detailed project information</li>
              <li>• Set realistic budget expectations</li>
              <li>• Respond to applications promptly</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CreateAuditionPage
