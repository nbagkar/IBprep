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
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  FlagIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { 
    firms, 
    coffeeChats, 
    behavioralQuestions, 
    technicalQuestions, 
    mockInterviews,
    networkingEvents,
    setActiveTab
  } = useAppStore()

  // Helper to get date string (YYYY-MM-DD)
  const getDateString = (date: Date) => date.toISOString().split('T')[0]
  const todayStr = getDateString(new Date())
  const yesterdayStr = getDateString(new Date(Date.now() - 86400000))

  // Helper to count items created on a given day
  const countByDate = (arr: any[], field = 'createdAt') => arr.filter((item: any) => item[field] && getDateString(new Date(item[field])) === todayStr).length
  const countByDateYesterday = (arr: any[], field = 'createdAt') => arr.filter((item: any) => item[field] && getDateString(new Date(item[field])) === yesterdayStr).length

  // Firms
  const firmsToday = countByDate(firms, 'lastUpdated')
  const firmsYesterday = countByDateYesterday(firms, 'lastUpdated')
  // Coffee chats
  const chatsToday = countByDate(coffeeChats, 'scheduledDate')
  const chatsYesterday = countByDateYesterday(coffeeChats, 'scheduledDate')
  // Questions
  const answeredQuestionsToday = countByDate([...behavioralQuestions.filter(q => q.answer.trim() !== ''), ...technicalQuestions.filter(q => q.answer.trim() !== '')], 'lastUpdated')
  const answeredQuestionsYesterday = countByDateYesterday([...behavioralQuestions.filter(q => q.answer.trim() !== ''), ...technicalQuestions.filter(q => q.answer.trim() !== '')], 'lastUpdated')
  // Mocks
  const mocksToday = countByDate(mockInterviews, 'date')
  const mocksYesterday = countByDateYesterday(mockInterviews, 'date')

  // Helper for percent change
  const percentChange = (today: number, yesterday: number) => {
    if (yesterday === 0 && today === 0) return 0
    if (yesterday === 0) return 100
    return Math.round(((today - yesterday) / Math.max(yesterday, 1)) * 100)
  }

  const firmTrend = percentChange(firmsToday, firmsYesterday)
  const chatTrend = percentChange(chatsToday, chatsYesterday)
  const questionTrend = percentChange(answeredQuestionsToday, answeredQuestionsYesterday)
  const mockTrend = percentChange(mocksToday, mocksYesterday)

  // Calculate KPIs
  const totalFirms = firms.length
  const researchingFirms = firms.filter(f => f.status === 'Researching').length
  const appliedFirms = firms.filter(f => f.status === 'Applied').length
  const interviewingFirms = firms.filter(f => f.status === 'Interviewing').length
  const offerFirms = firms.filter(f => f.status === 'Offer').length
  const rejectedFirms = firms.filter(f => f.status === 'Rejected').length
  
  const completedChats = coffeeChats.filter(c => c.completed).length
  const answeredQuestions = behavioralQuestions.filter(q => q.answer.trim() !== '').length + 
                           technicalQuestions.filter(q => q.answer.trim() !== '').length
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
    { name: 'Researching', value: researchingFirms, color: '#8b5cf6' },
    { name: 'Applied', value: appliedFirms, color: '#3b82f6' },
    { name: 'Interviewing', value: interviewingFirms, color: '#f59e0b' },
    { name: 'Offer', value: offerFirms, color: '#22c55e' },
    { name: 'Rejected', value: rejectedFirms, color: '#ef4444' },
  ]

  // Recent activity
  const recentActivity = [
    ...firms.map(f => ({ type: 'firm' as const, item: f, date: f.lastUpdated })),
    ...coffeeChats.map(c => ({ type: 'chat' as const, item: c, date: c.scheduledDate })),
    ...mockInterviews.map(m => ({ type: 'mock' as const, item: m, date: m.date })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  const kpiCards = [
    {
      title: 'Total Firms',
      value: firms.length,
      icon: BuildingOfficeIcon,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      trend: `${firmTrend > 0 ? '+' : ''}${firmTrend}%`,
      trendColor: firmTrend > 0 ? 'text-emerald-600' : firmTrend < 0 ? 'text-red-600' : 'text-slate-500'
    },
    {
      title: 'Coffee Chats',
      value: completedChats,
      icon: UsersIcon,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      trend: `${chatTrend > 0 ? '+' : ''}${chatTrend}%`,
      trendColor: chatTrend > 0 ? 'text-emerald-600' : chatTrend < 0 ? 'text-red-600' : 'text-slate-500'
    },
    {
      title: 'Answered Questions',
      value: answeredQuestions,
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50',
      trend: `${questionTrend > 0 ? '+' : ''}${questionTrend}%`,
      trendColor: questionTrend > 0 ? 'text-emerald-600' : questionTrend < 0 ? 'text-red-600' : 'text-slate-500'
    },
    {
      title: 'Mock Interviews',
      value: completedMocks,
      icon: FlagIcon,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      trend: `${mockTrend > 0 ? '+' : ''}${mockTrend}%`,
      trendColor: mockTrend > 0 ? 'text-emerald-600' : mockTrend < 0 ? 'text-red-600' : 'text-slate-500'
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gradient mb-3"
        >
          Welcome to IB Prep Hub
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-600"
        >
          Track your investment banking recruiting progress and stay ahead of the competition
        </motion.p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-hover group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 bg-gradient-to-r ${card.bgColor} rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-8 h-8 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center text-sm font-semibold ${card.trendColor}`}>
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  {card.trend}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Status Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Application Status</h3>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center p-3 bg-slate-50 rounded-xl">
                <div 
                  className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                  <div className="text-lg font-bold text-slate-900">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200/50"
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {activity.type === 'firm' && `Updated ${(activity.item as any).name} application`}
                      {activity.type === 'chat' && `Scheduled coffee chat with ${(activity.item as any).contactName}`}
                      {activity.type === 'mock' && `Completed mock interview`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Upcoming Deadlines</h3>
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mr-2" />
              <span className="text-sm font-semibold text-amber-600">Priority</span>
            </div>
          </div>
          <div className="space-y-4">
            {upcomingDeadlines.map((firm, index) => {
              const deadline = new Date(firm.deadline!)
              const diffTime = deadline.getTime() - new Date().getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              
              return (
                <motion.div
                  key={firm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{firm.name}</p>
                    <p className="text-sm text-slate-600">{firm.division} • {firm.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-700">
                      {diffDays === 0 ? 'Today' : `${diffDays} day${diffDays !== 1 ? 's' : ''}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {deadline.toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="card"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => {
              setActiveTab('firm-tracker')
              // You can add logic here to open the add firm modal directly
            }}
            className="btn-primary flex items-center justify-center group p-6"
          >
            <div className="text-center">
              <BuildingOfficeIcon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Add New Firm</span>
              <p className="text-sm opacity-90 mt-1">Track applications</p>
            </div>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('interview-prep')
              // You can add logic here to open the mock interview modal directly
            }}
            className="btn-secondary flex items-center justify-center group p-6"
          >
            <div className="text-center">
              <AcademicCapIcon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Schedule Mock Interview</span>
              <p className="text-sm opacity-90 mt-1">Practice sessions</p>
            </div>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('resources')
              // You can add logic here to open the upload modal directly
            }}
            className="btn-secondary flex items-center justify-center group p-6"
          >
            <div className="text-center">
              <BookOpenIcon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Add Resource</span>
              <p className="text-sm opacity-90 mt-1">Study materials</p>
            </div>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('news')
              // You can add logic here to open the add news modal directly
            }}
            className="btn-secondary flex items-center justify-center group p-6"
          >
            <div className="text-center">
              <NewspaperIcon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Add News Item</span>
              <p className="text-sm opacity-90 mt-1">Market updates</p>
            </div>
          </button>
        </div>
        
        {/* Additional Quick Actions */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Recent Activities</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-700">Applications</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{appliedFirms}</span>
              </div>
              <p className="text-sm text-blue-600">Firms applied to this month</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-emerald-700">Coffee Chats</span>
                <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">{completedChats}</span>
              </div>
              <p className="text-sm text-emerald-600">Networking conversations</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                              <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-purple-700">Answered Questions</span>
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{answeredQuestions}</span>
                </div>
                <p className="text-sm text-purple-600">Questions with answers</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 