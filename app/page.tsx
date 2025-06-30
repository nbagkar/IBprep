'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import FirmTracker from '@/components/FirmTracker'
import InterviewPrep from '@/components/InterviewPrep'
import ResourceLibrary from '@/components/ResourceLibrary'
import NewsFeed from '@/components/NewsFeed'
import { Bars3Icon } from '@heroicons/react/24/outline'

export default function Home() {
  const { activeTab, sidebarOpen, setSidebarOpen } = useAppStore()

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'firm-tracker':
        return <FirmTracker />
      case 'interview-prep':
        return <InterviewPrep />
      case 'resources':
        return <ResourceLibrary />
      case 'news':
        return <NewsFeed />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            <Bars3Icon className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">IB</span>
            </div>
            <span className="font-semibold text-slate-900">Prep Hub</span>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
} 