import React, { useState, useEffect } from 'react'
import FileUpload from '../FileUpload'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Badge } from '../ui/badge'
import { onboardingService } from '@/services/onboardingService'
import { ArtistCategory } from '@/types'

interface FormErrors {
  fullName?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  gender?: string
  city?: string
  category?: string
  languages?: string
  experienceYears?: string
  dateOfBirth?: string
  idProof?: string
  passport?: string
  aadharCard?: string
  panCard?: string
  faceVerification?: string
  consent?: string
  [key: string]: string | undefined
}

interface FormProps {
  formData: any
  updateFormData: (data: any) => void
  errors?: FormErrors
}

interface Category {
  id: string
  name: string
  displayName: string
  description: string
}

const CommonFields: React.FC<FormProps> = ({
  formData,
  updateFormData,
  errors = {} as FormErrors,
}) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categorySearchOpen, setCategorySearchOpen] = useState(false)
  const [categorySearchQuery, setCategorySearchQuery] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await onboardingService.getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId)
    if (selectedCategory) {
      updateFormData({
        artistTypeId: categoryId,
        category: selectedCategory.name as ArtistCategory
      })
      setCategorySearchOpen(false)
      setCategorySearchQuery('')
    }
  }

  const filteredCategories = categories.filter(category => {
    const searchLower = categorySearchQuery.toLowerCase()
    return (
      (category.displayName || category.name).toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower)
    )
  })

  const selectedCategory = categories.find(cat => cat.id === formData.artistTypeId)
  return (
    <div className='space-y-8'>
      {/* Artist Category Selection */}
      <div>
        <h3 className='text-xl font-bold border-b pb-2 mb-6'>
          Artist Category
        </h3>
        <div className='grid grid-cols-1 gap-6'>
          <div>
            <label htmlFor='category' className='block text-sm font-medium mb-2'>
              Select Your Artist Category <span className='text-red-500'>*</span>
            </label>
            <Popover open={categorySearchOpen} onOpenChange={setCategorySearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={categorySearchOpen}
                  disabled={loadingCategories}
                  className={`h-11 w-full justify-between px-3 ${errors.category ? 'border-red-500' : ''}`}>
                  {loadingCategories ? (
                    'Loading categories...'
                  ) : selectedCategory ? (
                    selectedCategory.displayName || selectedCategory.name
                  ) : (
                    'Select Artist Category'
                  )}
                  <span className='ml-2 text-gray-400'>▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0 bg-white' align='start'>
                <div className='p-3 border-b'>
                  <input
                    type='text'
                    placeholder='Search categories...'
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition'
                    autoFocus
                  />
                </div>
                <div className='max-h-64 overflow-y-auto'>
                  {filteredCategories.length === 0 ? (
                    <div className='p-4 text-center text-gray-500 text-sm'>
                      No categories found
                    </div>
                  ) : (
                    filteredCategories.map((category) => (
                      <button
                        key={category.id}
                        type='button'
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors ${
                          formData.artistTypeId === category.id ? 'bg-primary/10' : ''
                        }`}>
                        <div className='font-medium text-sm'>
                          {category.displayName || category.name}
                        </div>
                        <div className='text-xs text-gray-500 mt-1'>
                          {category.description}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            {errors.category && (
              <p className='text-red-500 text-sm mt-1'>{errors.category}</p>
            )}
            {selectedCategory && (
              <p className='text-sm text-gray-500 mt-2'>
                {selectedCategory.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Location & Demographics */}
      <div>
        <h3 className='text-xl font-bold border-b pb-2 mb-6'>
          Location & Demographics
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div>
            <label htmlFor='city' className='block text-sm font-medium mb-2'>City</label>
            <input
              id='city'
              type='text'
              placeholder='City'
              value={formData.city || ''}
              onChange={e => updateFormData({ city: e.target.value })}
              className='h-11 px-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:border-transparent transition'
            />
            {errors.city && (
              <p className='text-red-500 text-sm mt-1'>{errors.city}</p>
            )}
          </div>
          <div>
            <label htmlFor='gender' className='block text-sm font-medium mb-2'>Gender</label>
            <select
              id='gender'
              className='h-11 px-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition'
              value={formData.gender || ''}
              onChange={e => updateFormData({ gender: e.target.value })}>
              <option value=''>Select Gender</option>
              <option value='MALE'>Male</option>
              <option value='FEMALE'>Female</option>
              <option value='OTHER'>Other</option>
              <option value='PREFER_NOT_TO_SAY'>Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className='text-red-500 text-sm mt-1'>{errors.gender}</p>
            )}
          </div>

          <div>
            <label htmlFor='dateOfBirth' className='block text-sm font-medium mb-2'>Date of Birth</label>
            <input
              type='date'
              placeholder='Date of Birth'
              value={formData.dateOfBirth || ''}
              onChange={e => updateFormData({ dateOfBirth: e.target.value })}
              className='h-11 px-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:border-transparent transition'
            />
            {errors.dateOfBirth && (
              <p className='text-red-500 text-sm mt-1'>{errors.dateOfBirth}</p>
            )}
          </div>
        </div>
      </div>

      {/* Skills & Experience */}
      <div>
        <h3 className='text-xl font-bold border-b pb-2 mb-6'>
          Skills & Experience
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div>
            {(() => {
              const availableLanguages = [
                'English',
                'Hindi',
                'Marathi',
                'Tamil',
                'Telugu',
                'Kannada',
                'Malayalam',
                'Bengali',
                'Punjabi',
                'Gujarati',
                'Urdu',
                'Odia',
                'Assamese',
              ]
              const selectedLanguages: string[] = Array.isArray(
                formData.languages,
              )
                ? formData.languages
                : (formData.languages || '')
                    .split(',')
                    .map((s: string) => s.trim())
                    .filter(Boolean)

              return (
                <div>
                  <label className='block text-sm font-medium mb-2'>Languages Known</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className='h-11 w-full justify-between px-3'>
                        {selectedLanguages.length > 0
                          ? `${selectedLanguages.length} selected`
                          : 'Languages Known'}
                        <span className='ml-2 text-gray-400'>▾</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-64 p-3 space-y-2 bg-white'>
                      {availableLanguages.map(lang => {
                        const checked = selectedLanguages.includes(lang)
                        return (
                          <label key={lang} className='flex items-center gap-2'>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={val => {
                                const isChecked = Boolean(val)
                                const next = isChecked
                                  ? [...selectedLanguages, lang]
                                  : selectedLanguages.filter(l => l !== lang)
                                updateFormData({ languages: next })
                              }}
                            />
                            <span className='text-sm'>{lang}</span>
                          </label>
                        )
                      })}
                    </PopoverContent>
                  </Popover>
                  {selectedLanguages.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {selectedLanguages.map(lang => (
                        <Badge variant='secondary'>{lang}</Badge>
                      ))}
                    </div>
                  )}
                  {errors.languages && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.languages}
                    </p>
                  )}
                </div>
              )
            })()}
          </div>
          <div>
            <label htmlFor='experienceYears' className='block text-sm font-medium mb-2'>Years of Experience</label>
            <input
              id='experienceYears'
              type='number'
              placeholder='Years of Experience'
              min={0}
              max={80}
              value={formData.experienceYears || ''}
              onChange={e =>
                updateFormData({ experienceYears: e.target.value })
              }
              className='h-11 px-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:border-transparent transition'
            />
            {errors.experienceYears && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.experienceYears}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Verification & Legal removed per onboarding requirements */}
    </div>
  )
}

export default CommonFields
