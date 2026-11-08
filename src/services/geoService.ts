// JYOTI — Client Geolocation Service
// Automatically detects user's location via public IP with robust fallbacks.

export interface UserLocation {
  country: string;
  countryCode: string;
  countryId: string;
  lat: number;
  lng: number;
  isDetected: boolean;
}

const COUNTRY_CODE_TO_ID: Record<string, string> = {
  IN: '356', US: '840', GB: '826', CA: '124', AE: '784', AU: '036',
  SG: '702', MY: '458', NL: '528', NP: '524', DE: '276', FR: '250',
  NZ: '554', ZA: '710', MX: '484', BR: '076', LK: '144', JP: '392',
  CH: '756', IT: '380', SA: '682', BD: '050', ES: '724', ID: '360',
  KR: '410', IE: '372', TH: '764', SE: '566', PK: '586', NO: '578',
  DK: '208', BE: '056', AT: '040', PL: '616', PT: '620', MU: '480',
  FJ: '242', TT: '780', GY: '328', QA: '634', KW: '414', OM: '512',
};

const DEFAULT_LOCATION: UserLocation = {
  country: 'India',
  countryCode: 'IN',
  countryId: '356',
  lat: 20.5937,
  lng: 78.9629,
  isDetected: false,
};

let cachedLocation: UserLocation | null = null;

export async function detectUserLocation(): Promise<UserLocation> {
  if (cachedLocation) return cachedLocation;

  // Check sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('jyoti_user_geo');
      if (stored) {
        cachedLocation = JSON.parse(stored);
        return cachedLocation!;
      }
    } catch {
      // Ignore storage errors
    }
  }

  // 1. Try ipapi.co
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        const countryCode = String(data.country_code).toUpperCase();
        const countryId = COUNTRY_CODE_TO_ID[countryCode] || '356';
        const loc: UserLocation = {
          country: data.country_name || 'Your Location',
          countryCode,
          countryId,
          lat: typeof data.latitude === 'number' ? data.latitude : DEFAULT_LOCATION.lat,
          lng: typeof data.longitude === 'number' ? data.longitude : DEFAULT_LOCATION.lng,
          isDetected: true,
        };
        cacheLocation(loc);
        return loc;
      }
    }
  } catch {
    // Continue to fallback
  }

  // 2. Fallback to ipwho.is
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.country_code) {
        const countryCode = String(data.country_code).toUpperCase();
        const countryId = COUNTRY_CODE_TO_ID[countryCode] || '356';
        const loc: UserLocation = {
          country: data.country || 'Your Location',
          countryCode,
          countryId,
          lat: typeof data.latitude === 'number' ? data.latitude : DEFAULT_LOCATION.lat,
          lng: typeof data.longitude === 'number' ? data.longitude : DEFAULT_LOCATION.lng,
          isDetected: true,
        };
        cacheLocation(loc);
        return loc;
      }
    }
  } catch {
    // Continue to default
  }

  // 3. Graceful default fallback
  cacheLocation(DEFAULT_LOCATION);
  return DEFAULT_LOCATION;
}

function cacheLocation(loc: UserLocation) {
  cachedLocation = loc;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('jyoti_user_geo', JSON.stringify(loc));
    } catch {
      // Ignore
    }
  }
}

