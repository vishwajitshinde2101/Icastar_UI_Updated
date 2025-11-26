import React from 'react'
import Icon from '@/components/Icon'

const RequirementItem: React.FC<{
  icon: any
  title: string
  description: string
}> = ({ icon, title, description }) => (
  <div className='flex items-start gap-4'>
    <div className='flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-violet-100 text-[#7C3AED]'>
      <Icon name={icon} size={24} />
    </div>
    <div>
      <h3 className='font-bold text-lg'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </div>
  </div>
)

const VerifiedBadge: React.FC = () => {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-white rounded-2xl shadow-lg p-10 text-center'>
        <div className='inline-block bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] p-4 rounded-full shadow-lg'>
          <Icon name='BadgeCheck' size={48} className='text-white' />
        </div>
        <h1 className='text-4xl font-bold mt-6'>
          Stand Out with the Verified Artist Badge
        </h1>
        <p className='text-gray-600 mt-2 max-w-2xl mx-auto'>
          The verified badge lets recruiters know you're an authentic and
          established artist, increasing your chances of getting hired.
        </p>
      </div>

      <div className='bg-white rounded-2xl shadow-lg p-10 mt-8'>
        <h2 className='text-2xl font-bold mb-6'>
          Requirements for Verification
        </h2>
        <div className='space-y-6'>
          <RequirementItem
            icon='UserCheck'
            title='ID Proof'
            description='Submit a government-issued ID for identity verification.'
          />
          <RequirementItem
            icon='FolderKanban'
            title='Strong Portfolio'
            description='Your portfolio must showcase at least 5 high-quality projects.'
          />
          <RequirementItem
            icon='Star'
            title='Profile Completion'
            description='Ensure your profile is at least 90% complete with all necessary details.'
          />
        </div>
        <div className='mt-10 pt-6 border-t border-gray-200 text-center'>
          <button className='bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] text-white font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg'>
            Apply for Verification
          </button>
          <p className='text-sm text-gray-500 mt-3'>
            Application review takes 3-5 business days.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifiedBadge
