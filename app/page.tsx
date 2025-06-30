'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import FirmTracker from '@/components/FirmTracker'
import InterviewPrep from '@/components/InterviewPrep'
import ResourceLibrary from '@/components/ResourceLibrary'
import NewsFeed from '@/components/NewsFeed'

export default function HomePage() {
  const { activeTab, sidebarOpen, setSidebarOpen } = useAppStore()

  const renderActiveTab = () => {
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>
    </div>
  )
} 