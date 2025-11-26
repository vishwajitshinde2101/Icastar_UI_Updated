import React, { useState } from 'react'
import Icon from '@/components/Icon'

type Tab = 'Account' | 'Notifications' | 'Privacy'

const SettingsTab: React.FC<{
  label: Tab
  activeTab: Tab
  onClick: (tab: Tab) => void
  icon: any
}> = ({ label, activeTab, onClick, icon }) => (
  <button
    onClick={() => onClick(label)}
    className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-t-xl transition-colors border-b-4 ${
      activeTab === label
        ? 'text-[#7C3AED] border-[#7C3AED]'
        : 'text-gray-500 border-transparent hover:text-[#7C3AED] hover:bg-purple-50'
    }`}>
    <Icon name={icon} size={20} />
    {label}
  </button>
)

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Account')

  const renderContent = () => {
    switch (activeTab) {
      case 'Account':
        return (
          <div className='p-8'>
            <h2 className='text-2xl font-bold'>Account Settings</h2>
            <p className='mt-2 text-gray-500'>
              Manage your public profile and account details.
            </p>
          </div>
        )
      case 'Notifications':
        return (
          <div className='p-8'>
            <h2 className='text-2xl font-bold'>Notification Settings</h2>
            <p className='mt-2 text-gray-500'>
              Choose how you want to be notified.
            </p>
          </div>
        )
      case 'Privacy':
        return (
          <div className='p-8'>
            <h2 className='text-2xl font-bold'>Privacy Settings</h2>
            <p className='mt-2 text-gray-500'>
              Control your privacy and data sharing options.
            </p>
          </div>
        )
    }
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-4xl font-bold'>Settings</h1>
      <p className='text-gray-600'>Customize your ArtistHub experience.</p>

      <div className='bg-white rounded-2xl shadow-lg'>
        <div className='flex border-b border-gray-200'>
          <SettingsTab
            label='Account'
            activeTab={activeTab}
            onClick={setActiveTab}
            icon='User'
          />
          <SettingsTab
            label='Notifications'
            activeTab={activeTab}
            onClick={setActiveTab}
            icon='Bell'
          />
          <SettingsTab
            label='Privacy'
            activeTab={activeTab}
            onClick={setActiveTab}
            icon='Shield'
          />
        </div>
        <div className='min-h-[40vh]'>{renderContent()}</div>
      </div>
    </div>
  )
}

export default Settings
