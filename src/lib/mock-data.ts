export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type EmotionType =
  | "joy"
  | "calm"
  | "energy"
  | "anxiety"
  | "sadness"
  | "anger"
  | "neutral";

export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodLevel;
  emotions: EmotionType[];
  note?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: "physical" | "mental" | "social" | "personal";
  progress: number;
  targetDate: Date;
  checkIns: number;
  status: "active" | "completed" | "archived";
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: MoodLevel;
  tags: string[];
}

export interface Stats {
  currentStreak: number;
  longestStreak: number;
  averageMood: number;
  trend: "up" | "down" | "stable";
  totalEntries: number;
}

// Generate stable mood data for the last 30 days (no random values to avoid hydration issues)
function generateMoodData(): MoodEntry[] {
  const moods: MoodEntry[] = [];
  const baseDate = new Date("2025-12-12"); // Use a fixed base date for consistency

  // Predefined pattern to avoid Math.random() hydration issues
  const moodPattern = [7, 8, 6, 9, 7, 8, 5, 7, 8, 9, 6, 7, 8, 7, 6, 8, 9, 7, 8, 6, 7, 8, 9, 7, 6, 8, 7, 9, 8, 7];
  const emotionPatterns: EmotionType[][] = [
    ["joy", "energy"],
    ["calm", "joy"],
    ["anxiety", "neutral"],
    ["joy", "calm", "energy"],
    ["calm", "energy"],
    ["joy", "calm"],
    ["sadness", "anxiety"],
    ["calm", "neutral"],
    ["joy", "energy"],
    ["joy", "calm", "energy"],
    ["anxiety", "neutral"],
    ["calm", "joy"],
    ["joy", "energy", "calm"],
    ["calm", "joy"],
    ["neutral", "calm"],
    ["joy", "energy"],
    ["joy", "calm", "energy"],
    ["calm", "energy"],
    ["joy", "energy"],
    ["neutral", "calm"],
    ["calm", "joy"],
    ["joy", "energy", "calm"],
    ["joy", "calm", "energy"],
    ["calm", "energy"],
    ["neutral", "calm"],
    ["joy", "energy"],
    ["calm", "joy"],
    ["joy", "calm", "energy"],
    ["joy", "energy"],
    ["calm", "joy"],
  ];
  const noteIndices = [2, 5, 8, 12, 15, 18, 22, 25, 28]; // Fixed indices for notes

  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    const entry: MoodEntry = {
      id: `mood-${i}`,
      date,
      mood: moodPattern[29 - i] as MoodLevel,
      emotions: emotionPatterns[29 - i] || ["neutral"],
    };

    if (noteIndices.includes(29 - i)) {
      entry.note = "Journée productive et positive";
    }

    moods.push(entry);
  }

  return moods;
}

// Mock goals data
export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Méditer 10 minutes par jour",
    description:
      "Pratiquer la méditation quotidienne pour améliorer mon bien-être mental",
    category: "mental",
    progress: 65,
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    checkIns: 19,
    status: "active",
  },
  {
    id: "goal-2",
    title: "Marcher 30 minutes",
    description: "Faire une marche quotidienne pour améliorer ma santé physique",
    category: "physical",
    progress: 80,
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    checkIns: 24,
    status: "active",
  },
  {
    id: "goal-3",
    title: "Appeler un ami chaque semaine",
    description: "Maintenir mes connexions sociales",
    category: "social",
    progress: 40,
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    checkIns: 6,
    status: "active",
  },
  {
    id: "goal-4",
    title: "Tenir un journal quotidien",
    description: "Écrire mes pensées et émotions chaque jour",
    category: "personal",
    progress: 90,
    targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    checkIns: 27,
    status: "active",
  },
];

// Mock journal entries
export const mockJournalEntries: JournalEntry[] = [
  {
    id: "journal-1",
    title: "Belle journée ensoleillée",
    content:
      "Aujourd'hui, j'ai passé du temps à l'extérieur et ça m'a fait beaucoup de bien. Le soleil et l'air frais ont vraiment amélioré mon humeur. J'ai réussi à finir plusieurs tâches importantes au travail.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    mood: 8,
    tags: ["travail", "nature", "productivité"],
  },
  {
    id: "journal-2",
    title: "Moments de calme",
    content:
      "J'ai pris le temps de méditer ce matin. Ça m'a aidé à commencer la journée avec plus de sérénité. J'ai aussi eu une bonne conversation avec un ami.",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    mood: 7,
    tags: ["méditation", "amis", "calme"],
  },
  {
    id: "journal-3",
    title: "Journée difficile mais instructive",
    content:
      "Aujourd'hui a été challengeant. J'ai eu quelques moments d'anxiété, mais j'ai pu utiliser mes techniques de respiration pour les gérer. Je suis fier de moi pour avoir persévéré.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    mood: 6,
    tags: ["anxiété", "croissance", "fierté"],
  },
  {
    id: "journal-4",
    title: "Weekend relaxant",
    content:
      "J'ai passé un weekend tranquille à la maison. J'ai lu, cuisiné et passé du temps de qualité avec ma famille. Ces moments simples sont précieux.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    mood: 9,
    tags: ["famille", "repos", "gratitude"],
  },
  {
    id: "journal-5",
    title: "Nouvelle routine matinale",
    content:
      "J'ai commencé une nouvelle routine le matin : réveil à 6h30, méditation, petit-déjeuner sain et planification de la journée. Je me sens déjà plus organisé.",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    mood: 8,
    tags: ["routine", "organisation", "santé"],
  },
];

// Mock stats
export const mockStats: Stats = {
  currentStreak: 12,
  longestStreak: 28,
  averageMood: 7.3,
  trend: "up",
  totalEntries: 145,
};

// Export all mood data
export const mockMoodData = generateMoodData();

// Get mood data for last N days
export function getRecentMoodData(days: number): MoodEntry[] {
  return mockMoodData.slice(-days);
}

// Get average mood for period
export function getAverageMood(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, entry) => acc + entry.mood, 0);
  return Math.round((sum / entries.length) * 10) / 10;
}

// Get most common emotion
export function getMostCommonEmotion(
  entries: MoodEntry[]
): EmotionType | null {
  const emotionCounts: Record<string, number> = {};

  entries.forEach((entry) => {
    entry.emotions.forEach((emotion) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
  });

  let maxCount = 0;
  let mostCommon: EmotionType | null = null;

  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = emotion as EmotionType;
    }
  });

  return mostCommon;
}
