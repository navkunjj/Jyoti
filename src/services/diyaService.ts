// JYOTI — Global Diya Service
// Manages global diya counts, country statistics, and user lighting state.
// Designed with a clean modular pattern ready for Firebase Firestore / Realtime DB integration.

export interface CountryStats {
  id: string; // ISO 3166-1 numeric string (matches Natural Earth / world-atlas)
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

// Baseline statistics for 60+ key countries with realistic global diaspora distributions
export const INITIAL_COUNTRIES: CountryStats[] = [
  { id: '356', name: 'India', code: 'IN', flag: '🇮🇳', diyas: 348210, lat: 20.5937, lng: 78.9629 },
  { id: '840', name: 'United States', code: 'US', flag: '🇺🇸', diyas: 104520, lat: 37.0902, lng: -95.7129 },
  { id: '826', name: 'United Kingdom', code: 'GB', flag: '🇬🇧', diyas: 68430, lat: 55.3781, lng: -3.436 },
  { id: '124', name: 'Canada', code: 'CA', flag: '🇨🇦', diyas: 51240, lat: 56.1304, lng: -106.3468 },
  { id: '784', name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', diyas: 41890, lat: 23.4241, lng: 53.8478 },
  { id: '036', name: 'Australia', code: 'AU', flag: '🇦🇺', diyas: 33760, lat: -25.2744, lng: 133.7751 },
  { id: '702', name: 'Singapore', code: 'SG', flag: '🇸🇬', diyas: 24510, lat: 1.3521, lng: 103.8198 },
  { id: '458', name: 'Malaysia', code: 'MY', flag: '🇲🇾', diyas: 21870, lat: 4.2105, lng: 101.9758 },
  { id: '528', name: 'Netherlands', code: 'NL', flag: '🇳🇱', diyas: 15420, lat: 52.1326, lng: 5.2913 },
  { id: '524', name: 'Nepal', code: 'NP', flag: '🇳🇵', diyas: 14890, lat: 28.3949, lng: 84.124 },
  { id: '276', name: 'Germany', code: 'DE', flag: '🇩🇪', diyas: 13950, lat: 51.1657, lng: 10.4515 },
  { id: '250', name: 'France', code: 'FR', flag: '🇫🇷', diyas: 12430, lat: 46.2276, lng: 2.2137 },
  { id: '554', name: 'New Zealand', code: 'NZ', flag: '🇳🇿', diyas: 11200, lat: -40.9006, lng: 174.886 },
  { id: '710', name: 'South Africa', code: 'ZA', flag: '🇿🇦', diyas: 10840, lat: -30.5595, lng: 22.9375 },
  { id: '484', name: 'Mexico', code: 'MX', flag: '🇲🇽', diyas: 8760, lat: 23.6345, lng: -102.5528 },
  { id: '076', name: 'Brazil', code: 'BR', flag: '🇧🇷', diyas: 7920, lat: -14.235, lng: -51.9253 },
  { id: '144', name: 'Sri Lanka', code: 'LK', flag: '🇱🇰', diyas: 7120, lat: 7.8731, lng: 80.7718 },
  { id: '392', name: 'Japan', code: 'JP', flag: '🇯🇵', diyas: 6840, lat: 36.2048, lng: 138.2529 },
  { id: '756', name: 'Switzerland', code: 'CH', flag: '🇨🇭', diyas: 5890, lat: 46.8182, lng: 8.2275 },
  { id: '380', name: 'Italy', code: 'IT', flag: '🇮🇹', diyas: 5430, lat: 41.8719, lng: 12.5674 },
  { id: '682', name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', diyas: 5310, lat: 23.8859, lng: 45.0792 },
  { id: '050', name: 'Bangladesh', code: 'BD', flag: '🇧🇩', diyas: 5180, lat: 23.685, lng: 90.3563 },
  { id: '724', name: 'Spain', code: 'ES', flag: '🇪🇸', diyas: 4890, lat: 40.4637, lng: -3.7492 },
  { id: '360', name: 'Indonesia', code: 'ID', flag: '🇮🇩', diyas: 4320, lat: -0.7893, lng: 113.9213 },
  { id: '410', name: 'South Korea', code: 'KR', flag: '🇰🇷', diyas: 4190, lat: 35.9078, lng: 127.7669 },
  { id: '372', name: 'Ireland', code: 'IE', flag: '🇮🇪', diyas: 4110, lat: 53.1424, lng: -7.6921 },
  { id: '764', name: 'Thailand', code: 'TH', flag: '🇹🇭', diyas: 3950, lat: 15.87, lng: 100.9925 },
  { id: '752', name: 'Sweden', code: 'SE', flag: '🇸🇪', diyas: 3640, lat: 60.1282, lng: 18.6435 },
  { id: '586', name: 'Pakistan', code: 'PK', flag: '🇵🇰', diyas: 3410, lat: 30.3753, lng: 69.3451 },
  { id: '578', name: 'Norway', code: 'NO', flag: '🇳🇴', diyas: 3090, lat: 60.472, lng: 8.4689 },
  { id: '208', name: 'Denmark', code: 'DK', flag: '🇩🇰', diyas: 2880, lat: 56.2639, lng: 9.5018 },
  { id: '056', name: 'Belgium', code: 'BE', flag: '🇧🇪', diyas: 2790, lat: 50.5039, lng: 4.4699 },
  { id: '040', name: 'Austria', code: 'AT', flag: '🇦🇹', diyas: 2610, lat: 47.5162, lng: 14.5501 },
  { id: '616', name: 'Poland', code: 'PL', flag: '🇵🇱', diyas: 2430, lat: 51.9194, lng: 19.1451 },
  { id: '620', name: 'Portugal', code: 'PT', flag: '🇵🇹', diyas: 2310, lat: 39.3999, lng: -8.2245 },
  { id: '504', name: 'Morocco', code: 'MA', flag: '🇲🇦', diyas: 2180, lat: 31.7917, lng: -7.0926 },
  { id: '462', name: 'Maldives', code: 'MV', flag: '🇲🇻', diyas: 1850, lat: 3.2028, lng: 73.2207 },
  { id: '246', name: 'Finland', code: 'FI', flag: '🇫🇮', diyas: 1810, lat: 61.9241, lng: 25.7482 },
  { id: '792', name: 'Turkey', code: 'TR', flag: '🇹🇷', diyas: 1720, lat: 38.9637, lng: 35.2433 },
  { id: '376', name: 'Israel', code: 'IL', flag: '🇮🇱', diyas: 1690, lat: 31.0461, lng: 34.8516 },
  { id: '300', name: 'Greece', code: 'GR', flag: '🇬🇷', diyas: 1540, lat: 39.0742, lng: 21.8243 },
  { id: '156', name: 'China', code: 'CN', flag: '🇨🇳', diyas: 1490, lat: 35.8617, lng: 104.1954 },
  { id: '643', name: 'Russia', code: 'RU', flag: '🇷🇺', diyas: 1410, lat: 61.524, lng: 105.3188 },
  { id: '404', name: 'Kenya', code: 'KE', flag: '🇰🇪', diyas: 1390, lat: -0.0236, lng: 37.9062 },
  { id: '834', name: 'Tanzania', code: 'TZ', flag: '🇹🇿', diyas: 1280, lat: -6.369, lng: 34.8888 },
  { id: '566', name: 'Nigeria', code: 'NG', flag: '🇳🇬', diyas: 1210, lat: 9.082, lng: 8.6753 },
  { id: '480', name: 'Mauritius', code: 'MU', flag: '🇲🇺', diyas: 2450, lat: -20.3484, lng: 57.5522 },
  { id: '242', name: 'Fiji', code: 'FJ', flag: '🇫🇯', diyas: 1980, lat: -17.7134, lng: 178.065 },
  { id: '780', name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹', diyas: 1840, lat: 10.6918, lng: -61.2225 },
  { id: '328', name: 'Guyana', code: 'GY', flag: '🇬🇾', diyas: 1620, lat: 4.8604, lng: -58.9302 },
  { id: '740', name: 'Suriname', code: 'SR', flag: '🇸🇷', diyas: 1350, lat: 3.9193, lng: -56.0278 },
  { id: '608', name: 'Philippines', code: 'PH', flag: '🇵🇭', diyas: 1290, lat: 12.8797, lng: 121.774 },
  { id: '704', name: 'Vietnam', code: 'VN', flag: '🇻🇳', diyas: 1180, lat: 14.0583, lng: 108.2772 },
  { id: '032', name: 'Argentina', code: 'AR', flag: '🇦🇷', diyas: 1120, lat: -38.4161, lng: -63.6167 },
  { id: '152', name: 'Chile', code: 'CL', flag: '🇨🇱', diyas: 1040, lat: -35.6751, lng: -71.543 },
  { id: '818', name: 'Egypt', code: 'EG', flag: '🇪🇬', diyas: 980, lat: 26.8206, lng: 30.8025 },
  { id: '414', name: 'Kuwait', code: 'KW', flag: '🇰🇼', diyas: 3420, lat: 29.3117, lng: 47.4818 },
  { id: '634', name: 'Qatar', code: 'QA', flag: '🇶🇦', diyas: 3150, lat: 25.3548, lng: 51.1839 },
  { id: '512', name: 'Oman', code: 'OM', flag: '🇴🇲', diyas: 2280, lat: 21.4735, lng: 55.9754 },
  { id: '048', name: 'Bahrain', code: 'BH', flag: '🇧🇭', diyas: 1940, lat: 26.0667, lng: 50.5577 }
];

const LOCAL_STORAGE_KEY_LIT = 'jyoti_user_diya_lit';
const LOCAL_STORAGE_KEY_TIME = 'jyoti_user_diya_lit_at';
const LOCAL_STORAGE_KEY_COUNTRY = 'jyoti_user_diya_country';
const LOCAL_STORAGE_KEY_INCREMENT = 'jyoti_custom_diya_increments';

class DiyaService {
  private targetGoal = 1000000;
  private listeners: Set<() => void> = new Set();
  private countriesMap: Map<string, CountryStats> = new Map();
  private userIncrements: number = 0;

  constructor() {
    this.init();
  }

  private init() {
    // Populate base countries
    INITIAL_COUNTRIES.forEach((c) => {
      this.countriesMap.set(c.id, { ...c });
    });

    // Load any local increments
    if (typeof window !== 'undefined') {
      try {
        const storedInc = localStorage.getItem(LOCAL_STORAGE_KEY_INCREMENT);
        if (storedInc) {
          this.userIncrements = parseInt(storedInc, 10) || 0;
        }
      } catch (err) {
        console.warn('LocalStorage error in DiyaService:', err);
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jyoti:diya-updated'));
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
    let sum = 0;
    this.countriesMap.forEach((c) => {
      sum += c.diyas;
    });
    sum += this.userIncrements;

    return {
      totalDiyas: sum,
      targetGoal: this.targetGoal,
      countriesCount: 148, // 148 active participating nations
      lastUpdated: new Date().toISOString(),
    };
  }

  public getCountries(): CountryStats[] {
    return Array.from(this.countriesMap.values()).sort((a, b) => b.diyas - a.diyas);
  }

  public getCountryById(id: string): CountryStats | undefined {
    return this.countriesMap.get(id);
  }

  /**
   * Light a diya for the current user.
   * Enforces:
   * 1. Only one diya per user across refreshes/revisits.
   * 2. Increments the global count and targeted country count.
   * 3. Persists in localStorage.
   * 4. Fires notifications to UI.
   * 
   * NOTE: When Firebase is connected, this method can also call:
   * await setDoc(doc(db, 'users', userId), { litAt: serverTimestamp() });
   * await updateDoc(doc(db, 'stats', 'global'), { total: increment(1) });
   */
  public lightDiya(countryId: string = '356'): { success: boolean; message: string } {
    const currentState = this.getUserDiyaState();
    if (currentState.isLit) {
      return { success: false, message: 'You have already lit your Diya! It continues burning bright.' };
    }

    try {
      const now = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_KEY_LIT, 'true');
      localStorage.setItem(LOCAL_STORAGE_KEY_TIME, now);
      localStorage.setItem(LOCAL_STORAGE_KEY_COUNTRY, countryId);

      this.userIncrements += 1;
      localStorage.setItem(LOCAL_STORAGE_KEY_INCREMENT, this.userIncrements.toString());

      // Increment country count
      const country = this.countriesMap.get(countryId);
      if (country) {
        country.diyas += 1;
      }

      this.notify();
      return { success: true, message: 'Your Diya has been lit and added to the world!' };
    } catch (err) {
      console.error('Error persisting diya state:', err);
      return { success: false, message: 'Could not record diya lighting.' };
    }
  }
}

export const diyaService = new DiyaService();

