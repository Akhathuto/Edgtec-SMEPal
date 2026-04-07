import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, collection, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, limit, addDoc, getDocFromServer } from 'firebase/firestore';
import firebaseConfigJson from './firebase-applet-config.json';

// Support environment variables for production deployment (e.g. Vercel)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

// Auth Helpers
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithGithub = () => signInWithPopup(auth, githubProvider);
export const loginWithMicrosoft = () => signInWithPopup(auth, microsoftProvider);

export const loginWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const registerWithEmail = (email: string, pass: string, name: string) => 
  createUserWithEmailAndPassword(auth, email, pass).then(async (result) => {
    await updateProfile(result.user, { displayName: name });
    return result;
  });

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const logout = () => signOut(auth);

// Firestore Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'test'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();

// User Profile Helpers
export const saveUserProfile = async (userId: string, data: any) => {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserProfile = async (userId: string) => {
  const path = `users/${userId}`;
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const saveCompanyRegistration = async (userId: string, data: any) => {
  const path = `users/${userId}/registrations/current`;
  try {
    await setDoc(doc(db, 'users', userId, 'registrations', 'current'), {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getCompanyRegistration = async (userId: string) => {
  const path = `users/${userId}/registrations/current`;
  try {
    const regDoc = await getDoc(doc(db, 'users', userId, 'registrations', 'current'));
    return regDoc.exists() ? regDoc.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export { doc, collection, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, limit, addDoc, onAuthStateChanged };
export type { User };
