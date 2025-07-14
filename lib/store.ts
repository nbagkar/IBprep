import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FirebaseService } from './firebaseService'
import { signInWithGoogle, signOutUser, onUserStateChanged } from './firebaseAuth'
import type { User } from 'firebase/auth'
import { technicalQuestionsData } from './technicalQuestionsData'

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
  applicationLink?: string // Optional link to the application
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
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  answer: string
  notes: string
  lastUpdated: string
  isPreloaded?: boolean
}

export interface TechnicalQuestion {
  id: string
  question: string
  answer: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  notes: string
  lastUpdated: string
  isPreloaded?: boolean
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
  createdBy: {
    uid: string
    displayName: string | null
    email: string | null
    photoURL: string | null
  } | null
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
  
  // Resources (Firebase-managed)
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
  
  // Firebase loading states
  resourcesLoading: boolean
  resourcesError: string | null
  
  // Auth
  user: User | null
  userLoading: boolean
  
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
  initializePreloadedQuestions: () => void
  
  addTechnicalQuestion: (question: Omit<TechnicalQuestion, 'id' | 'lastUpdated'>) => void
  updateTechnicalQuestion: (id: string, updates: Partial<TechnicalQuestion>) => void
  deleteTechnicalQuestion: (id: string) => void
  initializePreloadedTechnicalQuestions: () => void
  
  addDealExperience: (deal: Omit<DealExperience, 'id'>) => void
  updateDealExperience: (id: string, updates: Partial<DealExperience>) => void
  deleteDealExperience: (id: string) => void
  
  // Firebase Resource Actions
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => Promise<void>
  updateResource: (id: string, updates: Partial<Resource>) => Promise<void>
  deleteResource: (id: string) => Promise<void>
  loadResources: () => Promise<void>
  
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
  
  // Auth
  signIn: () => Promise<void>
  signOut: () => Promise<void>
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
      resourcesLoading: false,
      resourcesError: null,
      user: null,
      userLoading: true,
      
      // Firm Actions
      addFirm: (firm) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { firms: state.firms };
        }
        return {
          firms: [...state.firms, {
            ...firm,
            id: crypto.randomUUID(),
            lastUpdated: new Date().toISOString(),
          }]
        }
      }),
      
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
      addCoffeeChat: (chat) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { coffeeChats: state.coffeeChats };
        }
        return {
          coffeeChats: [...state.coffeeChats, {
            ...chat,
            id: crypto.randomUUID(),
          }]
        }
      }),
      
      updateCoffeeChat: (id, updates) => set((state) => ({
        coffeeChats: state.coffeeChats.map(chat => 
          chat.id === id ? { ...chat, ...updates } : chat
        )
      })),
      
      deleteCoffeeChat: (id) => set((state) => ({
        coffeeChats: state.coffeeChats.filter(chat => chat.id !== id)
      })),
      
      // Behavioral Question Actions
      addBehavioralQuestion: (question) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { behavioralQuestions: state.behavioralQuestions };
        }
        return {
          behavioralQuestions: [...state.behavioralQuestions, {
            ...question,
            id: crypto.randomUUID(),
            lastUpdated: new Date().toISOString(),
          }]
        }
      }),
      
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
      
      initializePreloadedQuestions: () => {
        const state = get()
        const existingQuestions = state.behavioralQuestions
        const preloadedQuestions = [
          {
            question: "Walk me through your resume / tell me about yourself",
            category: "General" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Why investment banking/sales and trading?",
            category: "Motivation" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What do investment bankers do?",
            category: "General" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What do you think you will be doing on a day-to-day basis as an analyst?",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Why [insert bank's name here]?",
            category: "Motivation" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What do you know about our firm?",
            category: "General" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Who have you spoken with at our bank?",
            category: "Networking" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Why not firm X rather than our firm?",
            category: "Motivation" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What groups are you interested in?",
            category: "Goals" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Can you handle the grunt work?",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What do you think is the most important characteristic for this job?",
            category: "Strengths & Weaknesses" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "If you were running this firm, in what direction would you take it?",
            category: "Leadership" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Can ethical requirements in a firm be too high?",
            category: "Personal" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What are some of your strengths?",
            category: "Strengths & Weaknesses" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Why should we hire you over any of the other candidates we are interviewing? What makes you different or special?",
            category: "Strengths & Weaknesses" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Why do you think you will make a good investment-banking analyst?",
            category: "Strengths & Weaknesses" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What are you looking for in this job?",
            category: "Goals" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What do you consider to be your greatest accomplishment?",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What is the number one thing I should know about you that I cannot learn from your resume?",
            category: "Personal" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Coming out of this interview, what are three things about you that I should take away?",
            category: "Personal" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What serves as your biggest motivation?",
            category: "Motivation" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Why do you feel you can put up with the stress, pressure and long hours that are involved with banking?",
            category: "Challenges" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "How hard are you willing to work to achieve a goal?",
            category: "Motivation" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What is the most intellectually challenging thing you have done?",
            category: "Challenges" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Describe your ideal working environment.",
            category: "Personal" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What was the most important thing you got out of your job last summer?",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What would your last boss say about you?",
            category: "Strengths & Weaknesses" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "How would your best friends describe you?",
            category: "Personal" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Why did you choose the school you go/went to?",
            category: "Personal" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Why did you choose your major?",
            category: "Personal" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What else do you do at school other than study?",
            category: "Personal" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What has been your favorite class in college and what was your grade?",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What has been your least favorite class in college and what was your grade?",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me about your college experience",
            category: "Experience" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Do you regret choosing the school you chose?",
            category: "Personal" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What is an example of a big risk you have taken in your life?",
            category: "Challenges" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What is the biggest obstacle or challenge you have faced and overcome in your life?",
            category: "Challenges" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What is the toughest decision you have ever had to make?",
            category: "Challenges" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "How would you compare your writing skills to you oral skills?",
            category: "Strengths & Weaknesses" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What do you like to do in your free time?",
            category: "Personal" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What competitive activities have you participated in, and have they been worthwhile?",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What would you do for a living if you did not have to worry about money?",
            category: "Personal" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "How do you manage stress in your life?",
            category: "Challenges" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What is your favorite website?",
            category: "Personal" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What role do you like to take in a team situation?",
            category: "Team Dynamics" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Do you feel more comfortable working in a group or individually?",
            category: "Team Dynamics" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "How did you go about preparing for interviews?",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give me an example of a time you worked as part of a team.",
            category: "Teamwork" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give me an example of a time you took a leadership role in a team situation.",
            category: "Leadership" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give me an example of a time when you had to deal with a conflict in a team situation.",
            category: "Conflict Resolution" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Describe a situation in which you or your group was at risk of missing a deadline. What did you do?",
            category: "Problem Solving" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me about a time when you were in a group in which someone wasn't contributing as they should have been. What did you do?",
            category: "Team Dynamics" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me about a time when you had to deal with a very upset teammate or co-worker?",
            category: "Conflict Resolution" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "How do you manage to successfully deal with a difficult boss, co-worker or teammate?",
            category: "Conflict Resolution" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me about a time when you motivated others.",
            category: "Leadership" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give me an example of a project that has required you to think quantitatively and analytically.",
            category: "Problem Solving" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give me an example of a project you enjoyed working on.",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give an example of a time when you set a goal and were able to meet or achieve it.",
            category: "Goals" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give me an example of a time when you have had to multitask.",
            category: "Problem Solving" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give me an example of a time when you successfully persuaded others to do something or see your point of view.",
            category: "Communication" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give an example of a time when you have gone above and beyond what was expected of you.",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give an example of a time when you were required to pay close attention to details.",
            category: "Problem Solving" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What is the biggest mistake you have ever made in your professional life?",
            category: "Challenges" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me about your previous work experiences and walk me through a sample project from your work.",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "You are supposed to be meeting a close friend for dinner but something comes up and you have to stay late. What would you do, and can you tell me about a similar experience you have had in your life?",
            category: "Challenges" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Give me an example of a time when you had to make a split-second decision.",
            category: "Problem Solving" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me about a time when you anticipated potential problems and took measures to prevent them.",
            category: "Problem Solving" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me about a time when you learned something new in a short amount of time.",
            category: "Experience" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me about a time you dealt with a major disappointment and turned it into a learning experience.",
            category: "Challenges" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What is your biggest weakness?",
            category: "Strengths & Weaknesses" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What do you consider to be your greatest failure?",
            category: "Challenges" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What do you consider to be the biggest negative about this job?",
            category: "Personal" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Why is your GPA so low?",
            category: "Strengths & Weaknesses" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "At the end of the summer internship, you don't get a full time offer. What could cause this to happen?",
            category: "Challenges" as const,
            difficulty: "Hard" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Where else are you applying/interviewing?",
            category: "Goals" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Where do you see yourself in five/ten years?",
            category: "Goals" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me a (clean) joke.",
            category: "Personal" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "What is the most interesting thing you have read in the Wall Street Journal lately?",
            category: "General" as const,
            difficulty: "Medium" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          },
          {
            question: "Tell me the full names of the people who've interviewed you before me.",
            category: "General" as const,
            difficulty: "Easy" as const,
            answer: "",
            notes: "",
            isPreloaded: true
          }
        ]

        // Only add questions that don't already exist
        const newQuestions = preloadedQuestions.filter(preloaded => 
          !existingQuestions.some(existing => existing.question === preloaded.question)
        )

        if (newQuestions.length > 0) {
          set((state) => ({
            behavioralQuestions: [
              ...state.behavioralQuestions,
              ...newQuestions.map(q => ({
                ...q,
                id: crypto.randomUUID(),
                lastUpdated: new Date().toISOString(),
              }))
            ]
          }))
        }
      },
      
      // Technical Question Actions
      addTechnicalQuestion: (question) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { technicalQuestions: state.technicalQuestions };
        }
        return {
          technicalQuestions: [...state.technicalQuestions, {
            ...question,
            id: crypto.randomUUID(),
            lastUpdated: new Date().toISOString(),
          }]
        }
      }),
      
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
      
      initializePreloadedTechnicalQuestions: () => {
        const state = get()
        const existingQuestions = state.technicalQuestions
        
        // Only add questions that don't already exist
        const newQuestions = technicalQuestionsData.filter(preloaded => 
          !existingQuestions.some(existing => existing.question === preloaded.question)
        )

        if (newQuestions.length > 0) {
          set((state) => ({
            technicalQuestions: [
              ...state.technicalQuestions,
              ...newQuestions.map(q => ({
                ...q,
                id: crypto.randomUUID(),
                lastUpdated: new Date().toISOString(),
              }))
            ]
          }))
        }
      },
      
      // Deal Experience Actions
      addDealExperience: (deal) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { dealExperiences: state.dealExperiences };
        }
        return {
          dealExperiences: [...state.dealExperiences, {
            ...deal,
            id: crypto.randomUUID(),
          }]
        }
      }),
      
      updateDealExperience: (id, updates) => set((state) => ({
        dealExperiences: state.dealExperiences.map(deal => 
          deal.id === id ? { ...deal, ...updates } : deal
        )
      })),
      
      deleteDealExperience: (id) => set((state) => ({
        dealExperiences: state.dealExperiences.filter(deal => deal.id !== id)
      })),
      
      // Resource Actions
      addResource: async (resource) => {
        try {
          const user = get().user
          const id = await FirebaseService.addResource({
            ...resource,
            createdBy: user
              ? {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL
                }
              : null
          })
          set((state) => ({
            resources: [
              ...state.resources,
              {
                ...resource,
                id,
                createdAt: new Date().toISOString(),
                createdBy: user
                  ? {
                      uid: user.uid,
                      displayName: user.displayName,
                      email: user.email,
                      photoURL: user.photoURL
                    }
                  : null
              }
            ]
          }))
        } catch (error) {
          set({ resourcesError: error instanceof Error ? error.message : 'An error occurred' })
        }
      },
      
      updateResource: async (id, updates) => {
        try {
          await FirebaseService.updateResource(id, updates)
          set((state) => ({
            resources: state.resources.map(resource => 
              resource.id === id ? { ...resource, ...updates } : resource
            )
          }))
        } catch (error) {
          set({ resourcesError: error instanceof Error ? error.message : 'An error occurred' })
        }
      },
      
      deleteResource: async (id) => {
        try {
          const resource = get().resources.find(r => r.id === id)
          if (resource) {
            await FirebaseService.deleteResource(resource)
          }
          set((state) => ({
            resources: state.resources.filter(resource => resource.id !== id)
          }))
        } catch (error) {
          set({ resourcesError: error instanceof Error ? error.message : 'An error occurred' })
        }
      },
      
      loadResources: async () => {
        try {
          set({ resourcesLoading: true, resourcesError: null })
          const resources = await FirebaseService.getResources()
          set({ resources, resourcesLoading: false })
        } catch (error) {
          set({ 
            resourcesError: error instanceof Error ? error.message : 'An error occurred',
            resourcesLoading: false 
          })
        }
      },
      
      // Contact Actions
      addContact: (contact) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { contacts: state.contacts };
        }
        return {
          contacts: [...state.contacts, {
            ...contact,
            id: crypto.randomUUID(),
          }]
        }
      }),
      
      updateContact: (id, updates) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === id ? { ...contact, ...updates } : contact
        )
      })),
      
      deleteContact: (id) => set((state) => ({
        contacts: state.contacts.filter(contact => contact.id !== id)
      })),
      
      // Networking Event Actions
      addNetworkingEvent: (event) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { networkingEvents: state.networkingEvents };
        }
        return {
          networkingEvents: [...state.networkingEvents, {
            ...event,
            id: crypto.randomUUID(),
          }]
        }
      }),
      
      updateNetworkingEvent: (id, updates) => set((state) => ({
        networkingEvents: state.networkingEvents.map(event => 
          event.id === id ? { ...event, ...updates } : event
        )
      })),
      
      deleteNetworkingEvent: (id) => set((state) => ({
        networkingEvents: state.networkingEvents.filter(event => event.id !== id)
      })),
      
      // Mock Interview Actions
      addMockInterview: (interview) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { mockInterviews: state.mockInterviews };
        }
        return {
          mockInterviews: [...state.mockInterviews, {
            ...interview,
            id: crypto.randomUUID(),
          }]
        }
      }),
      
      updateMockInterview: (id, updates) => set((state) => ({
        mockInterviews: state.mockInterviews.map(interview => 
          interview.id === id ? { ...interview, ...updates } : interview
        )
      })),
      
      deleteMockInterview: (id) => set((state) => ({
        mockInterviews: state.mockInterviews.filter(interview => interview.id !== id)
      })),
      
      // News Actions
      addNewsItem: (news) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { newsItems: state.newsItems };
        }
        return {
          newsItems: [...state.newsItems, {
            ...news,
            id: crypto.randomUUID(),
          }]
        }
      }),
      
      deleteNewsItem: (id) => set((state) => ({
        newsItems: state.newsItems.filter(news => news.id !== id)
      })),
      
      // Market Intelligence Actions
      addMarketIntel: (marketIntel) => set((state) => {
        if (!get().user) {
          alert('You must be signed in to save your information.');
          return { marketIntel: state.marketIntel };
        }
        return {
          marketIntel: [...state.marketIntel, {
            ...marketIntel,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          }]
        }
      }),
      
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
      },
      
      // Auth
      signIn: async () => {
        set({ userLoading: true })
        try {
          await signInWithGoogle()
        } finally {
          set({ userLoading: false })
        }
      },
      signOut: async () => {
        set({ userLoading: true })
        try {
          await signOutUser()
        } finally {
          set({ userLoading: false })
        }
      },
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
        user: state.user,
      }),
    }
  )
)

// Listen for auth state changes
onUserStateChanged((user) => {
  useAppStore.setState({ user, userLoading: false })
}) 