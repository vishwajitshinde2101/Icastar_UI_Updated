import React, { useState } from 'react'
import { Card } from '../../components/Card'
import { useNavigate } from 'react-router-dom'

interface InputFieldProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  autoComplete?: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  autoComplete = 'off',
}) => (
  <div>
    <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
      {label}
    </label>
    <input
      type={type}
      name={id}
      id={id}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className='mt-1 block w-full rounded-lg border-gray-300 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5'
    />
  </div>
)

const ToggleSwitch = ({ label, enabled, setEnabled, description }) => (
  <div className='flex items-center justify-between'>
    <div>
      <span className='text-sm font-medium text-gray-900'>{label}</span>
      <p className='text-sm text-gray-500'>{description}</p>
    </div>
    <button
      type='button'
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        enabled ? 'bg-primary' : 'bg-gray-200'
      }`}
      onClick={() => setEnabled(!enabled)}>
      <span
        aria-hidden='true'
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
)

export const SettingsPage = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState({
    newApplicants: true,
    messages: true,
    weeklySummary: false,
  })

  const handleSave = () => {
    alert('Settings saved successfully!')
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-3xl font-bold text-gray-900 mb-6'>Settings</h2>

      <div className='space-y-8'>
        <Card>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            Change Password
          </h3>
          <p className='text-sm text-gray-500 mb-6'>
            For your security, we recommend using a strong password that you're
            not using anywhere else.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <InputField
              label='Current Password'
              id='currentPassword'
              type='password'
              value=''
              onChange={() => {}}
              autoComplete='current-password'
            />
            <div></div>
            <InputField
              label='New Password'
              id='newPassword'
              type='password'
              value=''
              onChange={() => {}}
              autoComplete='new-password'
            />
            <InputField
              label='Confirm New Password'
              id='confirmPassword'
              type='password'
              value=''
              onChange={() => {}}
              autoComplete='new-password'
            />
            <div className='sm:col-span-2 text-right'>
              <button className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
                Update Password
              </button>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            Email Notifications
          </h3>
          <p className='text-sm text-gray-500 mb-6'>
            Manage how you receive notifications to your email address.
          </p>
          <div className='space-y-6'>
            <ToggleSwitch
              label='New Applicants'
              description='When a new candidate applies to one of your jobs.'
              enabled={notifications.newApplicants}
              setEnabled={val =>
                setNotifications(p => ({ ...p, newApplicants: val }))
              }
            />
            <ToggleSwitch
              label='Direct Messages'
              description='For new chat messages from artists.'
              enabled={notifications.messages}
              setEnabled={val =>
                setNotifications(p => ({ ...p, messages: val }))
              }
            />
            <ToggleSwitch
              label='Weekly Summary'
              description='A weekly report of your job performance and applicants.'
              enabled={notifications.weeklySummary}
              setEnabled={val =>
                setNotifications(p => ({ ...p, weeklySummary: val }))
              }
            />
          </div>
        </Card>
      </div>

      <div className='mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3'>
        <button
          onClick={handleCancel}
          className='px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors'>
          Cancel
        </button>
        <button
          onClick={handleSave}
          className='inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
          Save Settings
        </button>
      </div>
    </div>
  )
}
