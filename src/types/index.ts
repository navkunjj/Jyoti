export interface Chapter {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
}

export interface ArtPiece {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  historicalContext: string;
  significance: string;
  image: string;
  accentColor: string;
  tags: string[];
}

export interface RegionalCelebration {
  id: string;
  name: string;
  title: string;
  location: string;
  era: string;
  description: string;
  tradition: string;
  quote: string;
  quoteSource: string;
  image: string;
  highlights: string[];
  motif: string;
}

export interface CelebrationEmotion {
  id: string;
  hindiTitle: string;
  englishTitle: string;
  subtitle: string;
  description: string;
  image: string;
  aspect: string;
  poeticNote: string;
}

export interface DiwaliWish {
  id: string;
  sender: string;
  recipient: string;
  blessingType: 'peace' | 'prosperity' | 'light' | 'togetherness';
  message: string;
  date: string;
}

