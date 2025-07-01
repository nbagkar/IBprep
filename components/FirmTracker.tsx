'use client'

import React, { useState } from 'react'
import { useAppStore, type Firm, type CoffeeChat } from '@/lib/store'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

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
      case 'Researching': return 'status-researching'
      case 'Applied': return 'status-applied'
      case 'Interviewing': return 'status-interviewing'
      case 'Offer': return 'status-offer'
      case 'Rejected': return 'status-rejected'
      default: return 'status-applied'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-gradient"
          >
            Trackers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-lg text-slate-600"
          >
            Track your applications, firm relationships, and coffee chats
          </motion.p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center group"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
          Add Firm
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold text-slate-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="Researching">Researching</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </motion.div>

      {/* Firms Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th className="table-header">Firm</th>
                <th className="table-header">Division</th>
                <th className="table-header">Location</th>
                <th className="table-header">Status</th>
                <th className="table-header">Deadline</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFirms.map((firm, index) => (
                <motion.tr 
                  key={firm.id} 
                  className="table-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mr-3">
                        <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{firm.name}</div>
                        <div className="text-sm text-slate-500">{firm.keyContacts}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <BriefcaseIcon className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-900">{firm.division}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-900">{firm.location}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`status-badge ${getStatusColor(firm.status)}`}>
                      {firm.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-900">
                        {firm.deadline ? new Date(firm.deadline).toLocaleDateString() : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(firm)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Firm"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFirm(firm)
                          setShowChatModal(true)
                        }}
                        className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                        title="Schedule Coffee Chat"
                      >
                        <UserIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(firm.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Firm"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredFirms.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BuildingOfficeIcon className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg font-medium">No firms found</p>
              <p className="text-slate-400 text-sm mt-2">Add your first firm to get started!</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Coffee Chat Tracker Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card mt-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Coffee Chat Tracker</h2>
          <button
            onClick={() => setShowChatModal(true)}
            className="btn-primary flex items-center group"
          >
            <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Add Coffee Chat
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">What Was Discussed</th>
                <th className="table-header">Contact Info</th>
                <th className="table-header">Other Questions</th>
                <th className="table-header">Date of Chat</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {coffeeChats.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-slate-500 py-8">
                    No coffee chats found. Add your first coffee chat!
                  </td>
                </tr>
              )}
              {coffeeChats.map((chat, idx) => (
                <tr key={chat.id} className="table-row">
                  <td className="table-cell">{chat.contactName}</td>
                  <td className="table-cell">{chat.notes}</td>
                  <td className="table-cell">{chat.contactTitle}</td>
                  <td className="table-cell">{chat.outcome}</td>
                  <td className="table-cell">{chat.scheduledDate ? new Date(chat.scheduledDate).toLocaleDateString() : '-'}</td>
                  <td className="table-cell">{/* Future: edit/delete actions */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Firm Modal */}
      <AnimatePresence>
        {showAddModal && (
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
                  {editingFirm ? 'Edit Firm' : 'Add New Firm'}
                </h3>
                <p className="text-slate-600">Enter the firm details below</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Firm Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Goldman Sachs"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Division</label>
                    <input
                      type="text"
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Investment Banking"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input-field"
                      placeholder="e.g., New York"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Firm['status'] })}
                      className="input-field"
                    >
                      <option value="Researching">Researching</option>
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Key Contacts</label>
                  <input
                    type="text"
                    value={formData.keyContacts}
                    onChange={(e) => setFormData({ ...formData, keyContacts: e.target.value })}
                    className="input-field"
                    placeholder="Names, titles, emails"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Additional notes about the firm or application"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coffee Chat Modal */}
      <AnimatePresence>
        {showChatModal && selectedFirm && (
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
                  Schedule Coffee Chat
                </h3>
                <p className="text-slate-600">with {selectedFirm.name}</p>
              </div>
              <form onSubmit={handleChatSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={chatFormData.contactName}
                    onChange={(e) => setChatFormData({ ...chatFormData, contactName: e.target.value })}
                    className="input-field"
                    placeholder="e.g., John Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Title</label>
                  <input
                    type="text"
                    value={chatFormData.contactTitle}
                    onChange={(e) => setChatFormData({ ...chatFormData, contactTitle: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Vice President"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={chatFormData.scheduledDate}
                    onChange={(e) => setChatFormData({ ...chatFormData, scheduledDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={chatFormData.notes}
                    onChange={(e) => setChatFormData({ ...chatFormData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Topics to discuss, questions to ask"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 