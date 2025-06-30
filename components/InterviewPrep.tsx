'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore, type BehavioralQuestion, type TechnicalQuestion, type DealExperience, type MockInterview } from '@/lib/store'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PlayIcon,
  PauseIcon,
  StopIcon,
  ClockIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function InterviewPrep() {
  const { 
    behavioralQuestions, 
    technicalQuestions, 
    dealExperiences, 
    mockInterviews,
    addBehavioralQuestion,
    updateBehavioralQuestion,
    deleteBehavioralQuestion,
    addTechnicalQuestion,
    updateTechnicalQuestion,
    deleteTechnicalQuestion,
    addDealExperience,
    updateDealExperience,
    deleteDealExperience,
    addMockInterview
  } = useAppStore()

  const [activeTab, setActiveTab] = useState('behavioral')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'behavioral' | 'technical' | 'deal' | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [mockTimer, setMockTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showMockInterview, setShowMockInterview] = useState(false)

  const [formData, setFormData] = useState({
    question: '',
    response: '',
    category: '',
    answer: '',
    difficulty: 'Medium' as TechnicalQuestion['difficulty'],
    company: '',
    dealType: '',
    dealSize: '',
    role: '',
    description: '',
    keyLearnings: '',
    date: ''
  })

  // Mock interview questions
  const mockQuestions = [
    "Walk me through your resume",
    "Why investment banking?",
    "Why this firm?",
    "Tell me about a time you worked in a team",
    "What's your greatest strength and weakness?",
    "Walk me through a DCF",
    "What's the difference between EV and equity value?",
    "How would you value a company?",
    "Tell me about a recent M&A deal",
    "What's happening in the markets today?"
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setMockTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (modalType === 'behavioral') {
      if (editingItem) {
        updateBehavioralQuestion(editingItem.id, {
          question: formData.question,
          response: formData.response,
          category: formData.category
        })
        toast.success('Question updated!')
      } else {
        addBehavioralQuestion({
          question: formData.question,
          response: formData.response,
          category: formData.category
        })
        toast.success('Question added!')
      }
    } else if (modalType === 'technical') {
      if (editingItem) {
        updateTechnicalQuestion(editingItem.id, {
          question: formData.question,
          answer: formData.answer,
          category: formData.category as TechnicalQuestion['category'],
          difficulty: formData.difficulty
        })
        toast.success('Question updated!')
      } else {
        addTechnicalQuestion({
          question: formData.question,
          answer: formData.answer,
          category: formData.category as TechnicalQuestion['category'],
          difficulty: formData.difficulty
        })
        toast.success('Question added!')
      }
    } else if (modalType === 'deal') {
      if (editingItem) {
        updateDealExperience(editingItem.id, {
          company: formData.company,
          dealType: formData.dealType,
          dealSize: formData.dealSize,
          role: formData.role,
          description: formData.description,
          keyLearnings: formData.keyLearnings,
          date: formData.date
        })
        toast.success('Deal experience updated!')
      } else {
        addDealExperience({
          company: formData.company,
          dealType: formData.dealType,
          dealSize: formData.dealSize,
          role: formData.role,
          description: formData.description,
          keyLearnings: formData.keyLearnings,
          date: formData.date
        })
        toast.success('Deal experience added!')
      }
    }
    
    setShowModal(false)
    setEditingItem(null)
    setFormData({
      question: '',
      response: '',
      category: '',
      answer: '',
      difficulty: 'Medium',
      company: '',
      dealType: '',
      dealSize: '',
      role: '',
      description: '',
      keyLearnings: '',
      date: ''
    })
  }

  const startMockInterview = () => {
    setShowMockInterview(true)
    setMockTimer(0)
    setCurrentQuestion(0)
    setIsTimerRunning(true)
  }

  const stopMockInterview = () => {
    setIsTimerRunning(false)
    setShowMockInterview(false)
    
    // Save mock interview
    addMockInterview({
      date: new Date().toISOString(),
      duration: mockTimer,
      questions: mockQuestions.slice(0, currentQuestion + 1),
      notes: '',
      performance: 'Good'
    })
    
    toast.success('Mock interview completed!')
  }

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const tabs = [
    { id: 'behavioral', name: 'Behavioral Q&A', icon: DocumentTextIcon },
    { id: 'technical', name: 'Technical Q&A', icon: AcademicCapIcon },
    { id: 'deals', name: 'Deal Experience', icon: BriefcaseIcon },
    { id: 'mock', name: 'Mock Interview', icon: ClockIcon },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Interview Prep Center</h1>
        <p className="mt-2 text-gray-600">Prepare for behavioral and technical interviews</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Behavioral Q&A */}
      {activeTab === 'behavioral' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Behavioral Questions</h2>
            <button
              onClick={() => {
                setModalType('behavioral')
                setShowModal(true)
              }}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Question
            </button>
          </div>
          
          <div className="grid gap-4">
            {behavioralQuestions.map((question) => (
              <div key={question.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{question.question}</h3>
                    <p className="text-sm text-gray-500">{question.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(question)
                        setFormData({
                          question: question.question,
                          response: question.response,
                          category: question.category,
                          answer: '',
                          difficulty: 'Medium',
                          company: '',
                          dealType: '',
                          dealSize: '',
                          role: '',
                          description: '',
                          keyLearnings: '',
                          date: ''
                        })
                        setModalType('behavioral')
                        setShowModal(true)
                      }}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBehavioralQuestion(question.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{question.response}</p>
                </div>
              </div>
            ))}
            
            {behavioralQuestions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No behavioral questions yet. Add your first question!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technical Q&A */}
      {activeTab === 'technical' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Technical Questions</h2>
            <button
              onClick={() => {
                setModalType('technical')
                setShowModal(true)
              }}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Question
            </button>
          </div>
          
          <div className="grid gap-4">
            {technicalQuestions.map((question) => (
              <div key={question.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{question.question}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">{question.category}</span>
                      <span className={`status-badge ${
                        question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(question)
                        setFormData({
                          question: question.question,
                          response: '',
                          category: question.category,
                          answer: question.answer,
                          difficulty: question.difficulty,
                          company: '',
                          dealType: '',
                          dealSize: '',
                          role: '',
                          description: '',
                          keyLearnings: '',
                          date: ''
                        })
                        setModalType('technical')
                        setShowModal(true)
                      }}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTechnicalQuestion(question.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{question.answer}</p>
                </div>
              </div>
            ))}
            
            {technicalQuestions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No technical questions yet. Add your first question!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deal Experience */}
      {activeTab === 'deals' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Deal Experience</h2>
            <button
              onClick={() => {
                setModalType('deal')
                setShowModal(true)
              }}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Deal
            </button>
          </div>
          
          <div className="grid gap-4">
            {dealExperiences.map((deal) => (
              <div key={deal.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{deal.company}</h3>
                    <p className="text-sm text-gray-500">{deal.dealType} • {deal.dealSize}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(deal)
                        setFormData({
                          question: '',
                          response: '',
                          category: '',
                          answer: '',
                          difficulty: 'Medium',
                          company: deal.company,
                          dealType: deal.dealType,
                          dealSize: deal.dealSize,
                          role: deal.role,
                          description: deal.description,
                          keyLearnings: deal.keyLearnings,
                          date: deal.date
                        })
                        setModalType('deal')
                        setShowModal(true)
                      }}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteDealExperience(deal.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700"><strong>Role:</strong> {deal.role}</p>
                  <p className="text-sm text-gray-700"><strong>Description:</strong> {deal.description}</p>
                  <p className="text-sm text-gray-700"><strong>Key Learnings:</strong> {deal.keyLearnings}</p>
                </div>
              </div>
            ))}
            
            {dealExperiences.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No deal experiences yet. Add your first deal!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mock Interview */}
      {activeTab === 'mock' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Mock Interview Practice</h2>
            <button
              onClick={startMockInterview}
              className="btn-primary flex items-center"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Start Mock Interview
            </button>
          </div>

          {showMockInterview ? (
            <div className="card">
              <div className="text-center mb-6">
                <div className="text-4xl font-mono font-bold text-primary-600 mb-4">
                  {formatTime(mockTimer)}
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="btn-secondary flex items-center"
                  >
                    {isTimerRunning ? <PauseIcon className="w-4 h-4 mr-2" /> : <PlayIcon className="w-4 h-4 mr-2" />}
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={stopMockInterview}
                    className="btn-danger flex items-center"
                  >
                    <StopIcon className="w-4 h-4 mr-2" />
                    End Interview
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Question {currentQuestion + 1} of {mockQuestions.length}
                </h3>
                <p className="text-gray-700">{mockQuestions[currentQuestion]}</p>
              </div>

              {currentQuestion < mockQuestions.length - 1 && (
                <button
                  onClick={nextQuestion}
                  className="btn-primary"
                >
                  Next Question
                </button>
              )}
            </div>
          ) : (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mock Interview Instructions</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Click "Start Mock Interview" to begin</li>
                <li>• Answer each question as you would in a real interview</li>
                <li>• Use the timer to practice time management</li>
                <li>• You can pause and resume the timer</li>
                <li>• Click "Next Question" when ready to proceed</li>
                <li>• End the interview when finished</li>
              </ul>
            </div>
          )}

          {/* Recent Mock Interviews */}
          {mockInterviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Mock Interviews</h3>
              <div className="grid gap-4">
                {mockInterviews.slice(0, 5).map((interview) => (
                  <div key={interview.id} className="card">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(interview.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {formatTime(interview.duration)} • Questions: {interview.questions.length}
                        </p>
                      </div>
                      <span className={`status-badge ${
                        interview.performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                        interview.performance === 'Good' ? 'bg-blue-100 text-blue-800' :
                        interview.performance === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {interview.performance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit' : 'Add'} {modalType === 'behavioral' ? 'Behavioral Question' : 
                modalType === 'technical' ? 'Technical Question' : 'Deal Experience'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {modalType === 'behavioral' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Question</label>
                      <textarea
                        required
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        className="input-field"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Leadership, Teamwork, Problem Solving"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Your Response</label>
                      <textarea
                        required
                        value={formData.response}
                        onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                        className="input-field"
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {modalType === 'technical' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Question</label>
                      <textarea
                        required
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        className="input-field"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="input-field"
                        >
                          <option value="">Select Category</option>
                          <option value="Valuation">Valuation</option>
                          <option value="Accounting">Accounting</option>
                          <option value="DCF">DCF</option>
                          <option value="LBO">LBO</option>
                          <option value="Market Sizing">Market Sizing</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                        <select
                          value={formData.difficulty}
                          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as TechnicalQuestion['difficulty'] })}
                          className="input-field"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Answer</label>
                      <textarea
                        required
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        className="input-field"
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {modalType === 'deal' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Deal Type</label>
                        <input
                          type="text"
                          required
                          value={formData.dealType}
                          onChange={(e) => setFormData({ ...formData, dealType: e.target.value })}
                          className="input-field"
                          placeholder="e.g., M&A, IPO, LBO"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Deal Size</label>
                        <input
                          type="text"
                          value={formData.dealSize}
                          onChange={(e) => setFormData({ ...formData, dealSize: e.target.value })}
                          className="input-field"
                          placeholder="e.g., $500M"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Your Role</label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="input-field"
                          placeholder="e.g., Analyst, Associate"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deal Description</label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input-field"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Key Learnings</label>
                      <textarea
                        value={formData.keyLearnings}
                        onChange={(e) => setFormData({ ...formData, keyLearnings: e.target.value })}
                        className="input-field"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingItem(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingItem ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 