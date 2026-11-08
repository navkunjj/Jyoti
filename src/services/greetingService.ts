import { db } from '../firebase';
import { collection, addDoc, doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

export interface GreetingCardData {
  id?: string;
  to: string;
  message: string;
  from: string;
  createdAt?: any;
}

export const greetingService = {
  async saveGreeting(data: { to: string; message: string; from: string }): Promise<string> {
    const to = data.to.trim() || 'Dearest Friend';
    const message =
      data.message.trim() ||
      'May this Diwali bring happiness, good health, prosperity, and new beginnings into your life.';
    const from = data.from.trim() || 'A Well-Wisher';

    const docRef = await addDoc(collection(db, 'greetings'), {
      to,
      message,
      from,
      createdAt: serverTimestamp(),
    });

    // Increment global wishesShared counter
    try {
      const statsRef = doc(db, 'stats', 'global');
      await setDoc(statsRef, { wishesShared: increment(1) }, { merge: true });
    } catch (e) {
      console.warn('Failed to increment global wishesShared:', e);
    }

    return docRef.id;
  },

  async getGreeting(id: string): Promise<GreetingCardData | null> {
    try {
      const docRef = doc(db, 'greetings', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          id: snapshot.id,
          to: data.to || '',
          message: data.message || '',
          from: data.from || '',
          createdAt: data.createdAt,
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching greeting:', err);
      return null;
    }
  },
};

