'use client'

import React, { useState } from 'react'
import { useAppStore, type Resource, type Contact } from '@/lib/store'
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
  EyeIcon
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
    addContact,
    updateContact,
    deleteContact
  } = useAppStore()

  const [activeTab, setActiveTab] = useState('resources')
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
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
      notes: resourceFormData.notes
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

  const filteredResources = resources.filter(resource => {
    const matchesType = filterType === 'all' || resource.type === filterType
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  const tabs = [
    { id: 'resources', name: 'Resources', icon: DocumentIcon },
    { id: 'contacts', name: 'Contacts', icon: UserIcon },
    { id: 'reference', name: 'Quick Reference', icon: BookmarkIcon },
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

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Study Resources</h2>
          </div>

          {/* Resources Grid */}
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
                    <div className={`p-3 bg-gradient-to-r ${getTypeColor(resource.type)} rounded-2xl`}>
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
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

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          <span>1.2k views</span>
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 mr-1" />
                          <span>4.5</span>
                        </div>
                      </div>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost text-sm"
                        >
                          Open
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No resources found. Add your first resource!</p>
            </div>
          )}
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Networking Contacts</h2>
            <button
              onClick={() => setShowContactModal(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Contact
            </button>
          </div>

          <div className="grid gap-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.title} at {contact.company}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                    {contact.phone && <p className="text-sm text-gray-500">{contact.phone}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingContact(contact)
                        setContactFormData({
                          name: contact.name,
                          title: contact.title,
                          company: contact.company,
                          email: contact.email,
                          phone: contact.phone || '',
                          notes: contact.notes,
                          lastContact: contact.lastContact,
                          followUpDate: contact.followUpDate || ''
                        })
                        setShowContactModal(true)
                      }}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {contact.notes && (
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-2">
                    {contact.notes}
                  </p>
                )}
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Last Contact: {new Date(contact.lastContact).toLocaleDateString()}</span>
                  {contact.followUpDate && (
                    <span>Follow-up: {new Date(contact.followUpDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
            
            {contacts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No contacts yet. Add your first networking contact!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Reference Tab */}
      {activeTab === 'reference' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Quick Reference</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(quickReferenceData).map(([category, formulas]) => (
              <div key={category} className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
                <div className="space-y-3">
                  {formulas.map((formula, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 font-mono">{formula}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resource Modal */}
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
                    rows={3}
                    placeholder="Additional notes about the resource"
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

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      required
                      value={contactFormData.name}
                      onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={contactFormData.title}
                      onChange={(e) => setContactFormData({ ...contactFormData, title: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    required
                    value={contactFormData.company}
                    onChange={(e) => setContactFormData({ ...contactFormData, company: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={contactFormData.email}
                      onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={contactFormData.phone}
                      onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={contactFormData.notes}
                    onChange={(e) => setContactFormData({ ...contactFormData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="How you met, key topics discussed, etc."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Contact</label>
                    <input
                      type="date"
                      value={contactFormData.lastContact}
                      onChange={(e) => setContactFormData({ ...contactFormData, lastContact: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
                    <input
                      type="date"
                      value={contactFormData.followUpDate}
                      onChange={(e) => setContactFormData({ ...contactFormData, followUpDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowContactModal(false)
                      setEditingContact(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingContact ? 'Update' : 'Add'} Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
} 