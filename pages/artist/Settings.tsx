import React, { useState, useEffect } from 'react'
import Icon from '@/components/Icon'
import { toast } from 'react-toastify'
import artistService from '@/services/artistService'
import api from '@/services/apiClient'

type Tab = 'Account' | 'Notifications' | 'Privacy'

const SettingsTab: React.FC<{
  label: Tab
  activeTab: Tab
  onClick: (tab: Tab) => void
  icon: string
}> = ({ label, activeTab, onClick, icon }) => (
  <button
    onClick={() => onClick(label)}
    className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-t-xl transition-colors border-b-4 ${activeTab === label
      ? 'text-[#7C3AED] border-[#7C3AED]'
      : 'text-gray-500 border-transparent hover:text-[#7C3AED] hover:bg-purple-50'
      }`}>
    <Icon name={icon} size={20} />
    {label}
  </button>
)

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Account')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
    languages: '',
  })

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await artistService.getMyProfile()
        if (data) {
          setProfile(data)
          setFormData({
            fullName: data.fullName || data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            city: data.city || '',
            bio: data.bio || '',
            languages: Array.isArray(data.languages)
              ? data.languages.join(', ')
              : data.languages || '',
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required'
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required'
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters'
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password'
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (passwordForm.currentPassword === passwordForm.newPassword && passwordForm.newPassword) {
      errors.newPassword = 'New password must be different from current password'
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return

    setIsChangingPassword(true)
    try {
      const response = await api.post('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      })

      if (response.data?.success) {
        toast.success(response.data.message || 'Password changed successfully')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password'
      toast.error(errorMessage)

      // Set specific field errors based on API response
      if (errorMessage.toLowerCase().includes('current password')) {
        setPasswordErrors(prev => ({ ...prev, currentPassword: errorMessage }))
      } else if (errorMessage.toLowerCase().includes('do not match')) {
        setPasswordErrors(prev => ({ ...prev, confirmPassword: errorMessage }))
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const payload = {
        ...formData,
        languages: formData.languages.split(',').map(l => l.trim()),
      }
      await artistService.updateMyProfile(payload)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Account':
        return (
          <div className='p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Account Settings</h2>
            <p className='text-gray-600 mb-8'>
              Manage your public profile and account details.
            </p>

            <div className='space-y-6 max-w-2xl'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Full Name
                </label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all'
                  placeholder='Enter your full name'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all'
                  placeholder='Enter your email'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Phone
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all'
                  placeholder='Enter your phone number'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  City
                </label>
                <input
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all'
                  placeholder='Enter your city'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Languages (comma-separated)
                </label>
                <input
                  type='text'
                  name='languages'
                  value={formData.languages}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all'
                  placeholder='e.g., English, Hindi, Tamil'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Bio
                </label>
                <textarea
                  name='bio'
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none'
                  placeholder='Tell us about yourself...'
                />
              </div>

              <div className='flex gap-4 pt-4'>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className='bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    if (profile) {
                      setFormData({
                        fullName: profile.fullName || profile.name || '',
                        email: profile.email || '',
                        phone: profile.phone || '',
                        city: profile.city || '',
                        bio: profile.bio || '',
                        languages: Array.isArray(profile.languages)
                          ? profile.languages.join(', ')
                          : profile.languages || '',
                      })
                    }
                  }}
                  className='bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-colors'
                >
                  Cancel
                </button>
              </div>

              {/* Change Password Section */}
              <div className='mt-12 pt-8 border-t border-gray-200'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Change Password</h3>
                <p className='text-gray-600 mb-6'>
                  For your security, we recommend using a strong password that you're not using anywhere else.
                </p>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Current Password
                    </label>
                    <input
                      type='password'
                      name='currentPassword'
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${passwordErrors.currentPassword
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      placeholder='Enter current password'
                    />
                    {passwordErrors.currentPassword && (
                      <p className='mt-1 text-sm text-red-600'>{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        New Password
                      </label>
                      <input
                        type='password'
                        name='newPassword'
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${passwordErrors.newPassword
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-amber-500'
                          }`}
                        placeholder='Enter new password'
                      />
                      {passwordErrors.newPassword && (
                        <p className='mt-1 text-sm text-red-600'>{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Confirm New Password
                      </label>
                      <input
                        type='password'
                        name='confirmPassword'
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${passwordErrors.confirmPassword
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-amber-500'
                          }`}
                        placeholder='Confirm new password'
                      />
                      {passwordErrors.confirmPassword && (
                        <p className='mt-1 text-sm text-red-600'>{passwordErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className='pt-2'>
                    <button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className='bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
