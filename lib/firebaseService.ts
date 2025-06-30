import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage'
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { storage, db } from './firebase'
import type { Resource } from './store'

export class FirebaseService {
  // Upload file to Firebase Storage
  static async uploadFile(file: File, fileName: string): Promise<string> {
    try {
      const storageRef = ref(storage, `resources/${fileName}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Failed to upload file')
    }
  }

  // Add resource to Firestore
  static async addResource(resource: Omit<Resource, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'resources'), {
        ...resource,
        createdAt: new Date().toISOString()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding resource:', error)
      throw new Error('Failed to add resource')
    }
  }

  // Get all resources from Firestore
  static async getResources(): Promise<Resource[]> {
    try {
      const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[]
    } catch (error) {
      console.error('Error getting resources:', error)
      throw new Error('Failed to get resources')
    }
  }

  // Update resource in Firestore
  static async updateResource(id: string, updates: Partial<Resource>): Promise<void> {
    try {
      const docRef = doc(db, 'resources', id)
      await updateDoc(docRef, updates)
    } catch (error) {
      console.error('Error updating resource:', error)
      throw new Error('Failed to update resource')
    }
  }

  // Delete resource from Firestore and Storage
  static async deleteResource(resource: Resource): Promise<void> {
    try {
      // Delete from Firestore
      const docRef = doc(db, 'resources', resource.id)
      await deleteDoc(docRef)

      // Delete file from Storage if it's a Firebase URL
      if (resource.url && resource.url.startsWith('https://firebasestorage.googleapis.com')) {
        const storageRef = ref(storage, resource.url)
        await deleteObject(storageRef)
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      throw new Error('Failed to delete resource')
    }
  }

  // Get storage usage (approximate)
  static async getStorageUsage(): Promise<{ used: number; total: number }> {
    try {
      const listRef = ref(storage, 'resources')
      const result = await listAll(listRef)
      
      // This is a simplified calculation - Firebase doesn't provide direct storage usage
      // In a real app, you'd track this in Firestore
      return {
        used: result.items.length * 1024 * 1024, // Approximate 1MB per file
        total: 5 * 1024 * 1024 * 1024 // 5GB free tier
      }
    } catch (error) {
      console.error('Error getting storage usage:', error)
      return { used: 0, total: 5 * 1024 * 1024 * 1024 }
    }
  }

  // Generate unique filename
  static generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    return `${timestamp}_${randomString}.${extension}`
  }
} 