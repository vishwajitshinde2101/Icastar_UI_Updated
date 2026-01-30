import React, { useState, useEffect } from 'react'
import { Card } from '../../components/Card'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import {
  EyeIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  CalendarIcon,
  TrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  UsersIcon,
} from '../../components/icons/IconComponents'
import artistDashboardService from '../../services/artistDashboardService'
import { toast } from 'react-toastify'

export const ArtistDashboard = () => {
  const navigate = useNavigate()

  // State management
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90'>('30')
  const [kpiData, setKpiData] = useState<any[]>([])
  const [profileViewsTrendData, setProfileViewsTrendData] = useState<any[]>([])
  const [applicationStatusData, setApplicationStatusData] = useState<any[]>([])
  const [earningsTrendData, setEarningsTrendData] = useState<any[]>([])
  const [jobOpportunities, setJobOpportunities] = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [profileCompletion, setProfileCompletion] = useState(0)

  // Fetch all dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [metrics, profileViews, appStatus, earnings, jobs, activities, portfolio, completion] = await Promise.all([
          artistDashboardService.getDashboardMetrics(),
          artistDashboardService.getProfileViewsTrend(timeFilter),
          artistDashboardService.getApplicationStatus(),
          artistDashboardService.getEarningsTrend(timeFilter),
          artistDashboardService.getJobOpportunities(4),
          artistDashboardService.getRecentActivity(4),
          artistDashboardService.getPortfolio(4, 'popular'),
          artistDashboardService.getProfileCompletion()
        ])

        // Transform metrics to KPI cards format with null safety
        const transformedKpis = [
          {
            name: 'Profile Views',
            value: (metrics?.profileViews?.value || 0).toLocaleString(),
            change: metrics?.profileViews?.change || '0%',
            changeType: metrics?.profileViews?.changeType || 'increase',
            icon: EyeIcon,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
          },
          {
            name: 'Job Invitations',
            value: (metrics?.jobInvitations?.value || 0).toString(),
            change: metrics?.jobInvitations?.change || '0%',
            changeType: metrics?.jobInvitations?.changeType || 'increase',
            icon: BriefcaseIcon,
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
          },
          {
            name: 'Applications Sent',
            value: (metrics?.applicationsSent?.value || 0).toString(),
            change: metrics?.applicationsSent?.change || '0%',
            changeType: metrics?.applicationsSent?.changeType || 'increase',
            icon: UsersIcon,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
          },
          {
            name: 'Interviews Scheduled',
            value: (metrics?.interviewsScheduled?.value || 0).toString(),
            change: metrics?.interviewsScheduled?.change || '0%',
            changeType: metrics?.interviewsScheduled?.changeType || 'increase',
            icon: CalendarIcon,
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
          },
          {
            name: 'Projects Completed',
            value: (metrics?.projectsCompleted?.value || 0).toString(),
            change: metrics?.projectsCompleted?.change || '0%',
            changeType: metrics?.projectsCompleted?.changeType || 'increase',
            icon: CheckCircleIcon,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
          },
          {
            name: 'Credits Balance',
            value: `$${(metrics?.creditsBalance?.value || 0).toLocaleString()}`,
            change: metrics?.creditsBalance?.change || '0%',
            changeType: metrics?.creditsBalance?.changeType || 'increase',
            icon: TrendingUpIcon,
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
          },
        ]
        setKpiData(transformedKpis)

        // Set profile views trend data with fallback
        setProfileViewsTrendData(profileViews?.trend || [])

        // Set application status data with fallback
        setApplicationStatusData(appStatus?.statusBreakdown || [])

        // Set earnings trend data with fallback
        setEarningsTrendData(earnings?.trend || [])

        // Set job opportunities with fallback
        setJobOpportunities(Array.isArray(jobs) ? jobs : [])

        // Transform and set recent activities with fallback
        const activitiesArray = Array.isArray(activities) ? activities : []
        const transformedActivities = activitiesArray.map(activity => {
          let icon = BriefcaseIcon
          let color = 'text-purple-600'
          let bgColor = 'bg-purple-50'

          switch (activity.type) {
            case 'application':
              icon = BriefcaseIcon
              color = 'text-purple-600'
              bgColor = 'bg-purple-50'
              break
            case 'interview':
              icon = CalendarIcon
              color = 'text-amber-600'
              bgColor = 'bg-amber-50'
              break
            case 'profile_view':
              icon = EyeIcon
              color = 'text-indigo-600'
              bgColor = 'bg-indigo-50'
              break
            case 'project_completed':
              icon = CheckCircleIcon
              color = 'text-green-600'
              bgColor = 'bg-green-50'
              break
          }

          return {
            ...activity,
            icon,
            color,
            bgColor,
            timestamp: activity.relativeTime
          }
        })
        setRecentActivities(transformedActivities)

        // Set portfolio items with fallback
        setPortfolioItems(Array.isArray(portfolio) ? portfolio : [])

        // Set profile completion percentage with fallback
        setProfileCompletion(completion?.completionPercentage || 0)

      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error)
        console.error('Error details:', error.response?.data || error.message)

        // Set safe defaults for all state variables
        setKpiData([])
        setProfileViewsTrendData([])
        setApplicationStatusData([])
        setEarningsTrendData([])
        setJobOpportunities([])
        setRecentActivities([])
        setPortfolioItems([])
        setProfileCompletion(0)

        toast.error('Failed to load dashboard data. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [timeFilter])

  const quickActions = [
    {
      title: 'Update Portfolio',
      description: 'Add new artworks',
      icon: PlusIcon,
      bgColor: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      action: () => navigate('/profile'),
    },
    {
      title: 'Browse Jobs',
      description: 'Explore opportunities',
      icon: BriefcaseIcon,
      bgColor: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700',
      action: () => navigate('/jobs'),
    },
    {
      title: 'My Applications',
      description: 'Track your applications',
      icon: UsersIcon,
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      action: () => navigate('/applications'),
    },
    {
      title: 'Complete Profile',
      description: `${profileCompletion}% completed`,
      icon: CheckCircleIcon,
      bgColor: 'bg-amber-600',
      hoverColor: 'hover:bg-amber-700',
      action: () => navigate('/profile'),
    },
  ]

  const getMatchScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent Match', color: 'bg-green-100 text-green-800' }
    if (score >= 80) return { text: 'Great Match', color: 'bg-blue-100 text-blue-800' }
    if (score >= 70) return { text: 'Good Match', color: 'bg-purple-100 text-purple-800' }
    return { text: 'Fair Match', color: 'bg-gray-100 text-gray-800' }
  }

  // Show loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600 text-lg'>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50 min-h-screen p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Artist Dashboard</h1>
          <p className='text-sm text-gray-600 mt-1'>Track your creative journey and opportunities</p>
        </div>
        <div className='text-sm text-gray-500'>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards - 6 Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
        {(kpiData || []).map((kpi) => {
          const Icon = kpi.icon
          const isIncrease = kpi.changeType === 'increase'

          return (
            <Card key={kpi.name} className='hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <p className='text-xs font-medium text-gray-600 uppercase tracking-wide'>{kpi.name}</p>
                  <div className='mt-2 flex items-baseline gap-2'>
                    <p className='text-2xl font-bold text-gray-900'>{kpi.value}</p>
                  </div>
                  <div className={`flex items-center text-xs font-semibold mt-1 ${isIncrease ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {isIncrease ? (
                      <ArrowUpIcon className='h-3 w-3 mr-0.5' />
                    ) : (
                      <ArrowDownIcon className='h-3 w-3 mr-0.5' />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <div className={`${kpi.bgColor} p-2.5 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions Panel */}
      <Card className='bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-white'>Quick Actions</h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {(quickActions || []).map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.title}
                onClick={action.action}
                className='bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white rounded-xl p-5 text-left transition-all duration-200 hover:scale-105 hover:shadow-lg group border border-white border-opacity-20'>
                <div className='flex items-start gap-3'>
                  <div className='bg-white bg-opacity-30 p-2.5 rounded-lg group-hover:bg-opacity-40 transition-all'>
                    <Icon className='h-5 w-5' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-base'>{action.title}</h4>
                    <p className='text-sm text-white text-opacity-90 mt-0.5'>{action.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Analytics Section */}
      <Card>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>Analytics Overview</h3>
            <p className='text-sm text-gray-500 mt-1'>Track your performance and growth</p>
          </div>
          <div className='flex gap-2'>
            {(['7', '30', '90'] as const).map((days) => (
              <button
                key={days}
                onClick={() => setTimeFilter(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeFilter === days
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                {days} days
              </button>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Profile Views Trend */}
          <div className='lg:col-span-2'>
            <h4 className='text-md font-semibold text-gray-800 mb-4'>Profile Views Trend</h4>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={profileViewsTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                  <XAxis dataKey='month' stroke='#9ca3af' fontSize={12} />
                  <YAxis stroke='#9ca3af' fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='views'
                    stroke='#A855F7'
                    strokeWidth={3}
                    dot={{ fill: '#A855F7', r: 4 }}
                    activeDot={{ r: 6 }}
                    name='Profile Views'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Application Status Distribution */}
          <div>
            <h4 className='text-md font-semibold text-gray-800 mb-4'>Application Status</h4>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx='50%'
                    cy='50%'
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey='value'>
                    {(applicationStatusData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='grid grid-cols-2 gap-2 mt-4'>
              {(applicationStatusData || []).map((item) => (
                <div key={item.name} className='flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full' style={{ backgroundColor: item.color }}></div>
                  <div className='flex-1'>
                    <p className='text-xs font-medium text-gray-700'>{item.name}</p>
                    <p className='text-xs text-gray-500'>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Earnings Trend */}
        <div className='mt-6'>
          <h4 className='text-md font-semibold text-gray-800 mb-4'>Earnings Trend</h4>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={earningsTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey='month' stroke='#9ca3af' fontSize={12} />
                <YAxis stroke='#9ca3af' fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar dataKey='earnings' fill='#10B981' radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Two Column Layout: Job Opportunities & Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Latest Job Opportunities */}
        <Card>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>Latest Job Opportunities</h3>
              <p className='text-sm text-gray-500 mt-1'>Matched to your profile</p>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className='text-sm font-medium text-purple-600 hover:text-purple-700'>
              View All →
            </button>
          </div>

          <div className='space-y-4'>
            {(jobOpportunities || []).length > 0 ? (
              (jobOpportunities || []).map((job) => {
                const matchBadge = getMatchScoreBadge(job?.matchScore || 0)
                return (
                  <div
                    key={job?.id || Math.random()}
                    className='p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 hover:border-purple-300 cursor-pointer'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-gray-900 hover:text-purple-600 transition-colors'>
                          {job?.title || 'Untitled Job'}
                        </h4>
                        <p className='text-sm text-gray-600 mt-1'>{job?.company || 'Company'}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${matchBadge.color}`}>
                        {job?.matchScore || 0}% Match
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-xs text-gray-500 mb-3'>
                      <span className='flex items-center gap-1'>
                        <span className='font-medium text-purple-600'>{job?.budget || 'N/A'}</span>
                      </span>
                      <span>•</span>
                      <span>{job?.type || 'N/A'}</span>
                      <span>•</span>
                      <span>{job?.location || 'N/A'}</span>
                    </div>
                    <button className='w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm'>
                      Apply Now
                    </button>
                  </div>
                )
              })
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <p className='text-sm'>No job opportunities available at the moment.</p>
                <button
                  onClick={() => navigate('/jobs')}
                  className='mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm'>
                  Browse All Jobs →
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>Recent Activity</h3>
              <p className='text-sm text-gray-500 mt-1'>Your latest updates</p>
            </div>
          </div>

          <div className='space-y-4'>
            {(recentActivities || []).length > 0 ? (
              (recentActivities || []).map((activity) => {
                const Icon = activity?.icon || BriefcaseIcon
                return (
                  <div
                    key={activity?.id || Math.random()}
                    className='flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors'>
                    <div className={`${activity?.bgColor || 'bg-purple-50'} p-2.5 rounded-lg shrink-0`}>
                      <Icon className={`h-5 w-5 ${activity?.color || 'text-purple-600'}`} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-gray-900'>{activity?.title || 'Activity'}</p>
                      <p className='text-sm text-gray-600 mt-0.5'>{activity?.company || 'Company'}</p>
                      <p className='text-xs text-gray-500 mt-1'>{activity?.timestamp || 'Recently'}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <p className='text-sm'>No recent activity to display.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Portfolio Preview */}
      <Card>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>Portfolio Preview</h3>
            <p className='text-sm text-gray-500 mt-1'>Your latest artworks</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className='text-sm font-medium text-purple-600 hover:text-purple-700'>
            Manage Portfolio →
          </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {(portfolioItems || []).length > 0 ? (
            (portfolioItems || []).map((item) => (
              <div
                key={item?.id || Math.random()}
                className='group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                <div className='aspect-w-4 aspect-h-3 bg-gray-200'>
                  <img
                    src={item?.imageUrl || item?.thumbnailUrl || '/placeholder.jpg'}
                    alt={item?.title || 'Portfolio Item'}
                    className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110'
                  />
                </div>
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
                  <h4 className='text-white font-semibold text-sm mb-2'>{item?.title || 'Untitled'}</h4>
                  <div className='flex items-center gap-1 text-white text-xs'>
                    <EyeIcon className='h-4 w-4' />
                    <span>{(item?.views || 0).toLocaleString()} views</span>
                  </div>
                </div>
                <div className='absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-gray-700'>
                  <EyeIcon className='h-3 w-3' />
                  {(item?.views || 0).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-12 text-gray-500'>
              <p className='text-sm'>No portfolio items yet.</p>
              <button
                onClick={() => navigate('/profile')}
                className='mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm'>
                Add Your First Artwork →
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default ArtistDashboard
