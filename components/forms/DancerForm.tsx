import React from 'react'
import FileUpload from '../FileUpload'

export enum ArtistCategory {}

export interface DancerFormData {
  category: ArtistCategory | null
  dancerBio: string
  danceStyles: string[]
  experienceYears: string
  danceVideo?: string | File
  profilePhoto?: string | File
  [key: string]: any
}

interface FormErrors {
  dancerBio?: string
  danceStyles?: string
  experienceYears?: string
  [key: string]: string | undefined
}

interface FormProps {
  formData: DancerFormData
  updateFormData: (data: Partial<DancerFormData>) => void
  errors?: FormErrors
}

const DancerForm: React.FC<FormProps> = ({
  formData = {
    category: null,
    dancerBio: '',
    danceStyles: [],
    experienceYears: '',
  },
  updateFormData,
  errors = {} as FormErrors,
}) => {
  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-bold border-b pb-2 text-gray-800'>
        Dancer & Choreographer Details
      </h3>
      <div>
        <label className='block text-sm font-medium text-gray-600 mb-1.5'>
          Dance Styles
        </label>
        <div className='flex flex-wrap gap-2'>
          {[
            'Hip Hop',
            'Contemporary',
            'Bollywood',
            'Bharatanatyam',
            'Kathak',
            'Belly Dance',
            'Salsa',
            'Other',
          ].map(style => (
            <label key={style} className='flex items-center space-x-1'>
              <input
                type='checkbox'
                checked={formData.danceStyles?.includes(style) || false}
                onChange={e => {
                  const styles = formData.danceStyles || []
                  if (e.target.checked) {
                    updateFormData({ danceStyles: [...styles, style] })
                  } else {
                    updateFormData({
                      danceStyles: styles.filter((s: string) => s !== style),
                    })
                  }
                }}
                className='rounded text-primary focus:ring-primary'
              />
              <span>{style}</span>
            </label>
          ))}
        </div>
        {errors.danceStyles && (
          <p className='text-red-500 text-sm mt-1'>{errors.danceStyles}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='experience'
          className='block text-sm font-medium text-gray-700'>
          Years of Experience
        </label>
        <input
          type='number'
          id='experience'
          min='0'
          max='80'
          value={formData.experienceYears || ''}
          onChange={e => updateFormData({ experienceYears: e.target.value })}
          className='w-1/3 p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition'
        />
        {errors.experienceYears && (
          <p className='text-red-500 text-sm mt-1'>{errors.experienceYears}</p>
        )}
      </div>

      <FileUpload
        label='Dance Video (Max 2 minutes)'
        onFilesUploaded={files => updateFormData({ danceVideo: files[0] })}
        accept='video/*'
      />
      <FileUpload
        label='Profile Photo'
        onFilesUploaded={files => updateFormData({ profilePhoto: files[0] })}
        accept='image/*'
      />
    </div>
  )
}

export default DancerForm
