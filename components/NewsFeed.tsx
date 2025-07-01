'use client'

import React, { useState, useMemo } from 'react'
import { useAppStore, type MarketIntel } from '@/lib/store'
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  GlobeAltIcon,
  BookmarkIcon,
  ShareIcon,
  EyeIcon,
  ClockIcon,
  AcademicCapIcon,
  TagIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewsFeed() {
  const { marketIntel, addMarketIntel, updateMarketIntel, deleteMarketIntel } = useAppStore()
  const [activeTab, setActiveTab] = useState<'insights' | 'weekly' | 'flashcards'>('insights')
  const [showModal, setShowModal] = useState(false)
  const [showFlashcardModal, setShowFlashcardModal] = useState(false)
  const [selectedIntel, setSelectedIntel] = useState<MarketIntel | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [flashcardMode, setFlashcardMode] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    categoryTags: '',
    summary: '',
    relevanceToIB: '',
    coffeeChatNotes: '',
    url: '',
    screenshotUrl: ''
  })

  const [flashcardData, setFlashcardData] = useState({
    question: '',
    answer: ''
  })

  // Calculate week number and year for current date
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const currentDate = new Date(formData.date)
    const weekNumber = getWeekNumber(currentDate)
    const year = currentDate.getFullYear()
    
    addMarketIntel({
      title: formData.title,
      source: formData.source,
      date: formData.date,
      categoryTags: formData.categoryTags.split(',').map(tag => tag.trim()).filter(Boolean),
      summary: formData.summary,
      relevanceToIB: formData.relevanceToIB,
      coffeeChatNotes: formData.coffeeChatNotes,
      url: formData.url || undefined,
      screenshotUrl: formData.screenshotUrl || undefined,
      isFlashcard: false,
      reviewStatus: 'Need to Review',
      weekNumber,
      year,
      lastUpdated: new Date().toISOString()
    })
    
    toast.success('Market insight logged successfully!')
    setShowModal(false)
    setFormData({
      title: '',
      source: '',
      date: new Date().toISOString().split('T')[0],
      categoryTags: '',
      summary: '',
      relevanceToIB: '',
      coffeeChatNotes: '',
      url: '',
      screenshotUrl: ''
    })
  }

  const handleFlashcardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedIntel) return
    
    updateMarketIntel(selectedIntel.id, {
      isFlashcard: true,
      flashcardQuestion: flashcardData.question,
      flashcardAnswer: flashcardData.answer
    })
    
    toast.success('Flashcard created successfully!')
    setShowFlashcardModal(false)
    setSelectedIntel(null)
    setFlashcardData({ question: '', answer: '' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this insight?')) {
      deleteMarketIntel(id)
      toast.success('Insight deleted successfully!')
    }
  }

  const handleStatusUpdate = (id: string, status: MarketIntel['reviewStatus']) => {
    updateMarketIntel(id, { reviewStatus: status })
    toast.success(`Status updated to ${status}`)
  }

  const handleCreateFlashcard = (intel: MarketIntel) => {
    setSelectedIntel(intel)
    setFlashcardData({
      question: `What's the key insight about ${intel.title}?`,
      answer: intel.summary
    })
    setShowFlashcardModal(true)
  }

  // Filter insights
  const filteredIntel = useMemo(() => {
    return marketIntel.filter(intel => {
      const matchesCategory = filterCategory === 'all' || intel.categoryTags.includes(filterCategory)
      const matchesStatus = filterStatus === 'all' || intel.reviewStatus === filterStatus
      const matchesSearch = intel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           intel.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           intel.categoryTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesCategory && matchesStatus && matchesSearch
    })
  }, [marketIntel, filterCategory, filterStatus, searchTerm])

  // Group by week for weekly summary
  const weeklyInsights = useMemo(() => {
    const currentWeek = getWeekNumber(new Date())
    const currentYear = new Date().getFullYear()
    
    return marketIntel.filter(intel => 
      intel.weekNumber === currentWeek && intel.year === currentYear
    ).slice(0, 5) // Top 5 insights for the week
  }, [marketIntel])

  // Get all unique categories and sources
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    marketIntel.forEach(intel => {
      intel.categoryTags.forEach(tag => categories.add(tag))
    })
    return Array.from(categories)
  }, [marketIntel])

  const allSources = useMemo(() => {
    return Array.from(new Set(marketIntel.map(intel => intel.source)))
  }, [marketIntel])

  const getStatusColor = (status: MarketIntel['reviewStatus']) => {
    switch (status) {
      case 'Need to Review': return 'from-red-500 to-rose-600'
      case 'Solid': return 'from-amber-500 to-orange-600'
      case 'Coffee Chat Ready': return 'from-green-500 to-emerald-600'
      default: return 'from-slate-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: MarketIntel['reviewStatus']) => {
    switch (status) {
      case 'Need to Review': return ExclamationTriangleIcon
      case 'Solid': return CheckCircleIcon
      case 'Coffee Chat Ready': return StarIcon
      default: return ClockIcon
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const tabs = [
    { id: 'insights', name: 'Insights', icon: LightBulbIcon },
    { id: 'weekly', name: 'Weekly Summary', icon: CalendarIcon },
    { id: 'flashcards', name: 'Flashcards', icon: AcademicCapIcon },
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
          className="text-4xl font-bold text-gradient mb-3"
        >
          Market Intel Tracker
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600"
        >
          Log, summarize, and quiz yourself on market insights and news
        </motion.p>
      </div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex-1
                ${activeTab === tab.id 
                  ? 'bg-white text-blue-700 shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }
              `}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search Insights</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by title, summary, or tags..."
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div className="lg:w-48">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:w-48">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="Need to Review">Need to Review</option>
              <option value="Solid">Solid</option>
              <option value="Coffee Chat Ready">Coffee Chat Ready</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Add Insight Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center group"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
          Log Insight
        </button>
      </motion.div>

      {/* Content based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredIntel.map((intel, index) => (
                <motion.div
                  key={intel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white`}>
                        {intel.source}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(intel.reviewStatus)} text-white`}>
                        {intel.reviewStatus}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCreateFlashcard(intel)}
                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                        title="Create Flashcard"
                      >
                        <AcademicCapIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(intel.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title and Date */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{intel.title}</h3>
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {formatDate(intel.date)}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {intel.categoryTags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Summary */}
                  <p className="text-slate-600 mb-4 line-clamp-3">{intel.summary}</p>

                  {/* Importance */}
                  {intel.relevanceToIB && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Importance:</h4>
                      <p className="text-sm text-blue-700">{intel.relevanceToIB}</p>
                    </div>
                  )}

                  {/* Coffee Chat Notes */}
                  {intel.coffeeChatNotes && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-green-800 mb-1 flex items-center">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                        Coffee Chat Material:
                      </h4>
                      <p className="text-sm text-green-700">{intel.coffeeChatNotes}</p>
                    </div>
                  )}

                  {/* Status Update Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex space-x-2">
                      {(['Need to Review', 'Solid', 'Coffee Chat Ready'] as const).map((status) => {
                        const Icon = getStatusIcon(status)
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(intel.id, status)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              intel.reviewStatus === status
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title={status}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        )
                      })}
                    </div>
                    {intel.url && (
                      <a
                        href={intel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Source →
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredIntel.length === 0 && (
              <div className="text-center py-12">
                <LightBulbIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No insights found. Start logging your market intelligence!</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'weekly' && (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Weekly Summary Card */}
            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-blue-900">This Week in Markets</h3>
                <div className="text-sm text-blue-600">
                  Week {getWeekNumber(new Date())}, {new Date().getFullYear()}
                </div>
              </div>
              
              {weeklyInsights.length > 0 ? (
                <div className="space-y-4">
                  {weeklyInsights.map((insight, index) => (
                    <div key={insight.id} className="p-4 bg-white rounded-lg border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                        <span className="text-sm text-slate-500">{insight.source}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{insight.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.categoryTags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                  <p className="text-blue-600">No insights logged this week yet.</p>
                </div>
              )}
            </div>

            {/* Weekly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{weeklyInsights.length}</div>
                <div className="text-sm text-slate-600">Insights This Week</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {weeklyInsights.filter(i => i.reviewStatus === 'Coffee Chat Ready').length}
                </div>
                <div className="text-sm text-slate-600">Coffee Chat Ready</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {weeklyInsights.filter(i => i.isFlashcard).length}
                </div>
                <div className="text-sm text-slate-600">Flashcards Created</div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'flashcards' && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Flashcard Mode Toggle */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Flashcard Mode</h3>
                  <p className="text-slate-600">Test your knowledge of market insights</p>
                </div>
                <button
                  onClick={() => setFlashcardMode(!flashcardMode)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    flashcardMode
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {flashcardMode ? 'Study Mode' : 'Quiz Mode'}
                </button>
              </div>
            </div>

            {/* Flashcards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredIntel.filter(intel => intel.isFlashcard).map((intel, index) => (
                <motion.div
                  key={intel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover group"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white`}>
                        Flashcard
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(intel.reviewStatus)} text-white`}>
                        {intel.reviewStatus}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      {flashcardMode ? 'Question:' : 'Q:'} {intel.flashcardQuestion}
                    </h3>
                    
                    {flashcardMode && (
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Answer:</h4>
                        <p className="text-purple-700">{intel.flashcardAnswer}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex space-x-2">
                      {(['Need to Review', 'Solid', 'Coffee Chat Ready'] as const).map((status) => {
                        const Icon = getStatusIcon(status)
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(intel.id, status)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              intel.reviewStatus === status
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title={status}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        )
                      })}
                    </div>
                    <span className="text-sm text-slate-500">{formatDate(intel.date)}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredIntel.filter(intel => intel.isFlashcard).length === 0 && (
              <div className="text-center py-12">
                <AcademicCapIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No flashcards created yet. Convert insights to flashcards to test your knowledge!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Insight Modal */}
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
              className="modal-content max-w-2xl"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Log Market Insight
                </h3>
                <p className="text-slate-600">Capture key market intelligence and insights</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Fed Hints at Rate Cut"
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
                      placeholder="e.g., WSJ, Bloomberg, Axios"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category Tags</label>
                    <input
                      type="text"
                      value={formData.categoryTags}
                      onChange={(e) => setFormData({ ...formData, categoryTags: e.target.value })}
                      className="input-field"
                      placeholder="e.g., macro, tech, deal, company"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">3-Sentence Summary</label>
                  <textarea
                    required
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Summarize the key insight in your own words..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Importance</label>
                  <textarea
                    value={formData.relevanceToIB}
                    onChange={(e) => setFormData({ ...formData, relevanceToIB: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="Why is this insight important? (Broader context, impact, or significance)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Coffee Chat Material</label>
                  <textarea
                    value={formData.coffeeChatNotes}
                    onChange={(e) => setFormData({ ...formData, coffeeChatNotes: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="What would you say about this in a coffee chat?"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Screenshot URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.screenshotUrl}
                      onChange={(e) => setFormData({ ...formData, screenshotUrl: e.target.value })}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
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
                    Log Insight
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Flashcard Modal */}
      <AnimatePresence>
        {showFlashcardModal && selectedIntel && (
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
                  Create Flashcard
                </h3>
                <p className="text-slate-600">Convert insight to Q&A format for better retention</p>
              </div>
              <form onSubmit={handleFlashcardSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Question</label>
                  <input
                    type="text"
                    required
                    value={flashcardData.question}
                    onChange={(e) => setFlashcardData({ ...flashcardData, question: e.target.value })}
                    className="input-field"
                    placeholder="What's the key insight about..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Answer</label>
                  <textarea
                    required
                    value={flashcardData.answer}
                    onChange={(e) => setFlashcardData({ ...flashcardData, answer: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="The key insight is..."
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowFlashcardModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Flashcard
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