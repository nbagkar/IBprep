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
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

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

  const [resourceFormData, setResourceFormData] = useState({
    name: '',
    category: '',
    url: '',
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
    
    if (editingResource) {
      updateResource(editingResource.id, resourceFormData)
      toast.success('Resource updated!')
    } else {
      addResource(resourceFormData)
      toast.success('Resource added!')
    }
    
    setShowResourceModal(false)
    setEditingResource(null)
    setResourceFormData({
      name: '',
      category: '',
      url: '',
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

  const filteredResources = resources.filter(resource => 
    filterCategory === 'all' || resource.category === filterCategory
  )

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
        <p className="mt-2 text-gray-600">Manage your study materials and networking contacts</p>
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

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Study Resources</h2>
            <button
              onClick={() => setShowResourceModal(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Resource
            </button>
          </div>

          {/* Filters */}
          <div className="card">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field w-auto"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <DocumentIcon className="w-8 h-8 text-primary-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">{resource.name}</h3>
                      <p className="text-sm text-gray-500">{resource.category}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingResource(resource)
                        setResourceFormData({
                          name: resource.name,
                          category: resource.category,
                          url: resource.url || '',
                          notes: resource.notes
                        })
                        setShowResourceModal(true)
                      }}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteResource(resource.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 mb-2"
                  >
                    <LinkIcon className="w-4 h-4 mr-1" />
                    Open Resource
                  </a>
                )}
                
                {resource.notes && (
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {resource.notes}
                  </p>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Added: {new Date(resource.addedDate).toLocaleDateString()}
                </p>
              </div>
            ))}
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
      {showResourceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <form onSubmit={handleResourceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resource Name</label>
                  <input
                    type="text"
                    required
                    value={resourceFormData.name}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    required
                    value={resourceFormData.category}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL (Optional)</label>
                  <input
                    type="url"
                    value={resourceFormData.url}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, url: e.target.value })}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={resourceFormData.notes}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Description or key points about this resource"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResourceModal(false)
                      setEditingResource(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingResource ? 'Update' : 'Add'} Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
    </div>
  )
} 