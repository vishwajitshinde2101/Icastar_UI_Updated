import React from 'react'
import Icon from './Icon'

interface StepperProps {
  currentStep: number
}

const steps = [
  { number: 1, title: 'Category' },
  { number: 2, title: 'Profile Details' },
]

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className='w-full max-w-2xl mx-auto px-4'>
      <div className='flex items-center'>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className='flex flex-col items-center text-center w-20'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-lg ${
                  currentStep >= step.number
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                {currentStep > step.number ? (
                  <Icon name='Check' size={24} />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <p
                className={`mt-2 font-semibold text-xs sm:text-sm ${
                  currentStep >= step.number
                    ? 'text-primary'
                    : 'text-gray-400'
                }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 transition-all duration-500 ${
                  currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default Stepper
