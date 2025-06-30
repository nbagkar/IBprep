'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  GlobeAltIcon,
  BookmarkIcon,
  ShareIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewsFeed() {
  const { newsItems, addNewsItem, deleteNewsItem } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const [filterSource, setFilterSource] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    source: '',
    url: '',
    summary: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    addNewsItem({
      ...formData,
      publishedAt: new Date().toISOString()
    })
    
    toast.success('News item added successfully!')
    setShowModal(false)
    setFormData({
      title: '',
      source: '',
      url: '',
      summary: ''
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      deleteNewsItem(id)
      toast.success('News item deleted successfully!')
    }
  }

  const filteredNews = newsItems.filter(news => {
    const matchesSource = filterSource === 'all' || news.source.toLowerCase().includes(filterSource.toLowerCase())
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSource && matchesSearch
  })

  const sources = Array.from(new Set(newsItems.map(news => news.source)))
  const sourceOptions = [
    { id: 'all', name: 'All Sources', count: newsItems.length },
    ...sources.map(source => ({
      id: source,
      name: source,
      count: newsItems.filter(news => news.source === source).length
    }))
  ]

  const getSourceColor = (source: string) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-indigo-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
      'from-slate-500 to-gray-600'
    ]
    return colors[Math.abs(source.length) % colors.length]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

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
          className="text-4xl font-bold text-gradient mb-3"
        >
          Live News Feed
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600"
        >
          Stay updated with the latest investment banking news and market insights
        </motion.p>
      </div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search News</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by title or summary..."
              />
              <EyeIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div className="lg:w-64">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Source</label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="input-field"
            >
              {sourceOptions.map(source => (
                <option key={source.id} value={source.id}>
                  {source.name} ({source.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Add News Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center group"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
          Add News Item
        </button>
      </motion.div>

      {/* News Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredNews.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-hover group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSourceColor(news.source)} text-white`}>
                {news.source}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Bookmark"
                >
                  <BookmarkIcon className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                  title="Share"
                >
                  <ShareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(news.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {news.title}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <GlobeAltIcon className="w-4 h-4 mr-1" />
                  <span>{news.source}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>{formatDate(news.publishedAt)}</span>
                </div>
              </div>

              {news.summary && (
                <p className="text-sm text-slate-600 line-clamp-3">
                  {news.summary}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>{formatDate(news.publishedAt)}</span>
                  </div>
                </div>
                {news.url && (
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-sm flex items-center group"
                  >
                    Read More
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GlobeAltIcon className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No news found</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || filterSource !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Add your first news item to get started!'
            }
          </p>
          {!searchTerm && filterSource === 'all' && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              Add Your First News Item
            </button>
          )}
        </motion.div>
      )}

      {/* Add News Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-content"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Add News Item
                </h3>
                <p className="text-slate-600">Enter the news details below</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Goldman Sachs Reports Strong Q3 Earnings"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Source</label>
                  <input
                    type="text"
                    required
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Bloomberg, Reuters, Financial Times"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/article"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Summary</label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Brief summary of the news article..."
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add News Item
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 