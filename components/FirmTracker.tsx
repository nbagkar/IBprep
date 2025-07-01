'use client'

import React, { useState, useEffect } from 'react'
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

// Cold Email Tracker Types
const COLD_EMAIL_STATUS = ["Sent", "Replied", "Scheduled Call", "No Response"] as const;
type ColdEmailStatus = typeof COLD_EMAIL_STATUS[number];
interface ColdEmailEntry {
  id: string;
  name: string;
  firm: string;
  role: string;
  email: string;
  linkedin?: string;
  outreachDate: string;
  followUpDate?: string;
  status: ColdEmailStatus;
  notes: string;
  tags: string[];
}

function getDefaultFollowUpDate(outreachDate: string) {
  const d = new Date(outreachDate);
  d.setDate(d.getDate() + 5);
  return d.toISOString().split('T')[0];
}

function loadColdEmails(): ColdEmailEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('coldEmailTracker');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function saveColdEmails(entries: ColdEmailEntry[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('coldEmailTracker', JSON.stringify(entries));
  }
}

export default function FirmTracker() {
  const { firms, coffeeChats, addFirm, updateFirm, deleteFirm, addCoffeeChat, updateCoffeeChat, deleteCoffeeChat } = useAppStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [editingFirm, setEditingFirm] = useState<Firm | null>(null)
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [editingChat, setEditingChat] = useState<CoffeeChat | null>(null)
  const [chatFirmFilter, setChatFirmFilter] = useState<string>('all')
  const [chatNameFilter, setChatNameFilter] = useState('')
  const [chatDateFilter, setChatDateFilter] = useState('')
  const [chatSort, setChatSort] = useState('date-desc')
  const [appSort, setAppSort] = useState('deadline-asc')

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

  // Cold Email Tracker State
  const [coldEmails, setColdEmails] = useState<ColdEmailEntry[]>([]);
  const [showColdEmailModal, setShowColdEmailModal] = useState(false);
  const [editingColdEmail, setEditingColdEmail] = useState<ColdEmailEntry | null>(null);
  const [coldEmailForm, setColdEmailForm] = useState<Omit<ColdEmailEntry, 'id'>>({
    name: '', firm: '', role: '', email: '', linkedin: '', outreachDate: '', followUpDate: '', status: 'Sent', notes: '', tags: []
  });
  const [coldEmailTab, setColdEmailTab] = useState<'table' | 'reminders'>('table');
  // Filters
  const [coldFirmFilter, setColdFirmFilter] = useState('');
  const [coldTagFilter, setColdTagFilter] = useState('');
  const [coldStatusFilter, setColdStatusFilter] = useState('');
  const [coldDateFilter, setColdDateFilter] = useState('');
  const [coldSort, setColdSort] = useState('date-desc');

  // Tabs for tracker sections
  const TRACKER_TABS = [
    { id: 'applications', label: 'Applications Tracker' },
    { id: 'coffeechats', label: 'Coffee Chat Tracker' },
    { id: 'coldemails', label: 'Cold Emails Tracker' },
  ];
  const [activeTrackerTab, setActiveTrackerTab] = useState<'applications' | 'coffeechats' | 'coldemails'>('applications');

  // Applications Tracker filters
  const [appSearch, setAppSearch] = useState('');
  const [appSortField, setAppSortField] = useState('deadline');
  const [appSortOrder, setAppSortOrder] = useState<'asc' | 'desc'>('asc');

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
    if (editingChat) {
      updateCoffeeChat(editingChat.id, {
        firmId: selectedFirm ? selectedFirm.id : '',
        ...chatFormData
      })
      toast.success('Coffee chat updated!')
    } else {
      addCoffeeChat({
        firmId: selectedFirm ? selectedFirm.id : '',
        ...chatFormData,
        completed: false
      })
      toast.success('Coffee chat added!')
    }
    setShowChatModal(false)
    setEditingChat(null)
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

  const handleEditChat = (chat: CoffeeChat) => {
    setEditingChat(chat)
    setChatFormData({
      contactName: chat.contactName,
      contactTitle: chat.contactTitle,
      scheduledDate: chat.scheduledDate,
      notes: chat.notes,
      outcome: chat.outcome
    })
    setSelectedFirm(firms.find(f => f.id === chat.firmId) || null)
    setShowChatModal(true)
  }

  const handleDeleteChat = (id: string) => {
    if (confirm('Are you sure you want to delete this coffee chat?')) {
      deleteCoffeeChat(id)
      toast.success('Coffee chat deleted!')
    }
  }

  let filteredFirms = firms.filter(firm =>
    (filterStatus === 'all' || firm.status === filterStatus) &&
    (
      appSearch === '' ||
      firm.name.toLowerCase().includes(appSearch.toLowerCase()) ||
      firm.division.toLowerCase().includes(appSearch.toLowerCase()) ||
      firm.location.toLowerCase().includes(appSearch.toLowerCase())
    )
  );
  filteredFirms = [...filteredFirms].sort((a, b) => {
    let valA, valB;
    switch (appSortField) {
      case 'name':
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        break;
      case 'status':
        valA = a.status;
        valB = b.status;
        break;
      case 'deadline':
      default:
        valA = a.deadline || '';
        valB = b.deadline || '';
        break;
    }
    if (appSortOrder === 'asc') return valA.localeCompare(valB);
    return valB.localeCompare(valA);
  });

  let filteredChats = coffeeChats.filter(chat => {
    const firmMatch = chatFirmFilter === 'all' || chat.firmId === chatFirmFilter
    const nameMatch = chatNameFilter === '' || chat.contactName.toLowerCase().includes(chatNameFilter.toLowerCase())
    const dateMatch = chatDateFilter === '' || chat.scheduledDate === chatDateFilter
    return firmMatch && nameMatch && dateMatch
  })

  if (chatSort === 'date-desc') {
    filteredChats = [...filteredChats].sort((a, b) => (b.scheduledDate || '').localeCompare(a.scheduledDate || ''))
  } else if (chatSort === 'date-asc') {
    filteredChats = [...filteredChats].sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''))
  }

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

  // Import/Export
  const handleExportColdEmails = () => {
    const data = JSON.stringify(coldEmails, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coldEmailTracker.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImportColdEmails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setColdEmails(imported);
          saveColdEmails(imported);
        }
      } catch {
        toast.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };
  // CRUD
  useEffect(() => { setColdEmails(loadColdEmails()); }, []);
  useEffect(() => { saveColdEmails(coldEmails); }, [coldEmails]);
  const handleAddColdEmail = () => {
    setEditingColdEmail(null);
    setColdEmailForm({ name: '', firm: '', role: '', email: '', linkedin: '', outreachDate: '', followUpDate: '', status: 'Sent', notes: '', tags: [] });
    setShowColdEmailModal(true);
  };
  const handleEditColdEmail = (entry: ColdEmailEntry) => {
    setEditingColdEmail(entry);
    setColdEmailForm({ ...entry });
    setShowColdEmailModal(true);
  };
  const handleDeleteColdEmail = (id: string) => {
    if (confirm('Delete this cold email entry?')) {
      setColdEmails(coldEmails.filter(e => e.id !== id));
      toast.success('Entry deleted');
    }
  };
  const handleColdEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coldEmailForm.outreachDate) return toast.error('Outreach date required');
    const followUpDate = coldEmailForm.followUpDate || getDefaultFollowUpDate(coldEmailForm.outreachDate);
    if (editingColdEmail) {
      setColdEmails(coldEmails.map(e => e.id === editingColdEmail.id ? { ...editingColdEmail, ...coldEmailForm, followUpDate } : e));
      toast.success('Entry updated');
    } else {
      setColdEmails([{ ...coldEmailForm, id: crypto.randomUUID(), followUpDate }, ...coldEmails]);
      toast.success('Entry added');
    }
    setShowColdEmailModal(false);
    setEditingColdEmail(null);
  };
  // Status update in table
  const handleStatusChange = (id: string, status: ColdEmailStatus) => {
    setColdEmails(coldEmails.map(e => e.id === id ? { ...e, status } : e));
  };
  // Filtering/sorting
  let filteredColdEmails = coldEmails.filter(e =>
    (!coldFirmFilter || e.firm.toLowerCase().includes(coldFirmFilter.toLowerCase())) &&
    (!coldTagFilter || e.tags.includes(coldTagFilter)) &&
    (!coldStatusFilter || e.status === coldStatusFilter) &&
    (!coldDateFilter || e.outreachDate === coldDateFilter)
  );
  if (coldSort === 'date-desc') filteredColdEmails = [...filteredColdEmails].sort((a, b) => (b.outreachDate || '').localeCompare(a.outreachDate || ''));
  if (coldSort === 'date-asc') filteredColdEmails = [...filteredColdEmails].sort((a, b) => (a.outreachDate || '').localeCompare(b.outreachDate || ''));
  // Analytics
  const thisWeek = (() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
  })();
  const emailsThisWeek = coldEmails.filter(e => e.outreachDate >= thisWeek.start && e.outreachDate <= thisWeek.end).length;
  const replied = coldEmails.filter(e => e.status === 'Replied').length;
  const responseRate = coldEmails.length ? Math.round((replied / coldEmails.length) * 100) : 0;
  const coffeeChatsScheduled = coldEmails.filter(e => e.status === 'Scheduled Call').length;
  // Follow-up reminders
  const today = new Date().toISOString().split('T')[0];
  const followUps = coldEmails.filter(e => e.followUpDate && e.status !== 'Replied' && e.status !== 'Scheduled Call' && e.followUpDate <= today);
  // Unique tags for filter
  const allTags = Array.from(new Set(coldEmails.flatMap(e => e.tags)));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Tracker Tabs */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 mb-2 flex justify-center border-b border-slate-200">
        <div className="flex space-x-2">
          {TRACKER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTrackerTab(tab.id as any)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${activeTrackerTab === tab.id ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-blue-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Applications Tracker Section */}
      {activeTrackerTab === 'applications' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          {/* Applications Filters */}
          <div className="flex flex-wrap gap-4 mb-4 items-end">
            <input
              type="text"
              value={appSearch}
              onChange={e => setAppSearch(e.target.value)}
              className="input-field w-auto"
              placeholder="Search firm, division, or location..."
            />
            <label className="text-sm font-semibold text-slate-700">Status:</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="Researching">Researching</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <label className="text-sm font-semibold text-slate-700">Sort by:</label>
            <select
              value={appSortField}
              onChange={e => setAppSortField(e.target.value)}
              className="input-field w-auto"
            >
              <option value="deadline">Deadline</option>
              <option value="name">Name</option>
              <option value="status">Status</option>
            </select>
            <select
              value={appSortOrder}
              onChange={e => setAppSortOrder(e.target.value as 'asc' | 'desc')}
              className="input-field w-auto"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Applications Tracker</h2>
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
      )}
      {/* Coffee Chat Tracker Section */}
      {activeTrackerTab === 'coffeechats' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card mt-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Coffee Chat Tracker</h2>
            <button
              onClick={() => { setShowChatModal(true); setEditingChat(null); setChatFormData({ contactName: '', contactTitle: '', scheduledDate: '', notes: '', outcome: '' }); setSelectedFirm(null); }}
              className="btn-primary flex items-center group"
            >
              <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Add Coffee Chat
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Firm</label>
              <select value={chatFirmFilter} onChange={e => setChatFirmFilter(e.target.value)} className="input-field w-auto">
                <option value="all">All Firms</option>
                {firms.map(firm => <option key={firm.id} value={firm.id}>{firm.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
              <input type="text" value={chatNameFilter} onChange={e => setChatNameFilter(e.target.value)} className="input-field w-auto" placeholder="Search name..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input type="date" value={chatDateFilter} onChange={e => setChatDateFilter(e.target.value)} className="input-field w-auto" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sort by</label>
              <select value={chatSort} onChange={e => setChatSort(e.target.value)} className="input-field w-auto">
                <option value="date-desc">Date ↓</option>
                <option value="date-asc">Date ↑</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Firm</th>
                  <th className="table-header">What Was Discussed</th>
                  <th className="table-header">Contact Info</th>
                  <th className="table-header">Other Questions</th>
                  <th className="table-header">Date of Chat</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredChats.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-slate-500 py-8">
                      No coffee chats found. Add your first coffee chat!
                    </td>
                  </tr>
                )}
                {filteredChats.map((chat, idx) => {
                  const firm = firms.find(f => f.id === chat.firmId)
                  return (
                    <tr key={chat.id} className="table-row">
                      <td className="table-cell">{chat.contactName}</td>
                      <td className="table-cell">{firm ? firm.name : '—'}</td>
                      <td className="table-cell">{chat.notes}</td>
                      <td className="table-cell">{chat.contactTitle}</td>
                      <td className="table-cell">{chat.outcome}</td>
                      <td className="table-cell">{chat.scheduledDate ? new Date(chat.scheduledDate).toLocaleDateString() : '-'}</td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditChat(chat)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit Coffee Chat"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChat(chat.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete Coffee Chat"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      {/* Cold Emails Tracker Section */}
      {activeTrackerTab === 'coldemails' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card mt-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Cold Emails Tracker</h2>
              <div className="flex space-x-4 mt-2">
                <button onClick={() => setColdEmailTab('table')} className={`btn-ghost ${coldEmailTab === 'table' ? 'font-bold text-blue-700 underline' : ''}`}>Table</button>
                <button onClick={() => setColdEmailTab('reminders')} className={`btn-ghost ${coldEmailTab === 'reminders' ? 'font-bold text-amber-700 underline' : ''}`}>Follow-up Reminders</button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handleAddColdEmail} className="btn-primary flex items-center group">
                <PlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Add Cold Email
              </button>
              <button onClick={handleExportColdEmails} className="btn-secondary ml-2">Export</button>
              <label className="btn-secondary ml-2 cursor-pointer">
                Import
                <input type="file" accept="application/json" className="hidden" onChange={handleImportColdEmails} />
              </label>
            </div>
          </div>
          {/* Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{emailsThisWeek}</div>
              <div className="text-sm text-slate-600">Emails Sent This Week</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{responseRate}%</div>
              <div className="text-sm text-slate-600">Response Rate</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{coffeeChatsScheduled}</div>
              <div className="text-sm text-slate-600">Coffee Chats Scheduled</div>
            </div>
          </div>
          {/* Filters */}
          {coldEmailTab === 'table' && (
            <div className="flex flex-wrap gap-4 mb-4">
              <input type="text" value={coldFirmFilter} onChange={e => setColdFirmFilter(e.target.value)} className="input-field w-auto" placeholder="Filter by firm..." />
              <select value={coldStatusFilter} onChange={e => setColdStatusFilter(e.target.value)} className="input-field w-auto">
                <option value="">All Status</option>
                {COLD_EMAIL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={coldTagFilter} onChange={e => setColdTagFilter(e.target.value)} className="input-field w-auto">
                <option value="">All Tags</option>
                {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
              </select>
              <input type="date" value={coldDateFilter} onChange={e => setColdDateFilter(e.target.value)} className="input-field w-auto" />
              <select value={coldSort} onChange={e => setColdSort(e.target.value)} className="input-field w-auto">
                <option value="date-desc">Date ↓</option>
                <option value="date-asc">Date ↑</option>
              </select>
            </div>
          )}
          {/* Table or Reminders */}
          {coldEmailTab === 'table' ? (
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th className="table-header">Name</th>
                    <th className="table-header">Firm</th>
                    <th className="table-header">Role</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">LinkedIn</th>
                    <th className="table-header">Outreach Date</th>
                    <th className="table-header">Follow-Up Date</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Tags</th>
                    <th className="table-header">Notes</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredColdEmails.length === 0 && (
                    <tr>
                      <td colSpan={11} className="text-center text-slate-500 py-8">
                        No cold emails found. Add your first cold email!
                      </td>
                    </tr>
                  )}
                  {filteredColdEmails.map(entry => (
                    <tr key={entry.id} className="table-row">
                      <td className="table-cell">{entry.name}</td>
                      <td className="table-cell">{entry.firm}</td>
                      <td className="table-cell">{entry.role}</td>
                      <td className="table-cell">{entry.email}</td>
                      <td className="table-cell">{entry.linkedin ? <a href={entry.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a> : '-'}</td>
                      <td className="table-cell">{entry.outreachDate}</td>
                      <td className="table-cell">{entry.followUpDate || '-'}</td>
                      <td className="table-cell">
                        <select value={entry.status} onChange={e => handleStatusChange(entry.id, e.target.value as ColdEmailStatus)} className="input-field w-auto">
                          {COLD_EMAIL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="table-cell">
                        {entry.tags.map(tag => <span key={tag} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-1 mb-1">{tag}</span>)}
                      </td>
                      <td className="table-cell">{entry.notes}</td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEditColdEmail(entry)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteColdEmail(entry.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th className="table-header">Name</th>
                    <th className="table-header">Firm</th>
                    <th className="table-header">Role</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">Follow-Up Date</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Notes</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {followUps.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center text-slate-500 py-8">
                        No follow-ups due or overdue!
                      </td>
                    </tr>
                  )}
                  {followUps.map(entry => (
                    <tr key={entry.id} className="table-row">
                      <td className="table-cell">{entry.name}</td>
                      <td className="table-cell">{entry.firm}</td>
                      <td className="table-cell">{entry.role}</td>
                      <td className="table-cell">{entry.email}</td>
                      <td className="table-cell">{entry.followUpDate || '-'}</td>
                      <td className="table-cell">{entry.status}</td>
                      <td className="table-cell">{entry.notes}</td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEditColdEmail(entry)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteColdEmail(entry.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
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
        {showChatModal && (
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
                  {editingChat ? 'Edit Coffee Chat' : 'Add Coffee Chat'}
                </h3>
                <p className="text-slate-600">Enter the coffee chat details below</p>
              </div>
              <form onSubmit={handleChatSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={chatFormData.contactName}
                    onChange={(e) => setChatFormData({ ...chatFormData, contactName: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Firm</label>
                  <select
                    value={selectedFirm ? selectedFirm.id : ''}
                    onChange={e => {
                      const firm = firms.find(f => f.id === e.target.value)
                      setSelectedFirm(firm || null)
                    }}
                    className="input-field"
                  >
                    <option value="">None</option>
                    {firms.map(firm => (
                      <option key={firm.id} value={firm.id}>{firm.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">What Was Discussed</label>
                  <textarea
                    required
                    value={chatFormData.notes}
                    onChange={(e) => setChatFormData({ ...chatFormData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Topics, insights, advice, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Info</label>
                  <input
                    type="text"
                    value={chatFormData.contactTitle}
                    onChange={(e) => setChatFormData({ ...chatFormData, contactTitle: e.target.value })}
                    className="input-field"
                    placeholder="Title, email, LinkedIn, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Other Questions</label>
                  <textarea
                    value={chatFormData.outcome}
                    onChange={(e) => setChatFormData({ ...chatFormData, outcome: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="Follow-ups, next steps, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Chat</label>
                  <input
                    type="date"
                    required
                    value={chatFormData.scheduledDate}
                    onChange={(e) => setChatFormData({ ...chatFormData, scheduledDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => { setShowChatModal(false); setEditingChat(null); setSelectedFirm(null); }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingChat ? 'Update' : 'Add'} Coffee Chat
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cold Email Modal (overlay, not inside card) */}
      <AnimatePresence>
        {showColdEmailModal && (
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
                  {editingColdEmail ? 'Edit Cold Email' : 'Add Cold Email'}
                </h3>
                <p className="text-slate-600">Enter the cold outreach details below</p>
              </div>
              <form onSubmit={handleColdEmailSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                    <input type="text" required value={coldEmailForm.name} onChange={e => setColdEmailForm({ ...coldEmailForm, name: e.target.value })} className="input-field" placeholder="Contact name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Firm</label>
                    <input type="text" required value={coldEmailForm.firm} onChange={e => setColdEmailForm({ ...coldEmailForm, firm: e.target.value })} className="input-field" placeholder="Firm name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                    <input type="text" required value={coldEmailForm.role} onChange={e => setColdEmailForm({ ...coldEmailForm, role: e.target.value })} className="input-field" placeholder="Role/title" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input type="email" required value={coldEmailForm.email} onChange={e => setColdEmailForm({ ...coldEmailForm, email: e.target.value })} className="input-field" placeholder="Email address" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn (optional)</label>
                    <input type="url" value={coldEmailForm.linkedin || ''} onChange={e => setColdEmailForm({ ...coldEmailForm, linkedin: e.target.value })} className="input-field" placeholder="LinkedIn URL" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Outreach Date</label>
                    <input type="date" required value={coldEmailForm.outreachDate} onChange={e => setColdEmailForm({ ...coldEmailForm, outreachDate: e.target.value, followUpDate: getDefaultFollowUpDate(e.target.value) })} className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Follow-Up Date (auto)</label>
                    <input type="date" value={coldEmailForm.followUpDate || ''} onChange={e => setColdEmailForm({ ...coldEmailForm, followUpDate: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select value={coldEmailForm.status} onChange={e => setColdEmailForm({ ...coldEmailForm, status: e.target.value as ColdEmailStatus })} className="input-field">
                      {COLD_EMAIL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma separated)</label>
                  <input type="text" value={coldEmailForm.tags.join(', ')} onChange={e => setColdEmailForm({ ...coldEmailForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="input-field" placeholder="e.g. alumni, NYC, M&A" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea value={coldEmailForm.notes} onChange={e => setColdEmailForm({ ...coldEmailForm, notes: e.target.value })} className="input-field" rows={3} placeholder="Notes, context, or follow-up details" />
                </div>
                <div className="flex justify-end space-x-4 pt-6">
                  <button type="button" onClick={() => { setShowColdEmailModal(false); setEditingColdEmail(null); }} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">{editingColdEmail ? 'Update' : 'Add'} Cold Email</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 