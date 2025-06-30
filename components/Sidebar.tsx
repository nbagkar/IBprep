'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { 
  ChartBarIcon, 
  BuildingOfficeIcon, 
  AcademicCapIcon, 
  BookOpenIcon, 
  NewspaperIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: 'dashboard', icon: ChartBarIcon },
  { name: 'Firm Tracker', href: 'firm-tracker', icon: BuildingOfficeIcon },
  { name: 'Interview Prep', href: 'interview-prep', icon: AcademicCapIcon },
  { name: 'Resource Library', href: 'resources', icon: BookOpenIcon },
  { name: 'News Feed', href: 'news', icon: NewspaperIcon },
]

export default function Sidebar() {
  const { activeTab, sidebarOpen, setActiveTab, setSidebarOpen } = useAppStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IB</span>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">Prep Hub</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = activeTab === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 w-full text-left
                    ${isActive 
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon 
                    className={`
                      mr-3 h-5 w-5 transition-colors duration-200
                      ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `} 
                  />
                  {item.name}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            IB Prep Hub v1.0
          </div>
        </div>
      </div>
    </>
  )
} 