import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export interface UserCredits {
  credits: number;
  subscription: {
    plan: 'free' | 'basic' | 'premium';
    expiresAt: Date;
  };
}

// Initialize user credits when they first sign up
export async function initializeUserCredits(userId: string): Promise<void> {
  const userRef = doc(db, 'credits', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      credits: 2, // Free credits for new users
      subscription: {
        plan: 'free',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });
  }
}

// Get user's current credits
export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const userRef = doc(db, 'credits', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data() as UserCredits;
}

// Add credits to user's account
export async function addCredits(userId: string, amount: number): Promise<void> {
  const userRef = doc(db, 'credits', userId);
  await updateDoc(userRef, {
    credits: increment(amount)
  });
}

// Deduct credits for AI usage
export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  const userCredits = await getUserCredits(userId);
  
  if (!userCredits || userCredits.credits < amount) {
    return false; // Not enough credits
  }

  const userRef = doc(db, 'credits', userId);
  await updateDoc(userRef, {
    credits: increment(-amount)
  });

  return true;
}

// Update user's subscription
export async function updateSubscription(
  userId: string, 
  plan: 'free' | 'basic' | 'premium',
  durationMonths: number
): Promise<void> {
  const userRef = doc(db, 'credits', userId);
  const expiresAt = new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000);

  await updateDoc(userRef, {
    subscription: {
      plan,
      expiresAt
    }
  });

  // Add bonus credits based on plan
  const bonusCredits = plan === 'basic' ? 100 : plan === 'premium' ? 500 : 0;
  if (bonusCredits > 0) {
    await addCredits(userId, bonusCredits);
  }
}
