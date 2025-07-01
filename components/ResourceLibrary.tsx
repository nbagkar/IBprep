'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore, type Resource, type Contact } from '@/lib/store'
import { FirebaseService } from '@/lib/firebaseService'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  DocumentIcon,
  UserIcon,
  BookmarkIcon,
  LinkIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  BookOpenIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  CalendarIcon,
  TagIcon,
  StarIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  PlayIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function ResourceLibrary() {
  const { 
    resources, 
    contacts, 
    addResource, 
    updateResource, 
    deleteResource,
    loadResources,
    resourcesLoading,
    resourcesError,
    user,
    userLoading,
    addContact,
    updateContact,
    deleteContact
  } = useAppStore()

  // Load resources on component mount
  useEffect(() => {
    loadResources()
  }, [loadResources])

  // Show error toast if there's an error
  useEffect(() => {
    if (resourcesError) {
      toast.error(resourcesError)
    }
  }, [resourcesError])

  const [activeTab, setActiveTab] = useState<'resources' | 'upload' | 'viewer'>('resources')
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    type: 'Document' as Resource['type'],
    category: 'Valuation' as Resource['category'],
    url: '',
    description: '',
    tags: '', // comma-separated string for the form
    notes: ''
  })

  const [contactFormData, setContactFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
    lastContact: '',
    followUpDate: ''
  })

  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    category: 'Valuation' as Resource['category'],
    description: '',
    tags: '',
    notes: '',
    file: null as File | null
  })

  const [isUploading, setIsUploading] = useState(false)

  const categories = [
    'WSO Guides',
    'Study Notes',
    'Valuation Models',
    'Case Studies',
    'Interview Prep',
    'Market Research',
    'Other'
  ]

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const resourceData = {
      title: resourceFormData.title,
      type: resourceFormData.type,
      category: resourceFormData.category,
      url: resourceFormData.url,
      description: resourceFormData.description,
      tags: resourceFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      notes: resourceFormData.notes,
      createdBy: null
    }
    if (editingResource) {
      updateResource(editingResource.id, resourceData)
      toast.success('Resource updated!')
    } else {
      addResource(resourceData)
      toast.success('Resource added!')
    }
    setShowResourceModal(false)
    setEditingResource(null)
    setResourceFormData({
      title: '',
      type: 'Document',
      category: 'Valuation',
      url: '',
      description: '',
      tags: '',
      notes: ''
    })
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingContact) {
      updateContact(editingContact.id, contactFormData)
      toast.success('Contact updated!')
    } else {
      addContact({
        ...contactFormData,
        lastContact: contactFormData.lastContact || new Date().toISOString()
      })
      toast.success('Contact added!')
    }
    
    setShowContactModal(false)
    setEditingContact(null)
    setContactFormData({
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      notes: '',
      lastContact: '',
      followUpDate: ''
    })
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uploadFormData.file) {
      toast.error('Please select a file to upload')
      return
    }

    setIsUploading(true)

    try {
      // Generate unique filename
      const fileName = FirebaseService.generateFileName(uploadFormData.file.name)
      
      // Upload file to Firebase Storage
      const downloadURL = await FirebaseService.uploadFile(uploadFormData.file, fileName)
      
      // Create resource data
      const resourceData = {
        title: uploadFormData.title,
        type: 'Document' as Resource['type'],
        category: uploadFormData.category,
        url: downloadURL,
        description: uploadFormData.description,
        tags: uploadFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        notes: uploadFormData.notes,
        createdBy: null
      }
      
      // Add resource to Firebase
      await addResource(resourceData)
      
      toast.success('Document uploaded successfully!')
      
      setShowUploadModal(false)
      setUploadFormData({
        title: '',
        category: 'Valuation',
        description: '',
        tags: '',
        notes: '',
        file: null
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 50MB for Firebase Storage)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 50MB')
        e.target.value = ''
        return
      }
      
      setUploadFormData({ ...uploadFormData, file })
    }
  }

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource)
    setShowViewer(true)
    setActiveTab('viewer')
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      deleteResource(id)
      toast.success('Resource deleted successfully!')
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesType = filterType === 'all' || resource.type === filterType
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  const tabs = [
    { id: 'resources', name: 'Resources', icon: DocumentIcon },
    { id: 'upload', name: 'Upload Documents', icon: ArrowUpTrayIcon },
  ]

  const quickReferenceData = {
    'Valuation Formulas': [
      'EV = Market Cap + Net Debt + Minority Interest + Preferred Stock',
      'Equity Value = EV - Net Debt',
      'P/E Ratio = Price per Share / Earnings per Share',
      'EV/EBITDA = Enterprise Value / EBITDA',
      'DCF = Sum of Future Cash Flows / (1 + Discount Rate)^n'
    ],
    'Accounting Concepts': [
      'Assets = Liabilities + Shareholders\' Equity',
      'EBITDA = EBIT + Depreciation + Amortization',
      'Free Cash Flow = EBIT(1-tax rate) + Depreciation - CapEx - Change in NWC',
      'Working Capital = Current Assets - Current Liabilities',
      'ROE = Net Income / Shareholders\' Equity'
    ],
    'LBO Key Metrics': [
      'IRR = Internal Rate of Return',
      'MOIC = Multiple of Invested Capital',
      'Exit Multiple = Exit Value / EBITDA',
      'Debt/EBITDA = Total Debt / EBITDA',
      'Interest Coverage = EBIT / Interest Expense'
    ]
  }

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'Document': return DocumentTextIcon
      case 'Video': return VideoCameraIcon
      case 'Book': return BookOpenIcon
      case 'Link': return LinkIcon
      default: return DocumentIcon
    }
  }

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'Document': return 'from-blue-500 to-indigo-600'
      case 'Video': return 'from-purple-500 to-indigo-600'
      case 'Book': return 'from-emerald-500 to-teal-600'
      case 'Link': return 'from-amber-500 to-orange-600'
      default: return 'from-slate-500 to-gray-600'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = [
      'from-blue-100 to-indigo-100',
      'from-emerald-100 to-teal-100',
      'from-purple-100 to-indigo-100',
      'from-amber-100 to-orange-100',
      'from-rose-100 to-pink-100'
    ]
    return colors[Math.abs(category.length) % colors.length]
  }

  const resourceTypes = [
    { id: 'all', name: 'All Types', count: resources.length },
    { id: 'Document', name: 'Documents', count: resources.filter(r => r.type === 'Document').length },
    { id: 'Video', name: 'Videos', count: resources.filter(r => r.type === 'Video').length },
    { id: 'Book', name: 'Books', count: resources.filter(r => r.type === 'Book').length },
    { id: 'Link', name: 'Links', count: resources.filter(r => r.type === 'Link').length }
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
          Resource Library
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600"
        >
          Access comprehensive materials for investment banking preparation
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search Resources</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by title, description, or tags..."
              />
              <AcademicCapIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div className="lg:w-64">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              {resourceTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Add Resource Button */}
      {user && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <button
            onClick={() => setShowResourceModal(true)}
            className="btn-primary flex items-center group"
          >
            <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Add Resource
          </button>
        </motion.div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Study Resources</h2>
          </div>

          {/* Loading State */}
          {resourcesLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading resources from Firebase...</p>
            </div>
          )}

          {/* Resources Grid */}
          {!resourcesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type)
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-hover group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`p-3 bg-gradient-to-r ${getTypeColor(resource.type)} rounded-2xl`}>
                          <TypeIcon className="w-6 h-6 text-white" />
                        </div>
                        {resource.createdBy?.uid === user?.uid && (
                          <div className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Yours
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {resource.createdBy?.uid === user?.uid && (
                          <>
                            <button
                              onClick={() => {
                                setEditingResource(resource)
                                setResourceFormData({
                                  title: resource.title,
                                  type: resource.type,
                                  category: resource.category,
                                  url: resource.url || '',
                                  description: resource.description,
                                  tags: resource.tags.join(','),
                                  notes: resource.description
                                })
                                setShowResourceModal(true)
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit Resource"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteResource(resource.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete Resource"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {resource.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center">
                          <TagIcon className="w-4 h-4 mr-1" />
                          <span className="capitalize">{resource.type}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                        </div>
                        {resource.url && resource.url.startsWith('data:') && (
                          <div className="flex items-center">
                            <DocumentIcon className="w-4 h-4 mr-1" />
                            <span className="text-xs">
                              {(() => {
                                const fileType = resource.url.split(';')[0].split(':')[1]
                                if (fileType === 'application/pdf') return 'PDF'
                                if (fileType.startsWith('image/')) return 'Image'
                                if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'Excel'
                                if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'PPT'
                                if (fileType.includes('document') || fileType.includes('word')) return 'Word'
                                if (fileType.includes('text/plain')) return 'Text'
                                if (fileType.includes('text/csv')) return 'CSV'
                                return 'File'
                              })()}
                            </span>
                          </div>
                        )}
                        {resource.url && resource.url.startsWith('https://firebasestorage.googleapis.com') && (
                          <div className="flex items-center">
                            <CloudArrowUpIcon className="w-4 h-4 mr-1 text-green-500" />
                            <span className="text-xs text-green-600">Firebase</span>
                          </div>
                        )}
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(resource.category)} text-slate-700 w-fit`}>
                        {resource.category}
                      </div>

                      {resource.description && (
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {resource.description}
                        </p>
                      )}

                      {resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {resource.tags.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                              +{resource.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {resource.createdBy && (
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          {resource.createdBy.photoURL && (
                            <img src={resource.createdBy.photoURL} alt="avatar" className="w-5 h-5 rounded-full" />
                          )}
                          <span>Added by {resource.createdBy.displayName || resource.createdBy.email}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          {resource.url && (
                            <>
                              <button
                                onClick={() => handleViewResource(resource)}
                                className="btn-ghost text-sm"
                              >
                                View
                              </button>
                              {!resource.url.startsWith('data:') && (
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-ghost text-sm"
                                >
                                  Open
                                </a>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {!resourcesLoading && filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No resources found. Add your first resource!</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Documents</h2>
            <p className="text-slate-600">Upload your study materials and documents</p>
          </div>
          
          {/* Storage Usage Indicator */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Firebase Storage</span>
              <span className="text-sm text-slate-500">
                {resources.filter(r => r.url?.startsWith('https://firebasestorage.googleapis.com')).length} files
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((resources.filter(r => r.url?.startsWith('https://firebasestorage.googleapis.com')).length / 100) * 100, 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Up to 5GB free storage • 50MB per file limit
            </p>
          </div>
          
          {user ? (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center mx-auto group"
            >
              <ArrowUpTrayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Upload New Document
            </button>
          ) : (
            <div className="text-center text-slate-500 mt-6">
              <p>You must be signed in to upload documents.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Document Viewer */}
      {activeTab === 'viewer' && selectedResource && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{selectedResource.title}</h2>
            <button
              onClick={() => setActiveTab('resources')}
              className="btn-secondary"
            >
              <XMarkIcon className="w-5 h-5 mr-2" />
              Close
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span>Category: {selectedResource.category}</span>
              <span>Type: {selectedResource.type}</span>
              <span>Added: {new Date(selectedResource.createdAt).toLocaleDateString()}</span>
            </div>
            
            {selectedResource.description && (
              <p className="text-slate-600">{selectedResource.description}</p>
            )}
            
            {selectedResource.url && (
              <div className="border border-slate-200 rounded-xl p-4">
                {selectedResource.type === 'Document' ? (
                  selectedResource.url.startsWith('data:') ? (
                    <div className="space-y-4">
                      {/* File Type Detection and Display */}
                      {(() => {
                        const fileType = selectedResource.url.split(';')[0].split(':')[1]
                        
                        if (fileType === 'application/pdf') {
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">PDF Document</h3>
                                <a
                                  href={selectedResource.url}
                                  download={`${selectedResource.title}.pdf`}
                                  className="btn-secondary text-sm"
                                >
                                  Download PDF
                                </a>
                              </div>
                              <div className="bg-slate-50 rounded-lg overflow-hidden">
                                <iframe
                                  src={selectedResource.url}
                                  className="w-full h-96 md:h-[600px]"
                                  title={selectedResource.title}
                                  style={{ border: 'none' }}
                                />
                              </div>
                            </div>
                          )
                        } else if (fileType.startsWith('image/')) {
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Image</h3>
                                <a
                                  href={selectedResource.url}
                                  download={`${selectedResource.title}.${fileType.split('/')[1]}`}
                                  className="btn-secondary text-sm"
                                >
                                  Download Image
                                </a>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-4">
                                <img
                                  src={selectedResource.url}
                                  alt={selectedResource.title}
                                  className="max-w-full h-auto rounded-lg shadow-sm"
                                />
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <div className="text-center py-12">
                              <DocumentIcon className="w-20 h-20 text-slate-400 mx-auto mb-4" />
                              <h3 className="text-xl font-semibold text-slate-900 mb-2">Document Available</h3>
                              <p className="text-slate-600 mb-6">
                                File type: {fileType}
                              </p>
                              <a
                                href={selectedResource.url}
                                download={`${selectedResource.title}`}
                                className="btn-primary"
                              >
                                Download File
                              </a>
                            </div>
                          )
                        }
                      })()}
                    </div>
                  ) : selectedResource.url.startsWith('https://firebasestorage.googleapis.com') ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Firebase Document</h3>
                        <a
                          href={selectedResource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-sm"
                        >
                          Open in New Tab
                        </a>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <CloudArrowUpIcon className="w-12 h-12 text-green-500" />
                          <div>
                            <p className="font-semibold text-slate-900">Document stored in Firebase</p>
                            <p className="text-sm text-slate-600">Click "Open in New Tab" to view or download</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DocumentIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-4">Document available for download</p>
                      <a
                        href={selectedResource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Download Document
                      </a>
                    </div>
                  )
                ) : selectedResource.type === 'Video' ? (
                  <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                    <PlayIcon className="w-16 h-16 text-slate-400" />
                    <p className="text-slate-500 ml-4">Video Player</p>
                  </div>
                ) : (
                  <a
                    href={selectedResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Open {selectedResource.type}
                  </a>
                )}
              </div>
            )}
            
            {selectedResource.notes && (
              <div className="bg-slate-50 p-4 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
                <p className="text-slate-600">{selectedResource.notes}</p>
              </div>
            )}

            {selectedResource.createdBy && (
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                {selectedResource.createdBy.photoURL && (
                  <img src={selectedResource.createdBy.photoURL} alt="avatar" className="w-5 h-5 rounded-full" />
                )}
                <span>Added by {selectedResource.createdBy.displayName || selectedResource.createdBy.email}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Add/Edit Resource Modal */}
      <AnimatePresence>
        {showResourceModal && (
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
                  {editingResource ? 'Edit' : 'Add'} Resource
                </h3>
                <p className="text-slate-600">Enter the resource details below</p>
              </div>
              <form onSubmit={handleResourceSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={resourceFormData.title}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Investment Banking Interview Guide"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                    <select
                      value={resourceFormData.type}
                      onChange={(e) => setResourceFormData({ ...resourceFormData, type: e.target.value as Resource['type'] })}
                      className="input-field"
                    >
                      <option value="Document">Document</option>
                      <option value="Video">Video</option>
                      <option value="Book">Book</option>
                      <option value="Link">Link</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      value={resourceFormData.category}
                      onChange={(e) => setResourceFormData({ ...resourceFormData, category: e.target.value as Resource['category'] })}
                      className="input-field"
                    >
                      <option value="Valuation">Valuation</option>
                      <option value="Financial Modeling">Financial Modeling</option>
                      <option value="Accounting">Accounting</option>
                      <option value="M&A">M&A</option>
                      <option value="LBO">LBO</option>
                      <option value="Interview Prep">Interview Prep</option>
                      <option value="Networking">Networking</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">URL (Optional)</label>
                  <input
                    type="url"
                    value={resourceFormData.url}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, url: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/resource"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={resourceFormData.description}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Brief description of the resource"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={resourceFormData.tags}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, tags: e.target.value })}
                    className="input-field"
                    placeholder="Comma-separated tags (e.g., valuation, modeling, interview)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={resourceFormData.notes}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, notes: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="Additional notes or personal insights"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowResourceModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingResource ? 'Update' : 'Add'} Resource
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Document Modal */}
      <AnimatePresence>
        {showUploadModal && (
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
                  Upload Document
                </h3>
                <p className="text-slate-600">Upload a document to your resource library</p>
              </div>
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Document Title</label>
                  <input
                    type="text"
                    required
                    value={uploadFormData.title}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., DCF Valuation Model"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    value={uploadFormData.category}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value as Resource['category'] })}
                    className="input-field"
                  >
                    <option value="Valuation">Valuation</option>
                    <option value="Financial Modeling">Financial Modeling</option>
                    <option value="Accounting">Accounting</option>
                    <option value="M&A">M&A</option>
                    <option value="LBO">LBO</option>
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">File</label>
                  <input
                    type="file"
                    required
                    onChange={handleFileChange}
                    className="input-field"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.txt,.csv"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, Images (JPG, PNG, GIF, BMP, TIFF), TXT, CSV
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Maximum file size: 50MB (Firebase Storage)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={uploadFormData.description}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Brief description of the document"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={uploadFormData.tags}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, tags: e.target.value })}
                    className="input-field"
                    placeholder="Comma-separated tags (e.g., valuation, modeling, interview)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={uploadFormData.notes}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, notes: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="Additional notes about the document"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="btn-secondary"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Document'}
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