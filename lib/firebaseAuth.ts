import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth'
import app from './firebase'

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export function signInWithGoogle() {
  return signInWithPopup(auth, provider)
}

export function signOutUser() {
  return signOut(auth)
}

export function onUserStateChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export { auth } 