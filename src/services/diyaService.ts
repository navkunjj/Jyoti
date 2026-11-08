// JYOTI — Global Diya Service
// Persistent Cloud Firestore backend for global diya statistics and real-time synchronization.
// Strictly real data: all baseline counters initialize to 0.

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  increment,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface CountryStats {
  id: string; // ISO 3166-1 numeric string matching world-atlas
  name: string;
  code: string;
  flag: string;
  diyas: number;
  lat: number;
  lng: number;
}

export interface GlobalDiyaStats {
  totalDiyas: number;
  targetGoal: number;
  countriesCount: number;
  lastUpdated: string;
}

export interface UserDiyaState {
  isLit: boolean;
  litAt: string | null;
  countryCode?: string;
  countryName?: string;
}

export interface RecentDiya {
  id: string;
  countryId: string;
  countryCode: string;
  countryName: string;
  lat?: number;
  lng?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp?: any;
  clientTimestamp: string;
}

// Country catalog with official coordinates (all counters strictly start at 0)
export const INITIAL_COUNTRIES: CountryStats[] = [
  { id: '356', name: 'India', code: 'IN', flag: '🇮🇳', diyas: 0, lat: 20.5937, lng: 78.9629 },
  { id: '840', name: 'United States', code: 'US', flag: '🇺🇸', diyas: 0, lat: 37.0902, lng: -95.7129 },
  { id: '826', name: 'United Kingdom', code: 'GB', flag: '🇬🇧', diyas: 0, lat: 55.3781, lng: -3.436 },
  { id: '124', name: 'Canada', code: 'CA', flag: '🇨🇦', diyas: 0, lat: 56.1304, lng: -106.3468 },
  { id: '784', name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', diyas: 0, lat: 23.4241, lng: 53.8478 },
  { id: '036', name: 'Australia', code: 'AU', flag: '🇦🇺', diyas: 0, lat: -25.2744, lng: 133.7751 },
  { id: '702', name: 'Singapore', code: 'SG', flag: '🇸🇬', diyas: 0, lat: 1.3521, lng: 103.8198 },
  { id: '458', name: 'Malaysia', code: 'MY', flag: '🇲🇾', diyas: 0, lat: 4.2105, lng: 101.9758 },
  { id: '528', name: 'Netherlands', code: 'NL', flag: '🇳🇱', diyas: 0, lat: 52.1326, lng: 5.2913 },
  { id: '524', name: 'Nepal', code: 'NP', flag: '🇳🇵', diyas: 0, lat: 28.3949, lng: 84.124 },
  { id: '276', name: 'Germany', code: 'DE', flag: '🇩🇪', diyas: 0, lat: 51.1657, lng: 10.4515 },
  { id: '250', name: 'France', code: 'FR', flag: '🇫🇷', diyas: 0, lat: 46.2276, lng: 2.2137 },
  { id: '554', name: 'New Zealand', code: 'NZ', flag: '🇳🇿', diyas: 0, lat: -40.9006, lng: 174.886 },
  { id: '710', name: 'South Africa', code: 'ZA', flag: '🇿🇦', diyas: 0, lat: -30.5595, lng: 22.9375 },
  { id: '484', name: 'Mexico', code: 'MX', flag: '🇲🇽', diyas: 0, lat: 23.6345, lng: -102.5528 },
  { id: '076', name: 'Brazil', code: 'BR', flag: '🇧🇷', diyas: 0, lat: -14.235, lng: -51.9253 },
  { id: '144', name: 'Sri Lanka', code: 'LK', flag: '🇱🇰', diyas: 0, lat: 7.8731, lng: 80.7718 },
  { id: '392', name: 'Japan', code: 'JP', flag: '🇯🇵', diyas: 0, lat: 36.2048, lng: 138.2529 },
  { id: '756', name: 'Switzerland', code: 'CH', flag: '🇨🇭', diyas: 0, lat: 46.8182, lng: 8.2275 },
  { id: '380', name: 'Italy', code: 'IT', flag: '🇮🇹', diyas: 0, lat: 41.8719, lng: 12.5674 },
  { id: '682', name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', diyas: 0, lat: 23.8859, lng: 45.0792 },
  { id: '050', name: 'Bangladesh', code: 'BD', flag: '🇧🇩', diyas: 0, lat: 23.685, lng: 90.3563 },
  { id: '724', name: 'Spain', code: 'ES', flag: '🇪🇸', diyas: 0, lat: 40.4637, lng: -3.7492 },
  { id: '360', name: 'Indonesia', code: 'ID', flag: '🇮🇩', diyas: 0, lat: -0.7893, lng: 113.9213 },
  { id: '410', name: 'South Korea', code: 'KR', flag: '🇰🇷', diyas: 0, lat: 35.9078, lng: 127.7669 },
  { id: '372', name: 'Ireland', code: 'IE', flag: '🇮🇪', diyas: 0, lat: 53.1424, lng: -7.6921 },
  { id: '764', name: 'Thailand', code: 'TH', flag: '🇹🇭', diyas: 0, lat: 15.87, lng: 100.9925 },
  { id: '752', name: 'Sweden', code: 'SE', flag: '🇸🇪', diyas: 0, lat: 60.1282, lng: 18.6435 },
  { id: '586', name: 'Pakistan', code: 'PK', flag: '🇵🇰', diyas: 0, lat: 30.3753, lng: 69.3451 },
  { id: '578', name: 'Norway', code: 'NO', flag: '🇳🇴', diyas: 0, lat: 60.472, lng: 8.4689 },
  { id: '208', name: 'Denmark', code: 'DK', flag: '🇩🇰', diyas: 0, lat: 56.2639, lng: 9.5018 },
  { id: '056', name: 'Belgium', code: 'BE', flag: '🇧🇪', diyas: 0, lat: 50.5039, lng: 4.4699 },
  { id: '040', name: 'Austria', code: 'AT', flag: '🇦🇹', diyas: 0, lat: 47.5162, lng: 14.5501 },
  { id: '616', name: 'Poland', code: 'PL', flag: '🇵🇱', diyas: 0, lat: 51.9194, lng: 19.1451 },
  { id: '620', name: 'Portugal', code: 'PT', flag: '🇵🇹', diyas: 0, lat: 39.3999, lng: -8.2245 },
  { id: '504', name: 'Morocco', code: 'MA', flag: '🇲🇦', diyas: 0, lat: 31.7917, lng: -7.0926 },
  { id: '462', name: 'Maldives', code: 'MV', flag: '🇲🇻', diyas: 0, lat: 3.2028, lng: 73.2207 },
  { id: '246', name: 'Finland', code: 'FI', flag: '🇫🇮', diyas: 0, lat: 61.9241, lng: 25.7482 },
  { id: '792', name: 'Turkey', code: 'TR', flag: '🇹🇷', diyas: 0, lat: 38.9637, lng: 35.2433 },
  { id: '376', name: 'Israel', code: 'IL', flag: '🇮🇱', diyas: 0, lat: 31.0461, lng: 34.8516 },
  { id: '300', name: 'Greece', code: 'GR', flag: '🇬🇷', diyas: 0, lat: 39.0742, lng: 21.8243 },
  { id: '156', name: 'China', code: 'CN', flag: '🇨🇳', diyas: 0, lat: 35.8617, lng: 104.1954 },
  { id: '643', name: 'Russia', code: 'RU', flag: '🇷🇺', diyas: 0, lat: 61.524, lng: 105.3188 },
  { id: '404', name: 'Kenya', code: 'KE', flag: '🇰🇪', diyas: 0, lat: -0.0236, lng: 37.9062 },
  { id: '834', name: 'Tanzania', code: 'TZ', flag: '🇹🇿', diyas: 0, lat: -6.369, lng: 34.8888 },
  { id: '566', name: 'Nigeria', code: 'NG', flag: '🇳🇬', diyas: 0, lat: 9.082, lng: 8.6753 },
  { id: '480', name: 'Mauritius', code: 'MU', flag: '🇲🇺', diyas: 0, lat: -20.3484, lng: 57.5522 },
  { id: '242', name: 'Fiji', code: 'FJ', flag: '🇫🇯', diyas: 0, lat: -17.7134, lng: 178.065 },
  { id: '780', name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹', diyas: 0, lat: 10.6918, lng: -61.2225 },
  { id: '328', name: 'Guyana', code: 'GY', flag: '🇬🇾', diyas: 0, lat: 4.8604, lng: -58.9302 },
  { id: '740', name: 'Suriname', code: 'SR', flag: '🇸🇷', diyas: 0, lat: 3.9193, lng: -56.0278 },
  { id: '608', name: 'Philippines', code: 'PH', flag: '🇵🇭', diyas: 0, lat: 12.8797, lng: 121.774 },
  { id: '704', name: 'Vietnam', code: 'VN', flag: '🇻🇳', diyas: 0, lat: 14.0583, lng: 108.2772 },
  { id: '032', name: 'Argentina', code: 'AR', flag: '🇦🇷', diyas: 0, lat: -38.4161, lng: -63.6167 },
  { id: '152', name: 'Chile', code: 'CL', flag: '🇨🇱', diyas: 0, lat: -35.6751, lng: -71.543 },
  { id: '818', name: 'Egypt', code: 'EG', flag: '🇪🇬', diyas: 0, lat: 26.8206, lng: 30.8025 },
  { id: '414', name: 'Kuwait', code: 'KW', flag: '🇰🇼', diyas: 0, lat: 29.3117, lng: 47.4818 },
  { id: '634', name: 'Qatar', code: 'QA', flag: '🇶🇦', diyas: 0, lat: 25.3548, lng: 51.1839 },
  { id: '512', name: 'Oman', code: 'OM', flag: '🇴🇲', diyas: 0, lat: 21.4735, lng: 55.9754 },
  { id: '048', name: 'Bahrain', code: 'BH', flag: '🇧🇭', diyas: 0, lat: 26.0667, lng: 50.5577 },
];

const LOCAL_STORAGE_KEY_LIT = 'jyoti_user_diya_lit';
const LOCAL_STORAGE_KEY_TIME = 'jyoti_user_diya_lit_at';
const LOCAL_STORAGE_KEY_COUNTRY = 'jyoti_user_diya_country';

class DiyaService {
  private targetGoal = 1000000;
  private totalDiyas: number = 0;
  private countriesCount: number = 0;
  private lastUpdated: string = new Date().toISOString();
  private listeners: Set<() => void> = new Set();
  private recentDiyasListeners: Set<(diyas: RecentDiya[]) => void> = new Set();
  private countriesMap: Map<string, CountryStats> = new Map();
  private recentDiyas: RecentDiya[] = [];
  private unsubscribeStats: (() => void) | null = null;
  private unsubscribeRecentDiyas: (() => void) | null = null;

  constructor() {
    this.init();
    this.initFirestoreListeners();
  }

  private init() {
    INITIAL_COUNTRIES.forEach((c) => {
      this.countriesMap.set(c.id, { ...c });
    });
  }

  private initFirestoreListeners() {
    if (typeof window === 'undefined') return;

    try {
      // 1. Live listener on the persistent stats/global document
      const statsDocRef = doc(db, 'stats', 'global');
      this.unsubscribeStats = onSnapshot(
        statsDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            this.totalDiyas = typeof data.totalDiyas === 'number' ? data.totalDiyas : 0;
            if (typeof data.targetGoal === 'number') {
              this.targetGoal = data.targetGoal;
            }
            if (data.lastUpdated) {
              this.lastUpdated = data.lastUpdated.toDate ? data.lastUpdated.toDate().toISOString() : new Date().toISOString();
            }

            // Sync per-country counts from actual Firestore database
            let calculatedCountriesCount = 0;
            if (data.countryCounts && typeof data.countryCounts === 'object') {
              Object.entries(data.countryCounts).forEach(([cid, count]) => {
                const country = this.countriesMap.get(cid);
                const val = typeof count === 'number' ? count : 0;
                if (country) {
                  country.diyas = val;
                }
                if (val > 0) {
                  calculatedCountriesCount++;
                }
              });
            }

            this.countriesCount = typeof data.countriesCount === 'number'
              ? data.countriesCount
              : calculatedCountriesCount;

            this.notify();
          } else {
            // Document does not exist yet; initialize without overwriting any production data
            this.bootstrapFirestoreStats();
          }
        },
        (error) => {
          console.warn('Firestore stats listener warning (using real local cache):', error.message);
        }
      );

      // 2. Real-time listener for the latest genuine lit diyas
      const diyasQuery = query(
        collection(db, 'diyas'),
        orderBy('timestamp', 'desc'),
        limit(20)
      );

      this.unsubscribeRecentDiyas = onSnapshot(
        diyasQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: RecentDiya[] = [];
            snapshot.forEach((docSnap) => {
              const d = docSnap.data();
              list.push({
                id: docSnap.id,
                countryId: d.countryId,
                countryCode: d.countryCode,
                countryName: d.countryName,
                lat: typeof d.lat === 'number' ? d.lat : undefined,
                lng: typeof d.lng === 'number' ? d.lng : undefined,
                timestamp: d.timestamp,
                clientTimestamp: d.clientTimestamp || new Date().toISOString(),
              });
            });
            this.recentDiyas = list;
            this.notifyRecentDiyas();
          }
        },
        (error) => {
          console.warn('Firestore recent diyas onSnapshot warning:', error.message);
        }
      );
    } catch (err) {
      console.warn('Could not initialize Firestore diya listeners:', err);
    }
  }

  private async bootstrapFirestoreStats() {
    try {
      const statsDocRef = doc(db, 'stats', 'global');
      await setDoc(
        statsDocRef,
        {
          totalDiyas: 0,
          targetGoal: 1000000,
          countriesCount: 0,
          lastUpdated: serverTimestamp(),
          countryCounts: {},
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not bootstrap Firestore stats document:', err);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeToRecentDiyas(callback: (diyas: RecentDiya[]) => void): () => void {
    this.recentDiyasListeners.add(callback);
    callback(this.recentDiyas);
    return () => {
      this.recentDiyasListeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jyoti:diya-updated'));
    }
  }

  private notifyRecentDiyas() {
    this.recentDiyasListeners.forEach((fn) => fn(this.recentDiyas));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('jyoti:recent-diyas-updated', { detail: this.recentDiyas })
      );
    }
  }

  public getUserDiyaState(): UserDiyaState {
    if (typeof window === 'undefined') {
      return { isLit: false, litAt: null };
    }
    try {
      const isLit = localStorage.getItem(LOCAL_STORAGE_KEY_LIT) === 'true';
      const litAt = localStorage.getItem(LOCAL_STORAGE_KEY_TIME);
      const countryCode = localStorage.getItem(LOCAL_STORAGE_KEY_COUNTRY) || undefined;
      return { isLit, litAt, countryCode };
    } catch {
      return { isLit: false, litAt: null };
    }
  }

  public getGlobalStats(): GlobalDiyaStats {
    return {
      totalDiyas: this.totalDiyas,
      targetGoal: this.targetGoal,
      countriesCount: this.countriesCount,
      lastUpdated: this.lastUpdated,
    };
  }

  public getCountries(): CountryStats[] {
    return Array.from(this.countriesMap.values()).sort((a, b) => b.diyas - a.diyas);
  }

  public getCountryById(id: string): CountryStats | undefined {
    return this.countriesMap.get(id);
  }

  public getRecentDiyas(): RecentDiya[] {
    return [...this.recentDiyas];
  }

  /**
   * Light a diya and atomically update Firestore database.
   */
  public async lightDiya(
    countryId: string = '356',
    coords?: { lat?: number; lng?: number }
  ): Promise<{ success: boolean; message: string }> {
    const currentState = this.getUserDiyaState();
    if (currentState.isLit) {
      return { success: false, message: 'You have already lit your Diya! It continues burning bright.' };
    }

    const country = this.countriesMap.get(countryId) || this.countriesMap.get('356') || INITIAL_COUNTRIES[0];
    const now = new Date().toISOString();

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_LIT, 'true');
      localStorage.setItem(LOCAL_STORAGE_KEY_TIME, now);
      localStorage.setItem(LOCAL_STORAGE_KEY_COUNTRY, country.id);

      // Optimistic local update for instant UI feedback
      const wasZero = country.diyas === 0;
      country.diyas += 1;
      this.totalDiyas += 1;
      if (wasZero) {
        this.countriesCount += 1;
      }

      const optimisticDiya: RecentDiya = {
        id: `temp-${Date.now()}`,
        countryId: country.id,
        countryCode: country.code,
        countryName: country.name,
        lat: coords?.lat ?? country.lat,
        lng: coords?.lng ?? country.lng,
        clientTimestamp: now,
      };

      this.recentDiyas = [optimisticDiya, ...this.recentDiyas].slice(0, 20);
      this.notify();
      this.notifyRecentDiyas();

      // Atomic persistent sync to Cloud Firestore
      await this.syncDiyaToFirestore(country, now, coords);

      return {
        success: true,
        message: `Your Diya for ${country.name} has been lit and added to the world!`,
      };
    } catch (err) {
      console.error('Error lighting diya:', err);
      return { success: false, message: 'Could not record diya lighting.' };
    }
  }

  private async syncDiyaToFirestore(
    country: CountryStats,
    clientIso: string,
    coords?: { lat?: number; lng?: number }
  ) {
    try {
      // 1. Create document in 'diyas'
      const diyaRef = doc(collection(db, 'diyas'));
      const diyaDocData = {
        id: diyaRef.id,
        countryId: country.id,
        countryCode: country.code,
        countryName: country.name,
        lat: coords?.lat ?? country.lat,
        lng: coords?.lng ?? country.lng,
        timestamp: serverTimestamp(),
        clientTimestamp: clientIso,
      };
      await setDoc(diyaRef, diyaDocData);

      // 2. Atomic increment on 'stats/global'
      const statsRef = doc(db, 'stats', 'global');
      const isNewCountry = country.diyas === 1;

      try {
        await updateDoc(statsRef, {
          totalDiyas: increment(1),
          [`countryCounts.${country.id}`]: increment(1),
          ...(isNewCountry ? { countriesCount: increment(1) } : {}),
          lastUpdated: serverTimestamp(),
        });
      } catch {
        // Document didn't exist yet; create with merge:
        await setDoc(
          statsRef,
          {
            totalDiyas: increment(1),
            targetGoal: this.targetGoal,
            countriesCount: 1,
            lastUpdated: serverTimestamp(),
            countryCounts: {
              [country.id]: increment(1),
            },
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn('Firestore sync warning (local state preserved):', err);
    }
  }

  public cleanup() {
    if (this.unsubscribeStats) {
      this.unsubscribeStats();
      this.unsubscribeStats = null;
    }
    if (this.unsubscribeRecentDiyas) {
      this.unsubscribeRecentDiyas();
      this.unsubscribeRecentDiyas = null;
    }
  }
}

export const diyaService = new DiyaService();
