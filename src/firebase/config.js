import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

// Default Firebase Configuration template for DZONE COLLECTION
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAPqDw3JXNFrjufWNYE9kmabv37Px6keSo",
  authDomain: "dzone-collection.firebaseapp.com",
  projectId: "dzone-collection",
  storageBucket: "dzone-collection.firebasestorage.app",
  messagingSenderId: "517715641005",
  appId: "1:517715641005:web:027e7b9724d94d90bdbc24",
  measurementId: "G-MH7CNZV34P"
};

const STORAGE_KEY_FIREBASE = 'dzone_firebase_config_v1';

// Clean quotes, commas, and trailing whitespace from string inputs
const cleanVal = (val) => {
  if (!val || typeof val !== 'string') return val || '';
  return val.replace(/^["'\s]+|["',\s]+$/g, '').trim();
};

export const getFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FIREBASE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const cleaned = {};
        for (const [k, v] of Object.entries(parsed)) {
          cleaned[k] = cleanVal(v);
        }
        return { ...DEFAULT_FIREBASE_CONFIG, ...cleaned };
      }
    }
  } catch (err) {}
  
  const defaultCleaned = {};
  for (const [k, v] of Object.entries(DEFAULT_FIREBASE_CONFIG)) {
    defaultCleaned[k] = cleanVal(v);
  }
  return defaultCleaned;
};

export const saveFirebaseConfig = (newConfig) => {
  try {
    const cleaned = {};
    if (newConfig && typeof newConfig === 'object') {
      for (const [k, v] of Object.entries(newConfig)) {
        cleaned[k] = cleanVal(v);
      }
    }
    localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(cleaned));
  } catch (e) {}
};

let app = null;
let db = null;
let storage = null;

const currentConfig = getFirebaseConfig();

try {
  if (currentConfig.apiKey && cleanVal(currentConfig.apiKey) !== "") {
    app = !getApps().length ? initializeApp(currentConfig) : getApp();
    db = getFirestore(app);
    try {
      storage = getStorage(app);
    } catch (sErr) {
      console.warn("Firebase Storage init warning:", sErr);
    }
    console.log("🔥 Firebase initialized successfully for DZONE COLLECTION!");
  }
} catch (err) {
  console.warn("Firebase initialization warning:", err);
}

export { 
  app, 
  db, 
  storage, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  updateDoc,
  ref,
  uploadBytes,
  getDownloadURL
};
