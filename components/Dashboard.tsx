'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { 
  BuildingOfficeIcon, 
  AcademicCapIcon, 
  BookOpenIcon, 
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const { 
    firms, 
    coffeeChats, 
    behavioralQuestions, 
    technicalQuestions, 
    mockInterviews,
    networkingEvents 
  } = useAppStore()

  // Calculate KPIs
  const totalFirms = firms.length
  const appliedFirms = firms.filter(f => f.status === 'Applied').length
  const interviewingFirms = firms.filter(f => f.status === 'Interviewing').length
  const offerFirms = firms.filter(f => f.status === 'Offer').length
  const rejectedFirms = firms.filter(f => f.status === 'Rejected').length
  
  const completedChats = coffeeChats.filter(c => c.completed).length
  const totalQuestions = behavioralQuestions.length + technicalQuestions.length
  const completedMocks = mockInterviews.length
  
  // Upcoming deadlines (next 7 days)
  const upcomingDeadlines = firms.filter(f => {
    if (!f.deadline) return false
    const deadline = new Date(f.deadline)
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  })

  // Status distribution for chart
  const statusData = [
    { name: 'Applied', value: appliedFirms, color: '#3b82f6' },
    { name: 'Interviewing', value: interviewingFirms, color: '#f59e0b' },
    { name: 'Offer', value: offerFirms, color: '#22c55e' },
    { name: 'Rejected', value: rejectedFirms, color: '#ef4444' },
  ]

  // Recent activity
  const recentActivity = [
    ...firms.map(f => ({ type: 'firm', item: f, date: f.lastUpdated })),
    ...coffeeChats.map(c => ({ type: 'chat', item: c, date: c.scheduledDate })),
    ...mockInterviews.map(m => ({ type: 'mock', item: m, date: m.date })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Track your investment banking recruiting progress</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Firms</p>
              <p className="text-2xl font-bold text-gray-900">{totalFirms}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Coffee Chats</p>
              <p className="text-2xl font-bold text-gray-900">{completedChats}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <AcademicCapIcon className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prep Questions</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mock Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{completedMocks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center text-sm">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600">{item.name}:</span>
                <span className="ml-1 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-primary-600 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.type === 'firm' && `Updated ${activity.item.name} application`}
                      {activity.type === 'chat' && `Scheduled coffee chat with ${activity.item.contactName}`}
                      {activity.type === 'mock' && `Completed mock interview`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            <ExclamationTriangleIcon className="w-5 h-5 text-warning-500" />
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((firm) => {
              const deadline = new Date(firm.deadline!)
              const diffTime = deadline.getTime() - new Date().getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              
              return (
                <div key={firm.id} className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{firm.name}</p>
                    <p className="text-sm text-gray-600">{firm.division} • {firm.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-warning-700">
                      {diffDays === 0 ? 'Today' : `${diffDays} day${diffDays !== 1 ? 's' : ''}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {deadline.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-2" />
            Add New Firm
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <AcademicCapIcon className="w-5 h-5 mr-2" />
            Schedule Mock Interview
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <BookOpenIcon className="w-5 h-5 mr-2" />
            Add Resource
          </button>
        </div>
      </div>
    </div>
  )
} 