import React from 'react'
import {
  UsersIcon,
  BriefcaseIcon,
  MicVocal,
  FileTextIcon,
  CreditCardIcon,
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '../../components/icons/IconComponents'

interface KPICard {
  title: string
  value: string | number
  change: number
  changeLabel: string
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  iconColor: string
}

interface ActivityItem {
  id: number
  type: 'recruiter' | 'artist' | 'job' | 'audition' | 'application' | 'report'
  message: string
  timestamp: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
}

export const AdminDashboardPage: React.FC = () => {
  // Mock data - replace with actual API calls
  const kpiData: KPICard[] = [
    {
      title: 'Total Recruiters',
      value: '1,234',
      change: 12.5,
      changeLabel: '+156 this month',
      icon: UsersIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#E36A3A]',
    },
    {
      title: 'Total Artists',
      value: '8,567',
      change: 8.3,
      changeLabel: '+712 this month',
      icon: MicVocal,
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#E36A3A]',
    },
    {
      title: 'Active Jobs',
      value: '432',
      change: -3.2,
      changeLabel: '64 posted today',
      icon: BriefcaseIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#E36A3A]',
    },
    {
      title: 'Open Auditions',
      value: '287',
      change: 15.7,
      changeLabel: '45 posted today',
      icon: MicVocal,
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#E36A3A]',
    },
    {
      title: 'Total Applications',
      value: '12,456',
      change: 22.4,
      changeLabel: '+2,791 this week',
      icon: FileTextIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#E36A3A]',
    },
    {
      title: 'Platform Revenue',
      value: '$127,580',
      change: 18.9,
      changeLabel: '+$23,450 this month',
      icon: CreditCardIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#E36A3A]',
    },
  ]

  const recentActivity: ActivityItem[] = [
    {
      id: 1,
      type: 'recruiter',
      message: 'Warner Bros Pictures registered as new recruiter',
      timestamp: '2 minutes ago',
      icon: UsersIcon,
      iconBg: 'bg-orange-100 text-[#E36A3A]',
    },
    {
      id: 2,
      type: 'audition',
      message: 'New audition created: "Lead Role - Action Thriller"',
      timestamp: '15 minutes ago',
      icon: MicVocal,
      iconBg: 'bg-orange-100 text-[#E36A3A]',
    },
    {
      id: 3,
      type: 'job',
      message: 'Job posted: "Senior Cinematographer - Feature Film"',
      timestamp: '1 hour ago',
      icon: BriefcaseIcon,
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      id: 4,
      type: 'application',
      message: '47 new applications received for "Broadway Musical Lead"',
      timestamp: '2 hours ago',
      icon: FileTextIcon,
      iconBg: 'bg-orange-100 text-[#E36A3A]',
    },
    {
      id: 5,
      type: 'report',
      message: 'Content reported: Inappropriate portfolio image',
      timestamp: '3 hours ago',
      icon: ChartBarIcon,
      iconBg: 'bg-red-100 text-red-600',
    },
    {
      id: 6,
      type: 'artist',
      message: 'Sarah Mitchell completed profile verification',
      timestamp: '4 hours ago',
      icon: MicVocal,
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      id: 7,
      type: 'recruiter',
      message: 'Netflix approved for premium recruiter tier',
      timestamp: '5 hours ago',
      icon: UsersIcon,
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      id: 8,
      type: 'job',
      message: 'Job closed: "Voice Actor - Animation Series" (23 applications)',
      timestamp: '6 hours ago',
      icon: BriefcaseIcon,
      iconBg: 'bg-gray-100 text-gray-600',
    },
  ]

  return (
    <div className='p-6 space-y-6'>
      {/* KPI Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {kpiData.map((kpi, index) => (
          <div key={index} className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-600 mb-1'>{kpi.title}</p>
                <h3 className='text-3xl font-bold text-gray-900 mb-2'>{kpi.value}</h3>
                <div className='flex items-center gap-2'>
                  <div className={`flex items-center gap-1 ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change >= 0 ? (
                      <TrendingUpIcon className='h-4 w-4' />
                    ) : (
                      <TrendingDownIcon className='h-4 w-4' />
                    )}
                    <span className='text-sm font-semibold'>{Math.abs(kpi.change)}%</span>
                  </div>
                  <span className='text-xs text-gray-500'>{kpi.changeLabel}</span>
                </div>
              </div>
              <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* User Growth Trend */}
        <div className='lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-bold text-gray-900'>User Growth Trend</h3>
              <p className='text-sm text-gray-500'>Last 6 months</p>
            </div>
            <div className='flex gap-4'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-[#E36A3A] rounded-full'></div>
                <span className='text-xs text-gray-600'>Recruiters</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-[#F6A57A] rounded-full'></div>
                <span className='text-xs text-gray-600'>Artists</span>
              </div>
            </div>
          </div>
          {/* Simplified line chart visualization */}
          <div className='h-64 flex items-end justify-between gap-2'>
            {[
              { recruiters: 60, artists: 75 },
              { recruiters: 65, artists: 80 },
              { recruiters: 72, artists: 85 },
              { recruiters: 78, artists: 88 },
              { recruiters: 85, artists: 92 },
              { recruiters: 95, artists: 98 },
            ].map((data, index) => (
              <div key={index} className='flex-1 flex flex-col items-center gap-2'>
                <div className='w-full flex flex-col gap-1'>
                  <div
                    className='w-full bg-gradient-to-t from-[#E36A3A] to-[#F6A57A] rounded-t-lg transition-all hover:opacity-80'
                    style={{ height: `${data.recruiters}%` }}></div>
                  <div
                    className='w-full bg-gradient-to-t from-[#F6A57A] to-orange-200 rounded-t-lg transition-all hover:opacity-80'
                    style={{ height: `${data.artists}%` }}></div>
                </div>
                <span className='text-xs text-gray-500'>
                  {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='mb-6'>
            <h3 className='text-lg font-bold text-gray-900'>Application Status</h3>
            <p className='text-sm text-gray-500'>Current distribution</p>
          </div>
          {/* Simplified donut chart */}
          <div className='flex items-center justify-center mb-6'>
            <div className='relative w-40 h-40'>
              <svg className='w-full h-full transform -rotate-90'>
                <circle cx='80' cy='80' r='70' fill='none' stroke='#e5e7eb' strokeWidth='20' />
                <circle
                  cx='80'
                  cy='80'
                  r='70'
                  fill='none'
                  stroke='#10b981'
                  strokeWidth='20'
                  strokeDasharray='439.8'
                  strokeDashoffset='110'
                />
                <circle
                  cx='80'
                  cy='80'
                  r='70'
                  fill='none'
                  stroke='#3b82f6'
                  strokeWidth='20'
                  strokeDasharray='439.8'
                  strokeDashoffset='220'
                />
                <circle
                  cx='80'
                  cy='80'
                  r='70'
                  fill='none'
                  stroke='#f59e0b'
                  strokeWidth='20'
                  strokeDasharray='439.8'
                  strokeDashoffset='330'
                />
              </svg>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-gray-900'>12.4K</p>
                  <p className='text-xs text-gray-500'>Total</p>
                </div>
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            {[
              { label: 'Under Review', value: '4,234', percentage: 34, color: 'bg-[#F6A57A]' },
              { label: 'Shortlisted', value: '3,127', percentage: 25, color: 'bg-[#E36A3A]' },
              { label: 'Interviewed', value: '2,456', percentage: 20, color: 'bg-green-600' },
              { label: 'Others', value: '2,639', percentage: 21, color: 'bg-gray-400' },
            ].map((status, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className={`w-3 h-3 ${status.color} rounded-full`}></div>
                  <span className='text-sm text-gray-700'>{status.label}</span>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-semibold text-gray-900'>{status.value}</p>
                  <p className='text-xs text-gray-500'>{status.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job vs Audition Activity & Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Job vs Audition Activity */}
        <div className='lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-bold text-gray-900'>Job vs Audition Activity</h3>
              <p className='text-sm text-gray-500'>Last 7 days</p>
            </div>
            <div className='flex gap-4'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-[#E36A3A] rounded-full'></div>
                <span className='text-xs text-gray-600'>Jobs</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-[#F6A57A] rounded-full'></div>
                <span className='text-xs text-gray-600'>Auditions</span>
              </div>
            </div>
          </div>
          {/* Bar chart */}
          <div className='h-64 flex items-end justify-between gap-4'>
            {[
              { jobs: 45, auditions: 32 },
              { jobs: 52, auditions: 38 },
              { jobs: 48, auditions: 45 },
              { jobs: 65, auditions: 50 },
              { jobs: 58, auditions: 48 },
              { jobs: 72, auditions: 55 },
              { jobs: 68, auditions: 62 },
            ].map((data, index) => (
              <div key={index} className='flex-1 flex flex-col items-center gap-2'>
                <div className='w-full flex gap-1 items-end h-48'>
                  <div
                    className='flex-1 bg-gradient-to-t from-[#E36A3A] to-[#F6A57A] rounded-t-lg hover:opacity-80 transition-all'
                    style={{ height: `${data.jobs}%` }}
                    title={`Jobs: ${data.jobs}`}></div>
                  <div
                    className='flex-1 bg-gradient-to-t from-[#F6A57A] to-orange-200 rounded-t-lg hover:opacity-80 transition-all'
                    style={{ height: `${data.auditions}%` }}
                    title={`Auditions: ${data.auditions}`}></div>
                </div>
                <span className='text-xs text-gray-500'>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='mb-4'>
            <h3 className='text-lg font-bold text-gray-900'>Recent Activity</h3>
            <p className='text-sm text-gray-500'>Latest platform events</p>
          </div>
          <div className='space-y-4 max-h-80 overflow-y-auto'>
            {recentActivity.map((activity) => (
              <div key={activity.id} className='flex gap-3'>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center`}>
                  <activity.icon className='h-4 w-4' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm text-gray-900 leading-tight mb-1'>{activity.message}</p>
                  <p className='text-xs text-gray-500'>{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <button className='w-full mt-4 px-4 py-2 text-sm font-medium text-[#E36A3A] hover:bg-orange-50 rounded-lg transition-colors border border-[#E36A3A]'>
            View All Activity
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {[
          { label: 'Pending Job Approvals', value: '8', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Pending Audition Approvals', value: '5', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Reported Content', value: '3', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Active Interviews', value: '127', color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, index) => (
          <div key={index} className={`${stat.bg} rounded-lg p-4 border border-gray-200`}>
            <p className='text-sm font-medium text-gray-600 mb-1'>{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboardPage
