'use client'

import React, { useState } from 'react'
import { useAppStore, type Firm, type CoffeeChat } from '@/lib/store'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function FirmTracker() {
  const { firms, coffeeChats, addFirm, updateFirm, deleteFirm, addCoffeeChat } = useAppStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [editingFirm, setEditingFirm] = useState<Firm | null>(null)
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [formData, setFormData] = useState({
    name: '',
    division: '',
    location: '',
    status: 'Applied' as Firm['status'],
    deadline: '',
    keyContacts: '',
    notes: '',
    appliedDate: ''
  })

  const [chatFormData, setChatFormData] = useState({
    contactName: '',
    contactTitle: '',
    scheduledDate: '',
    notes: '',
    outcome: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingFirm) {
      updateFirm(editingFirm.id, formData)
      toast.success('Firm updated successfully!')
    } else {
      addFirm(formData)
      toast.success('Firm added successfully!')
    }
    
    setShowAddModal(false)
    setEditingFirm(null)
    setFormData({
      name: '',
      division: '',
      location: '',
      status: 'Applied',
      deadline: '',
      keyContacts: '',
      notes: '',
      appliedDate: ''
    })
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedFirm) {
      addCoffeeChat({
        firmId: selectedFirm.id,
        ...chatFormData,
        completed: false
      })
      toast.success('Coffee chat scheduled!')
    }
    
    setShowChatModal(false)
    setSelectedFirm(null)
    setChatFormData({
      contactName: '',
      contactTitle: '',
      scheduledDate: '',
      notes: '',
      outcome: ''
    })
  }

  const handleEdit = (firm: Firm) => {
    setEditingFirm(firm)
    setFormData({
      name: firm.name,
      division: firm.division,
      location: firm.location,
      status: firm.status,
      deadline: firm.deadline || '',
      keyContacts: firm.keyContacts,
      notes: firm.notes,
      appliedDate: firm.appliedDate || ''
    })
    setShowAddModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this firm?')) {
      deleteFirm(id)
      toast.success('Firm deleted successfully!')
    }
  }

  const filteredFirms = firms.filter(firm => 
    filterStatus === 'all' || firm.status === filterStatus
  )

  const getStatusColor = (status: Firm['status']) => {
    switch (status) {
      case 'Applied': return 'status-applied'
      case 'Interviewing': return 'status-interviewing'
      case 'Offer': return 'status-offer'
      case 'Rejected': return 'status-rejected'
      default: return 'status-applied'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Firm Tracker</h1>
          <p className="mt-2 text-gray-600">Track your applications and manage firm relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Firm
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Firms Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Firm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFirms.map((firm) => (
                <tr key={firm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{firm.name}</div>
                      <div className="text-sm text-gray-500">{firm.keyContacts}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {firm.division}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {firm.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${getStatusColor(firm.status)}`}>
                      {firm.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {firm.deadline ? new Date(firm.deadline).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(firm)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFirm(firm)
                          setShowChatModal(true)
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Schedule Coffee Chat"
                      >
                        <UserIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(firm.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFirms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No firms found. Add your first firm to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Firm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingFirm ? 'Edit Firm' : 'Add New Firm'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Firm Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Division</label>
                    <input
                      type="text"
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Firm['status'] })}
                      className="input-field"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Key Contacts</label>
                  <input
                    type="text"
                    value={formData.keyContacts}
                    onChange={(e) => setFormData({ ...formData, keyContacts: e.target.value })}
                    className="input-field"
                    placeholder="Names, titles, emails"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Additional notes about the firm or application"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingFirm(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingFirm ? 'Update' : 'Add'} Firm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Coffee Chat Modal */}
      {showChatModal && selectedFirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Schedule Coffee Chat - {selectedFirm.name}
              </h3>
              <form onSubmit={handleChatSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={chatFormData.contactName}
                    onChange={(e) => setChatFormData({ ...chatFormData, contactName: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Title</label>
                  <input
                    type="text"
                    value={chatFormData.contactTitle}
                    onChange={(e) => setChatFormData({ ...chatFormData, contactTitle: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={chatFormData.scheduledDate}
                    onChange={(e) => setChatFormData({ ...chatFormData, scheduledDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={chatFormData.notes}
                    onChange={(e) => setChatFormData({ ...chatFormData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Topics to discuss, questions to ask"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowChatModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-success">
                    Schedule Chat
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