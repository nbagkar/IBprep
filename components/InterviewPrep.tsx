'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore, type BehavioralQuestion, type TechnicalQuestion, type MockInterview } from '@/lib/store'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FirebaseService } from '../lib/firebaseService'

export default function InterviewPrep() {
  const { 
    mockInterviews,
    addMockInterview,
    updateMockInterview,
    deleteMockInterview,
    user
  } = useAppStore()

  const isAdmin = user?.email === 'nihar.bagkar@gmail.com';

  const [activeTab, setActiveTab] = useState<'behavioral' | 'technical' | 'mocks'>('behavioral')
  const [showBehavioralModal, setShowBehavioralModal] = useState(false)
  const [showTechnicalModal, setShowTechnicalModal] = useState(false)
  const [showMockModal, setShowMockModal] = useState(false)
  const [editingBehavioral, setEditingBehavioral] = useState<BehavioralQuestion | null>(null)
  const [editingTechnical, setEditingTechnical] = useState<TechnicalQuestion | null>(null)
  const [editingMock, setEditingMock] = useState<MockInterview | null>(null)

  const [behavioralForm, setBehavioralForm] = useState({
    question: '',
    category: 'Leadership' as BehavioralQuestion['category'],
    difficulty: 'Medium' as BehavioralQuestion['difficulty'],
    answer: '',
    notes: ''
  })

  const [behavioralSearch, setBehavioralSearch] = useState('')
  const [behavioralCategoryFilter, setBehavioralCategoryFilter] = useState<string>('all')
  const [showPreloadedOnly, setShowPreloadedOnly] = useState(false)

  const [technicalSearch, setTechnicalSearch] = useState('')
  const [technicalCategoryFilter, setTechnicalCategoryFilter] = useState<string>('all')
  const [showTechnicalPreloadedOnly, setShowTechnicalPreloadedOnly] = useState(false)

  const [technicalForm, setTechnicalForm] = useState({
    question: '',
    category: 'Valuation' as TechnicalQuestion['category'],
    difficulty: 'Medium' as TechnicalQuestion['difficulty'],
    answer: '',
    notes: ''
  })

  const [mockForm, setMockForm] = useState({
    interviewer: '',
    date: '',
    type: 'Behavioral' as MockInterview['type'],
    score: 0,
    feedback: '',
    notes: ''
  })

  // Sync form state with editingBehavioral
  useEffect(() => {
    if (editingBehavioral) {
      setBehavioralForm({
        question: editingBehavioral.question,
        category: editingBehavioral.category,
        difficulty: editingBehavioral.difficulty,
        answer: editingBehavioral.answer,
        notes: editingBehavioral.notes
      });
    }
  }, [editingBehavioral]);

  // Sync form state with editingTechnical
  useEffect(() => {
    if (editingTechnical) {
      setTechnicalForm({
        question: editingTechnical.question,
        category: editingTechnical.category,
        difficulty: editingTechnical.difficulty,
        answer: editingTechnical.answer,
        notes: editingTechnical.notes
      });
    }
  }, [editingTechnical]);

  const handleBehavioralSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBehavioral) {
      if (editingBehavioral.isPreloaded && isAdmin) {
        await FirebaseService.updateBehavioralQuestion(editingBehavioral.id, behavioralForm)
        toast.success('Preloaded question updated globally!')
      } else {
        await FirebaseService.updateBehavioralQuestion(editingBehavioral.id, behavioralForm)
        toast.success('Question updated successfully!')
      }
    } else {
      await FirebaseService.addBehavioralQuestion({ ...behavioralForm, lastUpdated: new Date().toISOString() })
      toast.success('Question added successfully!')
    }
    
    setShowBehavioralModal(false)
    setEditingBehavioral(null)
    setBehavioralForm({
      question: '',
      category: 'Leadership',
      difficulty: 'Medium',
      answer: '',
      notes: ''
    })
  }

  const handleTechnicalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTechnical) {
      if (editingTechnical.isPreloaded && isAdmin) {
        await FirebaseService.updateTechnicalQuestion(editingTechnical.id, technicalForm)
        toast.success('Preloaded question updated globally!')
      } else {
        await FirebaseService.updateTechnicalQuestion(editingTechnical.id, technicalForm)
        toast.success('Question updated successfully!')
      }
    } else {
      await FirebaseService.addTechnicalQuestion({ ...technicalForm, lastUpdated: new Date().toISOString() })
      toast.success('Question added successfully!')
    }
    
    setShowTechnicalModal(false)
    setEditingTechnical(null)
    setTechnicalForm({
      question: '',
      category: 'Valuation',
      difficulty: 'Medium',
      answer: '',
      notes: ''
    })
  }

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingMock) {
      updateMockInterview(editingMock.id, mockForm)
      toast.success('Mock interview updated successfully!')
    } else {
      addMockInterview(mockForm)
      toast.success('Mock interview added successfully!')
    }
    
    setShowMockModal(false)
    setEditingMock(null)
    setMockForm({
      interviewer: '',
      date: '',
      type: 'Behavioral',
      score: 0,
      feedback: '',
      notes: ''
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-100'
      case 'Medium': return 'text-amber-600 bg-amber-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-slate-600 bg-slate-100'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-indigo-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600'
    ]
    return colors[Math.abs(category.length) % colors.length]
  }

  // Filter behavioral questions
  const filteredBehavioralQuestions = React.useMemo(() => {
    let filtered = behavioralQuestions

    // Filter by search
    if (behavioralSearch) {
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(behavioralSearch.toLowerCase()) ||
        q.answer.toLowerCase().includes(behavioralSearch.toLowerCase())
      )
    }

    // Filter by category
    if (behavioralCategoryFilter !== 'all') {
      filtered = filtered.filter(q => q.category === behavioralCategoryFilter)
    }

    // Filter by pre-loaded status
    if (showPreloadedOnly) {
      filtered = filtered.filter(q => q.isPreloaded)
    }

    return filtered
  }, [behavioralQuestions, behavioralSearch, behavioralCategoryFilter, showPreloadedOnly])

  // Filter technical questions
  const filteredTechnicalQuestions = React.useMemo(() => {
    let filtered = technicalQuestions

    // Filter by search
    if (technicalSearch) {
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(technicalSearch.toLowerCase()) ||
        q.answer.toLowerCase().includes(technicalSearch.toLowerCase())
      )
    }

    // Filter by category
    if (technicalCategoryFilter !== 'all') {
      filtered = filtered.filter(q => q.category === technicalCategoryFilter)
    }

    // Filter by pre-loaded status
    if (showTechnicalPreloadedOnly) {
      filtered = filtered.filter(q => q.isPreloaded)
    }

    return filtered
  }, [technicalQuestions, technicalSearch, technicalCategoryFilter, showTechnicalPreloadedOnly])

  // Get live counts for tabs
  const getBehavioralCount = () => {
    if (activeTab === 'behavioral') {
      return filteredBehavioralQuestions.length
    }
    return behavioralQuestions.length
  }

  const getTechnicalCount = () => {
    if (activeTab === 'technical') {
      return filteredTechnicalQuestions.length
    }
    return technicalQuestions.length
  }

  const tabs = [
    { id: 'behavioral', name: 'Behavioral', icon: ChatBubbleLeftRightIcon, count: getBehavioralCount() },
    { id: 'technical', name: 'Technical', icon: DocumentTextIcon, count: getTechnicalCount() },
    { id: 'mocks', name: 'Mock Interviews', icon: AcademicCapIcon, count: mockInterviews.length }
  ]

  // Local answers/notes state, keyed by question ID
  const [userBehavioralAnswers, setUserBehavioralAnswers] = useState<Record<string, { answer: string; notes: string }>>({});
  const [userTechnicalAnswers, setUserTechnicalAnswers] = useState<Record<string, { answer: string; notes: string }>>({});

  // Load questions from Firestore on mount
  useEffect(() => {
    FirebaseService.getAllBehavioralQuestions().then(setBehavioralQuestions);
    FirebaseService.getAllTechnicalQuestions().then(setTechnicalQuestions);
    // Load user answers/notes from localStorage
    const ba = localStorage.getItem('userBehavioralAnswers');
    if (ba) setUserBehavioralAnswers(JSON.parse(ba));
    const ta = localStorage.getItem('userTechnicalAnswers');
    if (ta) setUserTechnicalAnswers(JSON.parse(ta));
  }, []);

  // Save user answers/notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userBehavioralAnswers', JSON.stringify(userBehavioralAnswers));
  }, [userBehavioralAnswers]);
  useEffect(() => {
    localStorage.setItem('userTechnicalAnswers', JSON.stringify(userTechnicalAnswers));
  }, [userTechnicalAnswers]);

  // Firestore-backed question methods
  const addBehavioralQuestion = async (q: Omit<BehavioralQuestion, 'id'>) => {
    await FirebaseService.addBehavioralQuestion(q);
    setBehavioralQuestions(await FirebaseService.getAllBehavioralQuestions());
  };
  const updateBehavioralQuestion = async (id: string, updates: Partial<BehavioralQuestion>) => {
    await FirebaseService.updateBehavioralQuestion(id, updates);
    setBehavioralQuestions(await FirebaseService.getAllBehavioralQuestions());
  };
  const deleteBehavioralQuestion = async (id: string) => {
    await FirebaseService.deleteBehavioralQuestion(id);
    setBehavioralQuestions(await FirebaseService.getAllBehavioralQuestions());
  };
  const addTechnicalQuestion = async (q: Omit<TechnicalQuestion, 'id'>) => {
    await FirebaseService.addTechnicalQuestion(q);
    setTechnicalQuestions(await FirebaseService.getAllTechnicalQuestions());
  };
  const updateTechnicalQuestion = async (id: string, updates: Partial<TechnicalQuestion>) => {
    await FirebaseService.updateTechnicalQuestion(id, updates);
    setTechnicalQuestions(await FirebaseService.getAllTechnicalQuestions());
  };
  const deleteTechnicalQuestion = async (id: string) => {
    await FirebaseService.deleteTechnicalQuestion(id);
    setTechnicalQuestions(await FirebaseService.getAllTechnicalQuestions());
  };

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
          Interview Prep Center
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600"
        >
          Master behavioral questions, technical concepts, and practice with mock interviews
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
              <span className={`ml-auto px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Behavioral Questions */}
      {activeTab === 'behavioral' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Behavioral Questions</h2>
            <button
              onClick={() => setShowBehavioralModal(true)}
              className="btn-primary flex items-center group"
            >
              <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Add Question
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search questions..."
                value={behavioralSearch}
                onChange={(e) => setBehavioralSearch(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={behavioralCategoryFilter}
                onChange={(e) => setBehavioralCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                <option value="Leadership">Leadership</option>
                <option value="Teamwork">Teamwork</option>
                <option value="Problem Solving">Problem Solving</option>
                <option value="Communication">Communication</option>
                <option value="Conflict Resolution">Conflict Resolution</option>
                <option value="General">General</option>
                <option value="Motivation">Motivation</option>
                <option value="Experience">Experience</option>
                <option value="Strengths & Weaknesses">Strengths & Weaknesses</option>
                <option value="Team Dynamics">Team Dynamics</option>
                <option value="Challenges">Challenges</option>
                <option value="Goals">Goals</option>
                <option value="Personal">Personal</option>
                <option value="Networking">Networking</option>
              </select>
              <button
                onClick={() => setShowPreloadedOnly(!showPreloadedOnly)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  showPreloadedOnly 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {showPreloadedOnly ? 'Show All' : 'Pre-loaded Only'}
              </button>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBehavioralQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card-hover group ${question.isPreloaded ? 'ring-2 ring-blue-200' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(question.category)} text-white`}>
                      {question.category}
                    </div>
                    {question.isPreloaded && (
                      <div className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        Pre-loaded
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {question.isPreloaded && isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setEditingBehavioral(question)
                            setBehavioralForm({
                              question: question.question,
                              category: question.category,
                              difficulty: question.difficulty,
                              answer: question.answer,
                              notes: question.notes
                            })
                            setShowBehavioralModal(true)
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBehavioralQuestion(question.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2">{question.question}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </div>
                
                {question.answer && (
                  <div className="text-sm text-slate-600 line-clamp-3 mb-3">
                    {question.answer}
                  </div>
                )}
                
                {question.notes && (
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                    {question.notes}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Technical Questions */}
      {activeTab === 'technical' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Technical Questions</h2>
            <button
              onClick={() => setShowTechnicalModal(true)}
              className="btn-primary flex items-center group"
            >
              <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Add Question
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search questions..."
                value={technicalSearch}
                onChange={(e) => setTechnicalSearch(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={technicalCategoryFilter}
                onChange={(e) => setTechnicalCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                <option value="Valuation">Valuation</option>
                <option value="Financial Modeling">Financial Modeling</option>
                <option value="Accounting">Accounting</option>
                <option value="M&A">M&A</option>
                <option value="LBO">LBO</option>
                <option value="Market Sizing">Market Sizing</option>
                <option value="Other">Other</option>
                <option value="General">General</option>
              </select>
              <button
                onClick={() => setShowTechnicalPreloadedOnly(!showTechnicalPreloadedOnly)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  showTechnicalPreloadedOnly 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {showTechnicalPreloadedOnly ? 'Show All' : 'Pre-loaded Only'}
              </button>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnicalQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card-hover group ${question.isPreloaded ? 'ring-2 ring-blue-200' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(question.category)} text-white`}>
                      {question.category}
                    </div>
                    {question.isPreloaded && (
                      <div className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        Pre-loaded
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingTechnical(question)
                        setTechnicalForm({
                          question: question.question,
                          category: question.category,
                          difficulty: question.difficulty,
                          answer: question.answer,
                          notes: question.notes
                        })
                        setShowTechnicalModal(true)
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                      disabled={question.isPreloaded && !isAdmin}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    {(isAdmin ? question.isPreloaded : !question.isPreloaded) && (
                      <button
                        onClick={() => deleteTechnicalQuestion(question.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        disabled={question.isPreloaded && !isAdmin}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2">{question.question}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </div>
                
                {question.answer && (
                  <div className="text-sm text-slate-600 line-clamp-3 mb-3">
                    {question.answer}
                  </div>
                )}
                
                {question.notes && (
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                    {question.notes}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mock Interviews */}
      {activeTab === 'mocks' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Mock Interviews</h2>
            <button
              onClick={() => setShowMockModal(true)}
              className="btn-primary flex items-center group"
            >
              <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Schedule Mock
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockInterviews.map((mock, index) => (
              <motion.div
                key={mock.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-hover group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(mock.type)} text-white`}>
                    {mock.type}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingMock(mock)
                        setMockForm({
                          interviewer: mock.interviewer,
                          date: mock.date,
                          type: mock.type,
                          score: mock.score,
                          feedback: mock.feedback,
                          notes: mock.notes
                        })
                        setShowMockModal(true)
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMockInterview(mock.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  <UserIcon className="w-5 h-5 text-slate-400 mr-2" />
                  <span className="font-semibold text-slate-900">{mock.interviewer}</span>
                </div>
                
                <div className="flex items-center mb-3">
                  <CalendarIcon className="w-5 h-5 text-slate-400 mr-2" />
                  <span className="text-sm text-slate-600">
                    {new Date(mock.date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-slate-900 mr-2">{mock.score}/10</span>
                    <div className="flex items-center">
                      {[...Array(10)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-4 h-4 ${i < mock.score ? 'text-amber-400 fill-current' : 'text-slate-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {mock.feedback && (
                  <div className="text-sm text-slate-600 line-clamp-3 mb-3">
                    {mock.feedback}
                  </div>
                )}
                
                {mock.notes && (
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                    {mock.notes}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Behavioral Modal */}
      <AnimatePresence>
        {showBehavioralModal && (
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
                  {editingBehavioral ? 'Edit' : 'Add'} Behavioral Question
                </h3>
                <p className="text-slate-600">Enter the question details below</p>
              </div>
              <form onSubmit={handleBehavioralSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Question</label>
                  <textarea
                    required
                    value={behavioralForm.question}
                    onChange={(e) => setBehavioralForm({ ...behavioralForm, question: e.target.value })}
                    className={`input-field ${(editingBehavioral?.isPreloaded && !isAdmin) ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                    rows={3}
                    placeholder="e.g., Tell me about a time when you had to lead a team through a difficult situation"
                    disabled={editingBehavioral?.isPreloaded && !isAdmin}
                  />
                  {(editingBehavioral?.isPreloaded && !isAdmin) && (
                    <p className="text-sm text-slate-500 mt-1">This is a pre-loaded question and cannot be modified</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      value={behavioralForm.category}
                      onChange={(e) => setBehavioralForm({ ...behavioralForm, category: e.target.value as any })}
                      className={`input-field ${(editingBehavioral?.isPreloaded && !isAdmin) ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                      disabled={editingBehavioral?.isPreloaded && !isAdmin}
                    >
                      <option value="Leadership">Leadership</option>
                      <option value="Teamwork">Teamwork</option>
                      <option value="Problem Solving">Problem Solving</option>
                      <option value="Communication">Communication</option>
                      <option value="Conflict Resolution">Conflict Resolution</option>
                      <option value="General">General</option>
                      <option value="Motivation">Motivation</option>
                      <option value="Experience">Experience</option>
                      <option value="Strengths & Weaknesses">Strengths & Weaknesses</option>
                      <option value="Team Dynamics">Team Dynamics</option>
                      <option value="Challenges">Challenges</option>
                      <option value="Goals">Goals</option>
                      <option value="Personal">Personal</option>
                      <option value="Networking">Networking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                    <select
                      value={behavioralForm.difficulty}
                      onChange={(e) => setBehavioralForm({ ...behavioralForm, difficulty: e.target.value as any })}
                      className={`input-field ${(editingBehavioral?.isPreloaded && !isAdmin) ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                      disabled={editingBehavioral?.isPreloaded && !isAdmin}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Answer (STAR Format)</label>
                  <textarea
                    value={behavioralForm.answer}
                    onChange={(e) => setBehavioralForm({ ...behavioralForm, answer: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Situation, Task, Action, Result..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={behavioralForm.notes}
                    onChange={(e) => setBehavioralForm({ ...behavioralForm, notes: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="Additional notes or tips"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowBehavioralModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingBehavioral ? 'Update' : 'Add'} Question
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technical Modal */}
      <AnimatePresence>
        {showTechnicalModal && (
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
                  {editingTechnical ? 'Edit' : 'Add'} Technical Question
                </h3>
                <p className="text-slate-600">Enter the question details below</p>
              </div>
              <form onSubmit={handleTechnicalSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Question</label>
                  <textarea
                    required
                    value={technicalForm.question}
                    onChange={(e) => setTechnicalForm({ ...technicalForm, question: e.target.value })}
                    className={`input-field ${(editingTechnical?.isPreloaded && !isAdmin) ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                    rows={3}
                    placeholder="e.g., Walk me through a DCF valuation"
                    disabled={editingTechnical?.isPreloaded && !isAdmin}
                  />
                  {(editingTechnical?.isPreloaded && !isAdmin) && (
                    <p className="text-sm text-slate-500 mt-1">This is a pre-loaded question and cannot be modified</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      value={technicalForm.category}
                      onChange={(e) => setTechnicalForm({ ...technicalForm, category: e.target.value as any })}
                      className={`input-field ${(editingTechnical?.isPreloaded && !isAdmin) ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                      disabled={editingTechnical?.isPreloaded && !isAdmin}
                    >
                      <option value="Valuation">Valuation</option>
                      <option value="Financial Modeling">Financial Modeling</option>
                      <option value="Accounting">Accounting</option>
                      <option value="M&A">M&A</option>
                      <option value="LBO">LBO</option>
                      <option value="Market Sizing">Market Sizing</option>
                      <option value="Other">Other</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                    <select
                      value={technicalForm.difficulty}
                      onChange={(e) => setTechnicalForm({ ...technicalForm, difficulty: e.target.value as any })}
                      className={`input-field ${(editingTechnical?.isPreloaded && !isAdmin) ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                      disabled={editingTechnical?.isPreloaded && !isAdmin}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Answer</label>
                  <textarea
                    value={technicalForm.answer}
                    onChange={(e) => setTechnicalForm({ ...technicalForm, answer: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Step-by-step explanation..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={technicalForm.notes}
                    onChange={(e) => setTechnicalForm({ ...technicalForm, notes: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="Key formulas, tips, or common mistakes"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowTechnicalModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingTechnical ? 'Update' : 'Add'} Question
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock Interview Modal */}
      <AnimatePresence>
        {showMockModal && (
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
                  {editingMock ? 'Edit' : 'Schedule'} Mock Interview
                </h3>
                <p className="text-slate-600">Enter the interview details below</p>
              </div>
              <form onSubmit={handleMockSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Interviewer</label>
                  <input
                    type="text"
                    required
                    value={mockForm.interviewer}
                    onChange={(e) => setMockForm({ ...mockForm, interviewer: e.target.value })}
                    className="input-field"
                    placeholder="e.g., John Smith"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                    <input
                      type="datetime-local"
                      required
                      value={mockForm.date}
                      onChange={(e) => setMockForm({ ...mockForm, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                    <select
                      value={mockForm.type}
                      onChange={(e) => setMockForm({ ...mockForm, type: e.target.value as any })}
                      className="input-field"
                    >
                      <option value="Behavioral">Behavioral</option>
                      <option value="Technical">Technical</option>
                      <option value="Case Study">Case Study</option>
                      <option value="Fit">Fit</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Score (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={mockForm.score}
                    onChange={(e) => setMockForm({ ...mockForm, score: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Feedback</label>
                  <textarea
                    value={mockForm.feedback}
                    onChange={(e) => setMockForm({ ...mockForm, feedback: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Interviewer feedback and areas for improvement"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={mockForm.notes}
                    onChange={(e) => setMockForm({ ...mockForm, notes: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="Your own notes and takeaways"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowMockModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-success">
                    {editingMock ? 'Update' : 'Schedule'} Interview
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