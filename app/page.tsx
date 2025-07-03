'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import FirmTracker from '@/components/FirmTracker'
import InterviewPrep from '@/components/InterviewPrep'
import ResourceLibrary from '@/components/ResourceLibrary'
import LiveMarketCoverage from '@/components/LiveMarketCoverage'
import DataManagement from '@/components/DataManagement'
import NewsFeed from '@/components/NewsFeed'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import { FirebaseService, Notification } from '../lib/firebaseService'

export default function Home() {
  const { activeTab, sidebarOpen, setSidebarOpen, user, userLoading, signIn } = useAppStore()
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState('');
  const userEmail = user?.email;
  const isAdmin = userEmail === 'nihar.bagkar@gmail.com';

  useEffect(() => {
    if (showNotifications) {
      FirebaseService.getNotifications(10).then(setNotifications);
    }
  }, [showNotifications]);

  const handleAddNotification = async () => {
    if (newNotification.trim()) {
      await FirebaseService.addNotification({ text: newNotification.trim() });
      setNewNotification('');
      const updated = await FirebaseService.getNotifications(10);
      setNotifications(updated);
    }
  };

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
      case 'live-markets':
        return <LiveMarketCoverage />
      case 'data-management':
        return <DataManagement />
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
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 relative">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">IB</span>
            </div>
            <span className="font-semibold text-slate-900 text-lg">Prep Hub</span>
          </div>
          {/* Notification Icon */}
          <button
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
            onClick={() => setShowNotifications((v) => !v)}
            aria-label="Show notifications"
          >
            <BellIcon className="w-6 h-6 text-slate-600" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 relative">
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
          {/* Notification Icon */}
          <button
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
            onClick={() => setShowNotifications((v) => !v)}
            aria-label="Show notifications"
          >
            <BellIcon className="w-6 h-6 text-slate-600" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Sign-in prompt if not signed in */}
            {!user && !userLoading && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between">
                <span className="text-yellow-800 font-medium">Sign in with Google to save your information and access all features.</span>
                <button onClick={signIn} className="btn-primary ml-4">Sign in</button>
              </div>
            )}
            {renderContent()}
          </div>
        </main>
      </div>
      {/* Notification Popover rendered at root, fixed position */}
      {showNotifications && (
        <div className="fixed right-8 top-20 z-[9999] w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-4 animate-fade-in">
          <div className="font-semibold mb-2 text-slate-800">Recent Updates</div>
          <ul className="space-y-2 text-sm max-h-60 overflow-y-auto">
            {notifications.map(n => (
              <li key={n.id} className="text-slate-700">{n.text}</li>
            ))}
          </ul>
          {isAdmin && (
            <div className="mt-4">
              <input
                type="text"
                className="w-full border rounded px-2 py-1 mb-2"
                placeholder="Add notification..."
                value={newNotification}
                onChange={e => setNewNotification(e.target.value)}
              />
              <button
                className="w-full btn-primary"
                onClick={handleAddNotification}
              >
                Add Notification
              </button>
            </div>
          )}
          <button className="mt-4 w-full btn-secondary" onClick={() => setShowNotifications(false)}>Close</button>
        </div>
      )}
    </div>
  )
} 