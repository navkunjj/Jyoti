export interface RegionalDish {
  name: string;
  hindiName?: string;
  category: 'Sweet' | 'Savory' | 'Medicinal Rites';
  description: string;
  ingredients: string[];
}

export interface RegionData {
  id: string;
  slug: string;
  number: string;
  name: string;
  state: string;
  stateId: string; // ID corresponding to India SVG map state path
  title: string;
  tagline: string;
  shortDescription: string;
  heroImage: string;
  secondaryImage: string;
  accentColor: string; // from palette: Blush Pink #E8A1BC, Sage Teal #B8DAD3, Muted Violet #7668A7, etc.
  mapCoords: {
    xPercent: number; // percentage on responsive map
    yPercent: number;
    svgX: number; // coordinates in SVG viewBox (-491.5 -522.36 1638.55 1852.41)
    svgY: number;
  };
  theStory: {
    origin: string;
    philosophicalTheme: string;
    historicalEra: string;
    narrative: string;
  };
  traditions: Array<{
    title: string;
    timing: string;
    description: string;
  }>;
  artAndHeritage: {
    craftName: string;
    architectureType: string;
    materials: string;
    description: string;
  };
  festiveFlavours: RegionalDish[];
  interactiveModule: {
    type: 'diya-multiplier' | 'alpana-canvas' | 'ganga-deepdaan' | 'effigy-spark' | 'rangoli-composer' | 'kolam-generator';
    title: string;
    subtitle: string;
    instruction: string;
  };
  culturalFact: string;
  nextRegionSlug: string;
}

export const REGIONS_DATA: RegionData[] = [
  {
    id: 'ayodhya',
    slug: 'ayodhya',
    number: '01',
    name: 'Ayodhya',
    state: 'Uttar Pradesh',
    stateId: 'uttar_pradesh',
    title: 'The City of a Thousand Lights',
    tagline: 'Deepotsav along the holy river Sarayu',
    shortDescription:
      'Where the legendary return of Lord Rama transformed an ancient kingdom into a continuous sea of earthen lamps and sacred Vedic hymns.',
    heroImage: '/assets/ayodhya-deepotsav.jpg',
    secondaryImage: '/assets/celebration-diyas.jpg',
    accentColor: '#B8DAD3',
    mapCoords: {
      xPercent: 55,
      yPercent: 37,
      svgX: 430,
      svgY: 180,
    },
    theStory: {
      origin: 'Treta Yuga & The Valmiki Ramayana',
      philosophicalTheme: 'The Dawn of Righteousness (Dharma) Over Strife',
      historicalEra: 'Ancient Kosala Kingdom along the Sarayu River',
      narrative:
        'When Rama, Sita, and Lakshmana returned to Ayodhya after fourteen years of exile and the conquest of Lanka, the citizens illuminated every rooftop, threshold, and river step with clay lamps to pierce the dark Amavasya night. Today, the world-renowned Deepotsav sees millions of volunteers gather along the Ram Ki Paidi to set world records with over 2.5 million earthen lamps.',
    },
    traditions: [
      {
        title: 'Deepotsav along Ram Ki Paidi',
        timing: 'Diwali Eve (Choti Diwali dusk)',
        description:
          'Millions of hand-crafted mitti (clay) diyas are filled with pure mustard oil and cotton wicks. As twilight descends, a ceremonial spark travels along the ghats, turning the stone tiers into an undulating river of gold.',
      },
      {
        title: 'Sarayu Maha Aarti',
        timing: 'Twilight every festive evening',
        description:
          'Priests in saffron robes hoist brass multi-tiered aarti lamps weighing several kilograms, accompanied by ancient Vedic chants and the sounding of brass bells.',
      },
    ],
    artAndHeritage: {
      craftName: 'Awadhi Terracotta & Thali Engraving',
      architectureType: 'Nagara temple spires and ghat steps',
      materials: 'Riverbed alluvial clay, unpolished brass, yellow marigold garlands',
      description:
        'Ayodhya artisans utilize silt deposited by the monsoon waters of the Sarayu to throw shallow earthen lamps on manual wheels, a continuous line of sacred pottery unbroken for millennia.',
    },
    festiveFlavours: [
      {
        name: 'Ayodhya Khurchan Peda',
        hindiName: 'अयोध्या पेड़ा',
        category: 'Sweet',
        description:
          'Slow-caramelized buffalo milk solids pounded with green cardamom seeds and dusted with dried holy basil flower sugar.',
        ingredients: ['Mawa (Khoya)', 'Cardamom', 'Cane Sugar', 'Desi Ghee'],
      },
      {
        name: 'Awadhi Ghee Besan Ladoo',
        hindiName: 'बेसन के लड्डू',
        category: 'Sweet',
        description:
          'Coarsely milled Bengal gram roasted patiently in wood-churned A2 cow ghee until nutty, blended with boora sugar and melon seeds.',
        ingredients: ['Gram Flour', 'Pure Cow Ghee', 'Boora Sugar', 'Magaz Seeds'],
      },
    ],
    interactiveModule: {
      type: 'diya-multiplier',
      title: 'Deepotsav Sarayu Riverfront',
      subtitle: 'Kindle the Sacred Steps',
      instruction: 'Tap the riverfront tiers to awaken dancing clay lamps across the Sarayu waters.',
    },
    culturalFact:
      'In Ayodhya, every diya wick is spun by hand from raw desi cotton and soaked in mustard oil, believed to purify the autumn air after the monsoon rains.',
    nextRegionSlug: 'bengal',
  },
  {
    id: 'bengal',
    slug: 'bengal',
    number: '02',
    name: 'West Bengal',
    state: 'West Bengal',
    stateId: 'west_bengal',
    title: 'Where Art Meets Devotion',
    tagline: 'Kali Puja, Pandal Artistry & The Sacred Alpana',
    shortDescription:
      'While the subcontinent worships Goddess Lakshmi, Bengal honors the fierce, loving Mother Kali under the darkest new moon of autumn.',
    heroImage: '/assets/bengal-kali-puja.jpg',
    secondaryImage: '/assets/art-flowers.jpg',
    accentColor: '#E8A1BC',
    mapCoords: {
      xPercent: 72,
      yPercent: 46,
      svgX: 740,
      svgY: 340,
    },
    theStory: {
      origin: '18th-century Tantric & Shakta Revival',
      philosophicalTheme: 'The Annihilation of Ego & Celebration of Infinite Cosmic Light',
      historicalEra: 'Pioneered by Raja Krishnachandra of Nadia and Saint Ramprasad',
      narrative:
        'In Bengal, the Diwali new moon is consecrated to Shyama (Maa Kali). She represents the dark primordial void from which all creation emerges and into which all illusion dissolves. Instead of small quiet gatherings, communities erect magnificent temporary pavilions (pandals) decorated with handcrafted jute, clay, and lighting installations.',
    },
    traditions: [
      {
        title: 'Mahanisha Midnight Worship',
        timing: 'Kartik Amavasya midnight',
        description:
          'The sacred worship of Maa Kali begins at the stroke of midnight. Offerings of scarlet hibiscus garlands, red vermillion, and bhog are presented amidst deafening beats of the traditional Dhaak drum and the resonant blowing of conch shells.',
      },
      {
        title: 'Choddo Shaak & Choddo Pradip',
        timing: 'Bhoot Chaturdashi (eve of Kali Puja)',
        description:
          'Fourteen seasonal leafy greens are cooked and consumed to fortify health for winter, followed by the lighting of exactly fourteen earthen lamps to illuminate the path for ancestors.',
      },
    ],
    artAndHeritage: {
      craftName: 'Sacred Rice-Paste Alpana & Pandal Architecture',
      architectureType: 'Bangla Chala bamboo pavilions and terracotta shrines',
      materials: 'Aatop raw rice paste, river clay, natural vermillion, jute fibers',
      description:
        'Bengal women craft freehand Alpana on doorways without stencils using a soaked cotton rag pinched between finger and thumb. The unbroken circular scrolls symbolize eternal life and welcoming divine cosmic order.',
    },
    festiveFlavours: [
      {
        name: 'Nolen Gur Sandesh',
        hindiName: 'নলেন গুড়ের সন্দেশ',
        category: 'Sweet',
        description:
          'Delicate cottage cheese confection infused with the inaugural harvest of winter date palm sap (Nolen Gur).',
        ingredients: ['Fresh Chhena', 'Date Palm Jaggery', 'Pistachios'],
      },
      {
        name: 'Labra & Khichuri Bhog',
        hindiName: 'লাবড়া ও খিচুড়ি',
        category: 'Savory',
        description:
          'Sacred temple offering of slow-cooked Gobindobhog rice with roasted yellow moong dal and a medly of five autumn roots spiced with Paanch Phoron.',
        ingredients: ['Gobindobhog Rice', 'Roasted Moong Dal', 'Pumpkin', 'Paanch Phoron spices'],
      },
    ],
    interactiveModule: {
      type: 'alpana-canvas',
      title: 'Sacred Alpana Scroll',
      subtitle: 'Freehand Devotional Geometry',
      instruction: 'Drag your brush across the threshold to weave sacred white rice-flour patterns.',
    },
    culturalFact:
      'Unlike Diwali in North India where Goddess Lakshmi is worshipped at home, Kali Puja is both a deeply contemplative midnight Tantric sadhana and an exuberant public community art exhibition.',
    nextRegionSlug: 'varanasi',
  },
  {
    id: 'varanasi',
    slug: 'varanasi',
    number: '03',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    stateId: 'uttar_pradesh',
    title: 'A River of Sacred Lights',
    tagline: 'Dev Deepawali on the Stone Ghats of Kashi',
    shortDescription:
      'Celebrated on the full moon of Kartik Purnima, when millions believe all thirty-three crore deities descend to bathe in the sacred Ganga.',
    heroImage: '/assets/varanasi-ghats.jpg',
    secondaryImage: '/assets/art-diya.jpg',
    accentColor: '#7668A7',
    mapCoords: {
      xPercent: 57,
      yPercent: 42,
      svgX: 470,
      svgY: 280,
    },
    theStory: {
      origin: 'Shiva Purana & Kartik Purnima Traditions',
      philosophicalTheme: 'The Gods Bathe in the Mirror of Eternity',
      historicalEra: 'Eternal City of Lord Vishwanath along the Crescent Ganga',
      narrative:
        'Crucial to Indian cultural lore: Dev Deepawali in Varanasi does not occur on the regular Amavasya Diwali date, but exactly fifteen days later on the full moon of Kartik Purnima. Commemorating Lord Shiva’s destruction of the demon Tripurasura, the entire eighty-four ghats from Ravidas to Rajghat become an incandescent staircase of light.',
    },
    traditions: [
      {
        title: 'Deepdaan along 84 Ghats',
        timing: 'Kartik Purnima twilight',
        description:
          'Every step of Varanasi’s historic riverfront is hand-lined with red clay lamps. Over a million lamps reflect in the calm autumn current of Mother Ganga.',
      },
      {
        title: 'Ganga Maha Aarti at Dashashwamedh',
        timing: 'Moonrise on Kartik Purnima',
        description:
          'Twenty-one young priests perform synchronized movements with towering 108-flame brass aartis, incense cones, and peacock feather fans to the rhythm of brass gongs.',
      },
    ],
    artAndHeritage: {
      craftName: 'Banarasi Zari Weaving & Copper Craft',
      architectureType: 'Crescent stone ghat architecture with Maratha pavilions',
      materials: 'Hand-woven mulberry silk, silver gilded zari thread, beaten bronze',
      description:
        'The ghats constructed by Maratha queens like Ahilyabai Holkar and Rajput royals frame the river with stepped geometric stone facades that hold hundreds of thousands of lamps securely above the water line.',
    },
    festiveFlavours: [
      {
        name: 'Varanasi Malaiyo',
        hindiName: 'बनारसी मलइयो',
        category: 'Sweet',
        description:
          'Frothy, cloud-like sweet milk foam whipped under the night sky to absorb the early winter dew, flavored with saffron, cardamom, and slivered pistachios.',
        ingredients: ['Chilled Whole Milk', 'Saffron Strands', 'Winter Dew', 'Almonds'],
      },
      {
        name: 'Banarasi Lal Peda',
        hindiName: 'लाल पेड़ा',
        category: 'Sweet',
        description:
          'Intensely roasted caramelized milk fudge with granular texture, flavored with crushed nutmeg and cardamom.',
        ingredients: ['Khoya', 'Nutmeg', 'Desi Sugar', 'Green Cardamom'],
      },
    ],
    interactiveModule: {
      type: 'ganga-deepdaan',
      title: 'Floating Deepdaan Offering',
      subtitle: 'Release a Lamp to the Sacred Current',
      instruction: 'Touch to place a ceremonial leaf lamp with sacred marigolds upon the holy river.',
    },
    culturalFact:
      'Dev Deepawali is considered the festival where the devas (gods) celebrate their own Diwali, illuminating Kashi so brightly that the celestial heavens mirror the earthly earth.',
    nextRegionSlug: 'goa',
  },
  {
    id: 'goa',
    slug: 'goa',
    number: '04',
    name: 'Goa',
    state: 'Goa',
    stateId: 'Goa',
    title: 'The Night of Narakasura',
    tagline: 'Colossal Effigies, Pre-Dawn Fireworks & The Triumph of Light',
    shortDescription:
      'Where weeks of youth craftsmanship culminate in burning towering effigies of Narakasura at dawn on Naraka Chaturdashi.',
    heroImage: '/assets/goa-narakasura.jpg',
    secondaryImage: '/assets/celebration-family.jpg',
    accentColor: '#343E50',
    mapCoords: {
      xPercent: 32,
      yPercent: 68,
      svgX: 10,
      svgY: 760,
    },
    theStory: {
      origin: 'Shrimad Bhagavatam & Satyabhama’s Conquest',
      philosophicalTheme: 'Annihilating Darkness at the Cusp of Daybreak',
      historicalEra: 'Konkan Coastal Culture & Village Ward Guilds',
      narrative:
        'In Goa, the primary climax of Diwali unfolds on Naraka Chaturdashi. The demon king Narakasura had terrorized the three realms. Lord Krishna, guided by Queen Satyabhama, vanquished the tyrant before sunrise. In memory, Goan village wards craft giant paper-maché and bamboo effigies of Narakasura and torch them at dawn, burning all negativity and ill-will.',
    },
    traditions: [
      {
        title: 'Narakasura Effigy Competitions',
        timing: 'Diwali Eve throughout the night',
        description:
          'Massive sculpted demons up to thirty feet tall, packed with fireworks and moving parts, are paraded across towns with intense community pride and musical brass bands.',
      },
      {
        title: 'Dawn Cremation & The Bitter Berry Rite',
        timing: 'Naraka Chaturdashi dawn (5:00 AM)',
        description:
          'At the break of dawn, the effigy is torched amidst firecrackers. Afterward, family members crush a bitter wild fruit called Kareet underfoot, tasting bitterness before entering sweet festive renewal.',
      },
    ],
    artAndHeritage: {
      craftName: 'Konkan Paper-Maché & Kaavi Sgraffito',
      architectureType: 'Indo-Portuguese coastal houses and village kulagar courtyards',
      materials: 'Bamboo reeds, handmade recycled paper, red laterite oxide, brass samai',
      description:
        'Goan artisans combine indigenous Konkani Kaavi etching (scratching white lime plaster over red oxide) with Portuguese lantern craftsmanship, creating an unmistakable coastal aesthetic.',
    },
    festiveFlavours: [
      {
        name: 'Dudhatle Fov',
        hindiName: 'दुधातले फोव',
        category: 'Sweet',
        description:
          'Flat beaten rice soaked in sweet cardamom milk, fresh coconut shreds, and golden raisins, served exclusively on Diwali morning.',
        ingredients: ['Beaten Rice (Poha)', 'Cow Milk', 'Cardamom', 'Fresh Grated Coconut'],
      },
      {
        name: 'Batat Fov (Goan Potato Poha)',
        hindiName: 'बटाट फोव',
        category: 'Savory',
        description:
          'Tempered beaten rice tossed with diced potatoes, mustard seeds, curry leaves, turmeric, and freshly chopped coriander.',
        ingredients: ['Poha', 'Potatoes', 'Mustard Seeds', 'Green Chilies', 'Curry Leaves'],
      },
    ],
    interactiveModule: {
      type: 'effigy-spark',
      title: 'Dawn Triumph Spark',
      subtitle: 'The Burning of Narakasura',
      instruction: 'Kindle the sacred torch at daybreak to illuminate the Konkan coast with golden sparks.',
    },
    culturalFact:
      'Goan households prepare at least five distinct varieties of Fov (beaten rice) on Diwali morning: sweet with jaggery, savory with potatoes, soaked in curd, steeped in coconut milk, and spiced with ginger.',
    nextRegionSlug: 'gujarat',
  },
  {
    id: 'gujarat',
    slug: 'gujarat',
    number: '05',
    name: 'Gujarat',
    state: 'Gujarat',
    stateId: 'gujarat',
    title: 'Patterns of Prosperity',
    tagline: 'Chopda Pujan, Bestu Varas & Vibrant Threshold Art',
    shortDescription:
      'Sanctifying accounting ledgers with vermillion swastikas and celebrating the dawn of the New Year with boundless hospitality.',
    heroImage: '/assets/gujarat-chopda-pujan.jpg',
    secondaryImage: '/assets/art-rangoli.jpg',
    accentColor: '#B8DAD3',
    mapCoords: {
      xPercent: 25,
      yPercent: 44,
      svgX: -140,
      svgY: 300,
    },
    theStory: {
      origin: 'Vikram Samvat Calendar Rites',
      philosophicalTheme: 'Honoring Ethical Commerce, Harmony & Family Enterprise',
      historicalEra: 'Ancient Trading Guilds of Saurashtra & Kutch',
      narrative:
        'In Gujarat, Diwali is the grand finale of the fiscal and spiritual year. On Amavasya night, families gather for Chopda Pujan—the ritual veneration of account ledgers. The very next day is Bestu Varas (New Year Day of Vikram Samvat), when people wear new clothes, visit elders with dry fruits, and greet everyone with "Saal Mubarak".',
    },
    traditions: [
      {
        title: 'Chopda Pujan (Sanctification of Ledgers)',
        timing: 'Diwali Night during auspicious Muhurat',
        description:
          'New red hardcover account books are inscribed with turmeric and vermillion: "Shubh" (auspiciousness) on the right and "Labh" (virtuous gain) on the left, flanked by a sacred Swastika.',
      },
      {
        title: 'Bestu Varas & Sabras Blessing',
        timing: 'Day after Diwali morning',
        description:
          'Salt vendors visit doorsteps offering "Sabras" (the essence of all taste—salt), symbolizing that the upcoming year will be infused with flavor, vitality, and wealth.',
      },
    ],
    artAndHeritage: {
      craftName: 'Dry Powder Rangoli & Bandhej Textiles',
      architectureType: 'Wooden Pol houses with carved brackets (todla)',
      materials: 'Natural marble stone powders, rice flour, brass lamps, Toran weaves',
      description:
        'Gujarati Rangoli is renowned for intricate geometric symmetries called "Satiya" and peacocks drawn with dry powder held between thumb and forefinger, sanctifying the threshold of Pol courtyards.',
    },
    festiveFlavours: [
      {
        name: 'Gujarati Mohanthal',
        hindiName: 'ગુજરાતી મોહનથાળ',
        category: 'Sweet',
        description:
          'Rich, dense fudge prepared from gram flour roasted in pure ghee, simmered with saffron sugar syrup, and garnished with charoli seeds and silver leaf.',
        ingredients: ['Besan (Gram Flour)', 'Mawa', 'Ghee', 'Saffron', 'Charoli Nuts'],
      },
      {
        name: 'Ghoghara (Ghughra)',
        hindiName: 'ઘૂઘરા',
        category: 'Sweet',
        description:
          'Flaky golden pastry crescents with fluted edges, stuffed with roasted semolina, khoya, crushed almonds, and nutmeg.',
        ingredients: ['Refined Flour', 'Mawa', 'Semolina', 'Almonds', 'Cardamom'],
      },
    ],
    interactiveModule: {
      type: 'rangoli-composer',
      title: 'Threshold Rangoli Studio',
      subtitle: 'Compose Sacred Geometry',
      instruction: 'Select vibrant mineral pigments to color the sacred Gujarati threshold mandala.',
    },
    culturalFact:
      'In Gujarat, leaving salt behind on the morning of Bestu Varas is considered a grave omission, because salt (Sabras) represents the divine substance that preserves and flavors all life.',
    nextRegionSlug: 'tamil-nadu',
  },
  {
    id: 'tamil-nadu',
    slug: 'tamil-nadu',
    number: '06',
    name: 'Tamil Nadu',
    state: 'Tamil Nadu',
    stateId: 'Tamil_Nadu',
    title: 'The Dawn of Deepavali',
    tagline: 'Pre-Dawn Ganga Snanam, Deepavali Marundhu & Sacred Kolams',
    shortDescription:
      'Where celebrations begin at 4:00 AM with sacred oil baths sanctified as the holy river Ganga, followed by cracker bursts before sunrise.',
    heroImage: '/assets/tamil-nadu-deepavali.jpg',
    secondaryImage: '/assets/south-india-kolam.jpg',
    accentColor: '#E8A1BC',
    mapCoords: {
      xPercent: 44,
      yPercent: 82,
      svgX: 230,
      svgY: 1040,
    },
    theStory: {
      origin: 'Sangam Literature & Naraka Chaturdashi Dawn',
      philosophicalTheme: 'Cleansing the Mind and Body in the Ambrosial Hour',
      historicalEra: 'Chola & Pandya Temple Civilizations of Kaveri Delta',
      narrative:
        'In Tamil Nadu, Deepavali is celebrated exclusively on Naraka Chaturdashi at dawn, not on the moonless night. The day begins in the sacred Brahma Muhurta (around 4:00 AM). The ritual question asked by every family to neighbors is "Ganga Snanam aacha?" (Have you bathed in the sacred Ganga today?), as warm water infused with sesame oil is reverently transformed into the holy river.',
    },
    traditions: [
      {
        title: 'Ganga Snanam (Sacred Oil Bath)',
        timing: 'Brahma Muhurta (4:00 AM - 5:30 AM)',
        description:
          'Elders apply fragrant warm gingelly (sesame) oil infused with peppercorns and omam onto everyone’s crown. A hot water bath washes away fatigue, impurities, and negative karma.',
      },
      {
        title: 'Consuming Deepavali Marundhu (Legiyam)',
        timing: 'Immediately post-bath before any sweets',
        description:
          'Before touching festive sweets or breakfast, each family member swallows a marble-sized portion of Deepavali Marundhu, an ancient digestive ayurvedic lehyam.',
      },
    ],
    artAndHeritage: {
      craftName: 'Brahma Muhurta Kolam & Tanjore Metalcraft',
      architectureType: 'Dravidian gopuram temple architecture and thinnai porches',
      materials: 'Dry rice powder (arisi podi), red kaavi clay, bronze Kuthuvilakku',
      description:
        'Tamil women rise before dawn to draw mathematical Kolam using raw rice flour so ants and small birds can feed on the sacred threshold, establishing mutual harmony between humanity and nature.',
    },
    festiveFlavours: [
      {
        name: 'Deepavali Marundhu (Legiyam)',
        hindiName: 'தீபாவளி மருந்து',
        category: 'Medicinal Rites',
        description:
          'Spicy-sweet medicinal herbal paste cooked with dry ginger (sukku), black pepper, cumin, coriander seeds, omam, pure honey, and palm jaggery.',
        ingredients: ['Dry Ginger', 'Black Pepper', 'Carom Seeds (Omam)', 'Palm Jaggery', 'Ghee'],
      },
      {
        name: 'Traditional Adhirasam',
        hindiName: 'அதிரசம்',
        category: 'Sweet',
        description:
          'Ancient doughnut-shaped sweet crafted from fermented raw rice dough kneaded with dark palm jaggery syrup and fried gently in sesame oil.',
        ingredients: ['Raw Rice', 'Jaggery Syrup', 'Cardamom', 'Gingelly Oil'],
      },
    ],
    interactiveModule: {
      type: 'kolam-generator',
      title: 'Sacred Kolam Matrix',
      subtitle: 'Connect the Brahma Muhurta Dots',
      instruction: 'Trace lines across the dot matrix to complete the sacred symmetry of the dawn Kolam.',
    },
    culturalFact:
      'Unlike in the North where crackers are burst late into the night, in Tamil Nadu the skies roar with firecrackers between 4:30 AM and 6:00 AM, welcoming the dawn of triumph over dark ignorance.',
    nextRegionSlug: 'ayodhya',
  },
];

