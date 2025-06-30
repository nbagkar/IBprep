import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Firm {
  id: string
  name: string
  division: string
  location: string
  status: 'Researching' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'
  deadline?: string
  keyContacts: string
  notes: string
  appliedDate?: string
  lastUpdated: string
}

export interface CoffeeChat {
  id: string
  firmId: string
  contactName: string
  contactTitle: string
  scheduledDate: string
  notes: string
  outcome: string
  completed: boolean
}

export interface BehavioralQuestion {
  id: string
  question: string
  category: 'Leadership' | 'Teamwork' | 'Problem Solving' | 'Communication' | 'Conflict Resolution'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  answer: string
  notes: string
  lastUpdated: string
}

export interface TechnicalQuestion {
  id: string
  question: string
  answer: string
  category: 'Valuation' | 'Financial Modeling' | 'Accounting' | 'M&A' | 'LBO' | 'Market Sizing' | 'Other'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  notes: string
  lastUpdated: string
}

export interface DealExperience {
  id: string
  company: string
  dealType: string
  dealSize: string
  role: string
  description: string
  keyLearnings: string
  date: string
}

export interface Resource {
  id: string
  title: string
  type: 'Document' | 'Video' | 'Book' | 'Link'
  category: 'Valuation' | 'Financial Modeling' | 'Accounting' | 'M&A' | 'LBO' | 'Interview Prep' | 'Networking'
  url?: string
  description: string
  tags: string[]
  notes: string
  createdAt: string
}

export interface Contact {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone?: string
  notes: string
  lastContact: string
  followUpDate?: string
}

export interface NetworkingEvent {
  id: string
  name: string
  date: string
  location: string
  description: string
  outcome: string
  followUpRequired: boolean
}

export interface MockInterview {
  id: string
  interviewer: string
  date: string
  type: 'Behavioral' | 'Technical' | 'Case Study' | 'Fit'
  score: number
  feedback: string
  notes: string
}

export interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  summary: string
}

export interface MarketIntel {
  id: string
  title: string
  source: string
  date: string
  categoryTags: string[]
  summary: string
  relevanceToIB: string
  coffeeChatNotes: string
  screenshotUrl?: string
  url?: string
  isFlashcard: boolean
  flashcardQuestion?: string
  flashcardAnswer?: string
  reviewStatus: 'Need to Review' | 'Solid' | 'Coffee Chat Ready'
  weekNumber: number
  year: number
  createdAt: string
  lastUpdated: string
}

// Store State
interface AppState {
  // Firms
  firms: Firm[]
  coffeeChats: CoffeeChat[]
  
  // Interview Prep
  behavioralQuestions: BehavioralQuestion[]
  technicalQuestions: TechnicalQuestion[]
  dealExperiences: DealExperience[]
  mockInterviews: MockInterview[]
  
  // Resources
  resources: Resource[]
  contacts: Contact[]
  
  // Events & News
  networkingEvents: NetworkingEvent[]
  newsItems: NewsItem[]
  
  // Market Intelligence
  marketIntel: MarketIntel[]
  
  // UI State
  activeTab: string
  sidebarOpen: boolean
  
  // Actions
  addFirm: (firm: Omit<Firm, 'id' | 'lastUpdated'>) => void
  updateFirm: (id: string, updates: Partial<Firm>) => void
  deleteFirm: (id: string) => void
  
  addCoffeeChat: (chat: Omit<CoffeeChat, 'id'>) => void
  updateCoffeeChat: (id: string, updates: Partial<CoffeeChat>) => void
  deleteCoffeeChat: (id: string) => void
  
  addBehavioralQuestion: (question: Omit<BehavioralQuestion, 'id' | 'lastUpdated'>) => void
  updateBehavioralQuestion: (id: string, updates: Partial<BehavioralQuestion>) => void
  deleteBehavioralQuestion: (id: string) => void
  
  addTechnicalQuestion: (question: Omit<TechnicalQuestion, 'id' | 'lastUpdated'>) => void
  updateTechnicalQuestion: (id: string, updates: Partial<TechnicalQuestion>) => void
  deleteTechnicalQuestion: (id: string) => void
  
  addDealExperience: (deal: Omit<DealExperience, 'id'>) => void
  updateDealExperience: (id: string, updates: Partial<DealExperience>) => void
  deleteDealExperience: (id: string) => void
  
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void
  updateResource: (id: string, updates: Partial<Resource>) => void
  deleteResource: (id: string) => void
  
  addContact: (contact: Omit<Contact, 'id'>) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void
  
  addNetworkingEvent: (event: Omit<NetworkingEvent, 'id'>) => void
  updateNetworkingEvent: (id: string, updates: Partial<NetworkingEvent>) => void
  deleteNetworkingEvent: (id: string) => void
  
  addMockInterview: (interview: Omit<MockInterview, 'id'>) => void
  updateMockInterview: (id: string, updates: Partial<MockInterview>) => void
  deleteMockInterview: (id: string) => void
  
  addNewsItem: (news: Omit<NewsItem, 'id'>) => void
  deleteNewsItem: (id: string) => void
  
  addMarketIntel: (marketIntel: Omit<MarketIntel, 'id' | 'createdAt'>) => void
  updateMarketIntel: (id: string, updates: Partial<MarketIntel>) => void
  deleteMarketIntel: (id: string) => void
  
  setActiveTab: (tab: string) => void
  setSidebarOpen: (open: boolean) => void
  
  // Data Management Actions
  exportData: () => void
  importData: (jsonData: string) => { success: boolean; message: string }
  clearAllData: () => { success: boolean; message: string }
  getDataStats: () => {
    totalFirms: number
    totalCoffeeChats: number
    totalBehavioralQuestions: number
    totalTechnicalQuestions: number
    totalDealExperiences: number
    totalMockInterviews: number
    totalResources: number
    totalContacts: number
    totalNetworkingEvents: number
    totalNewsItems: number
    totalMarketIntel: number
    lastUpdated: string
  }
}

// Store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      firms: [],
      coffeeChats: [],
      behavioralQuestions: [],
      technicalQuestions: [],
      dealExperiences: [],
      mockInterviews: [],
      resources: [],
      contacts: [],
      networkingEvents: [],
      newsItems: [],
      marketIntel: [],
      activeTab: 'dashboard',
      sidebarOpen: true,
      
      // Firm Actions
      addFirm: (firm) => set((state) => ({
        firms: [...state.firms, {
          ...firm,
          id: crypto.randomUUID(),
          lastUpdated: new Date().toISOString(),
        }]
      })),
      
      updateFirm: (id, updates) => set((state) => ({
        firms: state.firms.map(firm => 
          firm.id === id 
            ? { ...firm, ...updates, lastUpdated: new Date().toISOString() }
            : firm
        )
      })),
      
      deleteFirm: (id) => set((state) => ({
        firms: state.firms.filter(firm => firm.id !== id)
      })),
      
      // Coffee Chat Actions
      addCoffeeChat: (chat) => set((state) => ({
        coffeeChats: [...state.coffeeChats, {
          ...chat,
          id: crypto.randomUUID(),
        }]
      })),
      
      updateCoffeeChat: (id, updates) => set((state) => ({
        coffeeChats: state.coffeeChats.map(chat => 
          chat.id === id ? { ...chat, ...updates } : chat
        )
      })),
      
      deleteCoffeeChat: (id) => set((state) => ({
        coffeeChats: state.coffeeChats.filter(chat => chat.id !== id)
      })),
      
      // Behavioral Question Actions
      addBehavioralQuestion: (question) => set((state) => ({
        behavioralQuestions: [...state.behavioralQuestions, {
          ...question,
          id: crypto.randomUUID(),
          lastUpdated: new Date().toISOString(),
        }]
      })),
      
      updateBehavioralQuestion: (id, updates) => set((state) => ({
        behavioralQuestions: state.behavioralQuestions.map(q => 
          q.id === id 
            ? { ...q, ...updates, lastUpdated: new Date().toISOString() }
            : q
        )
      })),
      
      deleteBehavioralQuestion: (id) => set((state) => ({
        behavioralQuestions: state.behavioralQuestions.filter(q => q.id !== id)
      })),
      
      // Technical Question Actions
      addTechnicalQuestion: (question) => set((state) => ({
        technicalQuestions: [...state.technicalQuestions, {
          ...question,
          id: crypto.randomUUID(),
          lastUpdated: new Date().toISOString(),
        }]
      })),
      
      updateTechnicalQuestion: (id, updates) => set((state) => ({
        technicalQuestions: state.technicalQuestions.map(q => 
          q.id === id 
            ? { ...q, ...updates, lastUpdated: new Date().toISOString() }
            : q
        )
      })),
      
      deleteTechnicalQuestion: (id) => set((state) => ({
        technicalQuestions: state.technicalQuestions.filter(q => q.id !== id)
      })),
      
      // Deal Experience Actions
      addDealExperience: (deal) => set((state) => ({
        dealExperiences: [...state.dealExperiences, {
          ...deal,
          id: crypto.randomUUID(),
        }]
      })),
      
      updateDealExperience: (id, updates) => set((state) => ({
        dealExperiences: state.dealExperiences.map(deal => 
          deal.id === id ? { ...deal, ...updates } : deal
        )
      })),
      
      deleteDealExperience: (id) => set((state) => ({
        dealExperiences: state.dealExperiences.filter(deal => deal.id !== id)
      })),
      
      // Resource Actions
      addResource: (resource) => set((state) => ({
        resources: [...state.resources, {
          ...resource,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }]
      })),
      
      updateResource: (id, updates) => set((state) => ({
        resources: state.resources.map(resource => 
          resource.id === id ? { ...resource, ...updates } : resource
        )
      })),
      
      deleteResource: (id) => set((state) => ({
        resources: state.resources.filter(resource => resource.id !== id)
      })),
      
      // Contact Actions
      addContact: (contact) => set((state) => ({
        contacts: [...state.contacts, {
          ...contact,
          id: crypto.randomUUID(),
        }]
      })),
      
      updateContact: (id, updates) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === id ? { ...contact, ...updates } : contact
        )
      })),
      
      deleteContact: (id) => set((state) => ({
        contacts: state.contacts.filter(contact => contact.id !== id)
      })),
      
      // Networking Event Actions
      addNetworkingEvent: (event) => set((state) => ({
        networkingEvents: [...state.networkingEvents, {
          ...event,
          id: crypto.randomUUID(),
        }]
      })),
      
      updateNetworkingEvent: (id, updates) => set((state) => ({
        networkingEvents: state.networkingEvents.map(event => 
          event.id === id ? { ...event, ...updates } : event
        )
      })),
      
      deleteNetworkingEvent: (id) => set((state) => ({
        networkingEvents: state.networkingEvents.filter(event => event.id !== id)
      })),
      
      // Mock Interview Actions
      addMockInterview: (interview) => set((state) => ({
        mockInterviews: [...state.mockInterviews, {
          ...interview,
          id: crypto.randomUUID(),
        }]
      })),
      
      updateMockInterview: (id, updates) => set((state) => ({
        mockInterviews: state.mockInterviews.map(interview => 
          interview.id === id ? { ...interview, ...updates } : interview
        )
      })),
      
      deleteMockInterview: (id) => set((state) => ({
        mockInterviews: state.mockInterviews.filter(interview => interview.id !== id)
      })),
      
      // News Actions
      addNewsItem: (news) => set((state) => ({
        newsItems: [...state.newsItems, {
          ...news,
          id: crypto.randomUUID(),
        }]
      })),
      
      deleteNewsItem: (id) => set((state) => ({
        newsItems: state.newsItems.filter(news => news.id !== id)
      })),
      
      // Market Intelligence Actions
      addMarketIntel: (marketIntel) => set((state) => ({
        marketIntel: [...state.marketIntel, {
          ...marketIntel,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }]
      })),
      
      updateMarketIntel: (id, updates) => set((state) => ({
        marketIntel: state.marketIntel.map(mi => 
          mi.id === id ? { ...mi, ...updates, lastUpdated: new Date().toISOString() } : mi
        )
      })),
      
      deleteMarketIntel: (id) => set((state) => ({
        marketIntel: state.marketIntel.filter(mi => mi.id !== id)
      })),
      
      // UI Actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Data Management Actions
      exportData: () => {
        const state = get()
        const exportData = {
          firms: state.firms,
          coffeeChats: state.coffeeChats,
          behavioralQuestions: state.behavioralQuestions,
          technicalQuestions: state.technicalQuestions,
          dealExperiences: state.dealExperiences,
          mockInterviews: state.mockInterviews,
          resources: state.resources,
          contacts: state.contacts,
          networkingEvents: state.networkingEvents,
          newsItems: state.newsItems,
          marketIntel: state.marketIntel,
          exportDate: new Date().toISOString(),
          version: '1.0'
        }
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ib-prep-hub-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },
      
      importData: (jsonData: string) => {
        try {
          const data = JSON.parse(jsonData)
          set({
            firms: data.firms || [],
            coffeeChats: data.coffeeChats || [],
            behavioralQuestions: data.behavioralQuestions || [],
            technicalQuestions: data.technicalQuestions || [],
            dealExperiences: data.dealExperiences || [],
            mockInterviews: data.mockInterviews || [],
            resources: data.resources || [],
            contacts: data.contacts || [],
            networkingEvents: data.networkingEvents || [],
            newsItems: data.newsItems || [],
            marketIntel: data.marketIntel || [],
          })
          return { success: true, message: 'Data imported successfully!' }
        } catch (error) {
          return { success: false, message: 'Invalid data format. Please check your backup file.' }
        }
      },
      
      clearAllData: () => {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
          set({
            firms: [],
            coffeeChats: [],
            behavioralQuestions: [],
            technicalQuestions: [],
            dealExperiences: [],
            mockInterviews: [],
            resources: [],
            contacts: [],
            networkingEvents: [],
            newsItems: [],
            marketIntel: [],
          })
          return { success: true, message: 'All data cleared successfully!' }
        }
        return { success: false, message: 'Operation cancelled.' }
      },
      
      getDataStats: () => {
        const state = get()
        return {
          totalFirms: state.firms.length,
          totalCoffeeChats: state.coffeeChats.length,
          totalBehavioralQuestions: state.behavioralQuestions.length,
          totalTechnicalQuestions: state.technicalQuestions.length,
          totalDealExperiences: state.dealExperiences.length,
          totalMockInterviews: state.mockInterviews.length,
          totalResources: state.resources.length,
          totalContacts: state.contacts.length,
          totalNetworkingEvents: state.networkingEvents.length,
          totalNewsItems: state.newsItems.length,
          totalMarketIntel: state.marketIntel.length,
          lastUpdated: new Date().toISOString()
        }
      }
    }),
    {
      name: 'ib-prep-hub-storage',
      partialize: (state) => ({
        firms: state.firms,
        coffeeChats: state.coffeeChats,
        behavioralQuestions: state.behavioralQuestions,
        technicalQuestions: state.technicalQuestions,
        dealExperiences: state.dealExperiences,
        mockInterviews: state.mockInterviews,
        resources: state.resources,
        contacts: state.contacts,
        networkingEvents: state.networkingEvents,
        newsItems: state.newsItems,
        marketIntel: state.marketIntel,
      }),
    }
  )
) 