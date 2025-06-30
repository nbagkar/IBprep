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
  XMarkIcon,
  DocumentTextIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Dashboard', href: 'dashboard', icon: ChartBarIcon, color: 'from-blue-500 to-indigo-600' },
  { name: 'Firm Tracker', href: 'firm-tracker', icon: BuildingOfficeIcon, color: 'from-emerald-500 to-teal-600' },
  { name: 'Interview Prep', href: 'interview-prep', icon: AcademicCapIcon, color: 'from-purple-500 to-indigo-600' },
  { name: 'Resource Library', href: 'resources', icon: BookOpenIcon, color: 'from-amber-500 to-orange-600' },
  { name: 'Live Markets', href: 'live-markets', icon: ChartBarIcon, color: 'from-rose-500 to-pink-600' },
  { name: 'Market Intel', href: 'news', icon: LightBulbIcon, color: 'from-indigo-500 to-purple-600' },
  { name: 'Data Management', href: 'data-management', icon: DocumentTextIcon, color: 'from-slate-500 to-gray-600' },
]

export default function Sidebar() {
  const { activeTab, sidebarOpen, setActiveTab, setSidebarOpen } = useAppStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </motion.div>
      )}

      {/* Floating sidebar toggle button - only visible when sidebar is closed */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <Bars3Icon className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white/90 backdrop-blur-md shadow-2xl border-r border-white/20 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        `}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">IB</span>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gradient">Prep Hub</h1>
              <p className="text-xs text-slate-500">Your IB Journey</p>
            </div>
          </motion.div>
          <div className="flex items-center space-x-2">
            {/* Desktop toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
              title="Toggle Sidebar"
            >
              <Bars3Icon className="w-5 h-5 text-slate-600" />
            </button>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
            >
              <XMarkIcon className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 pb-4">
          <div className="space-y-2">
            {navigation.map((item, index) => {
              const isActive = activeTab === item.href
              return (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setActiveTab(item.href)
                  }}
                  className={`
                    group flex items-center px-4 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 w-full text-left relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-lg border border-blue-200/50' 
                      : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:shadow-md'
                    }
                  `}
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                  
                  {/* Icon */}
                  <div className={`
                    relative z-10 p-2 rounded-xl mr-4 transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : 'bg-slate-100 text-slate-600 group-hover:bg-white group-hover:shadow-md'
                    }
                  `}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  {/* Text */}
                  <span className="relative z-10">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-2">IB Prep Hub v1.0</div>
            <div className="w-full bg-slate-200 rounded-full h-1">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
} 