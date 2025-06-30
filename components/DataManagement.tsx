'use client'

import React, { useState, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import { 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon, 
  TrashIcon, 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function DataManagement() {
  const { exportData, importData, clearAllData, getDataStats } = useAppStore()
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const stats = getDataStats()

  const handleExport = () => {
    try {
      exportData()
      toast.success('Data exported successfully!')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportResult(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string
        const result = importData(jsonData)
        setImportResult(result)
        
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        setImportResult({ success: false, message: 'Failed to read file' })
        toast.error('Failed to read file')
      }
      setIsImporting(false)
    }

    reader.onerror = () => {
      setImportResult({ success: false, message: 'Failed to read file' })
      toast.error('Failed to read file')
      setIsImporting(false)
    }

    reader.readAsText(file)
  }

  const handleClearData = () => {
    const result = clearAllData()
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const dataCards = [
    {
      title: 'Firms',
      count: stats.totalFirms,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'Coffee Chats',
      count: stats.totalCoffeeChats,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50'
    },
    {
      title: 'Behavioral Questions',
      count: stats.totalBehavioralQuestions,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50'
    },
    {
      title: 'Technical Questions',
      count: stats.totalTechnicalQuestions,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50'
    },
    {
      title: 'Resources',
      count: stats.totalResources,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50'
    },
    {
      title: 'Contacts',
      count: stats.totalContacts,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50'
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
          Data Management
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-600"
        >
          Backup, restore, and manage your IB prep data
        </motion.p>
      </div>

      {/* Data Statistics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Your Data Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className={`p-4 bg-gradient-to-r ${card.bgColor} rounded-xl border border-slate-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{card.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{card.count}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}>
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Data Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Export Data */}
        <div className="card">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ArrowDownTrayIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Export Data</h3>
            <p className="text-slate-600 mb-6">
              Download a backup of all your data as a JSON file
            </p>
            <button
              onClick={handleExport}
              className="btn-primary w-full"
            >
              Export Backup
            </button>
          </div>
        </div>

        {/* Import Data */}
        <div className="card">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ArrowUpTrayIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Import Data</h3>
            <p className="text-slate-600 mb-6">
              Restore your data from a previously exported backup file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="btn-secondary w-full"
            >
              {isImporting ? 'Importing...' : 'Import Backup'}
            </button>
            
            {importResult && (
              <div className={`mt-4 p-3 rounded-lg flex items-center ${
                importResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {importResult.success ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span className={`text-sm ${
                  importResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {importResult.message}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Clear Data */}
        <div className="card">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Clear All Data</h3>
            <p className="text-slate-600 mb-6">
              Permanently delete all your data (cannot be undone)
            </p>
            <button
              onClick={handleClearData}
              className="btn-danger w-full"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </motion.div>

      {/* Important Notes */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="card bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
      >
        <div className="flex items-start">
          <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-amber-800 mb-2">Important Notes</h3>
            <ul className="text-amber-700 space-y-1 text-sm">
              <li>• Your data is automatically saved to your browser's local storage</li>
              <li>• Data is tied to your current browser and device</li>
              <li>• Clearing browser data will delete your information</li>
              <li>• Export backups regularly to prevent data loss</li>
              <li>• Import will replace all existing data with backup data</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
