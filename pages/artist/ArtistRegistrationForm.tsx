import React, { useState } from 'react'
import { ArtistCategory } from '@/types'
import Step1_CategorySelect from './Step1_CategorySelect'
import Step2_ProfileForm from './Step2_ProfileForm'
import Stepper from '@/components/Stepper'
import logo from '../../assets/icaster.png'

const ArtistRegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<{
    category: ArtistCategory | null
    artistTypeId: string | null
    [key: string]: any
  }>({
    category: null,
    artistTypeId: null,
  })

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  return (
    <div className='min-h-screen bg-base-bg text-gray-800 p-4 sm:p-8'>
      <div className='max-w-6xl mx-auto'>
        <header className='text-center mb-2'>
          <div className='flex justify-center py-1'>
            <img
              src={logo}
              alt='iCaster'
              className='h-16 md:h-22 w-auto object-contain'
            />
          </div>
          <p className='text-primary'>Be a Findix - Artist Onboarding</p>
        </header>
        <Stepper currentStep={step} />
        <div className='mt-8'>
          {step === 1 && (
            <Step1_CategorySelect
              onNext={nextStep}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 2 && (
            <Step2_ProfileForm
              onNext={nextStep}
              onBack={prevStep}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistRegistrationForm
