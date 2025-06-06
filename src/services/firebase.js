import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  // Your Firebase configuration will go here
  // You'll need to replace these with your actual Firebase project details
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Firestore functions
export const addItem = async (userId, category, subcategory, item) => {
  try {
    const itemsRef = collection(db, 'users', userId, 'items');
    const docRef = await addDoc(itemsRef, {
      ...item,
      category,
      subcategory,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getItems = async (userId, category, subcategory) => {
  try {
    const itemsRef = collection(db, 'users', userId, 'items');
    const q = query(
      itemsRef, 
      where('category', '==', category),
      where('subcategory', '==', subcategory)
    );
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return { items, error: null };
  } catch (error) {
    return { items: [], error: error.message };
  }
};

export const updateItem = async (userId, itemId, updatedData) => {
  try {
    const itemRef = doc(db, 'users', userId, 'items', itemId);
    await updateDoc(itemRef, {
      ...updatedData,
      updatedAt: new Date()
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteItem = async (userId, itemId) => {
  try {
    const itemRef = doc(db, 'users', userId, 'items', itemId);
    await deleteDoc(itemRef);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getItemByBarcode = async (barcode) => {
  try {
    // This is a placeholder for a real barcode lookup service
    // In a real app, you would connect to a product database API
    // For demo purposes, we'll return mock data for a few barcodes
    const mockBarcodeData = {
      '9780201379624': { name: 'Tomatoes', category: 'Veg', subcategory: 'Vegetables' },
      '9780201379625': { name: 'Apples', category: 'Veg', subcategory: 'Fruits' },
      '9780201379626': { name: 'Chicken Breast', category: 'Non-Veg', subcategory: 'Chicken' },
      '9780201379627': { name: 'Eggs', category: 'Non-Veg', subcategory: 'Eggs' },
      '9780201379628': { name: 'Turmeric', category: 'Veg', subcategory: 'Spices' },
    };
    
    const itemData = mockBarcodeData[barcode];
    
    if (itemData) {
      return { item: itemData, error: null };
    } else {
      return { item: null, error: 'Product not found in database' };
    }
  } catch (error) {
    return { item: null, error: error.message };
  }
};

export { auth, db };