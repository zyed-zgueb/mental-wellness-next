export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type EmotionType =
  | "joy"
  | "calm"
  | "energy"
  | "anxiety"
  | "sadness"
  | "anger"
  | "neutral";

export type SymptomType =
  | "headache"
  | "fatigue"
  | "muscle_tension"
  | "stomach_ache"
  | "insomnia"
  | "heart_racing"
  | "dizziness"
  | "back_pain"
  | "chest_tightness"
  | "nausea";

export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

export type ActivityCategory =
  | "medication"
  | "meditation"
  | "exercise"
  | "therapy"
  | "sleep"
  | "nutrition"
  | "social";

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  icon?: string;
}

export interface ActivityLog {
  id: string;
  date: Date;
  activities: string[]; // Array of activity IDs
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: ActivityCategory;
  targetFrequency: "daily" | "weekly";
  currentStreak: number;
  longestStreak: number;
  lastCompleted?: Date;
}

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

export interface SymptomRecord {
  symptom: SymptomType;
  severity: SeverityLevel;
}

export interface SymptomEntry {
  id: string;
  date: Date;
  symptoms: SymptomRecord[];
  note?: string;
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

// Generate symptom data for the last 30 days
function generateSymptomData(): SymptomEntry[] {
  const symptoms: SymptomEntry[] = [];
  const baseDate = new Date("2025-12-12"); // Use fixed base date for consistency

  // Predefined patterns for symptoms (not every day has symptoms)
  const symptomPatterns: SymptomRecord[][] = [
    [], // Day 0 - no symptoms
    [{ symptom: "headache", severity: 2 }],
    [{ symptom: "fatigue", severity: 3 }],
    [], // Day 3 - no symptoms
    [{ symptom: "muscle_tension", severity: 2 }, { symptom: "headache", severity: 1 }],
    [], // Day 5 - no symptoms
    [{ symptom: "insomnia", severity: 4 }],
    [{ symptom: "fatigue", severity: 5 }, { symptom: "headache", severity: 3 }],
    [], // Day 8 - no symptoms
    [{ symptom: "stomach_ache", severity: 2 }],
    [{ symptom: "muscle_tension", severity: 3 }],
    [], // Day 11 - no symptoms
    [], // Day 12 - no symptoms
    [{ symptom: "heart_racing", severity: 3 }, { symptom: "chest_tightness", severity: 2 }],
    [{ symptom: "dizziness", severity: 2 }],
    [], // Day 15 - no symptoms
    [{ symptom: "back_pain", severity: 3 }],
    [{ symptom: "headache", severity: 2 }, { symptom: "fatigue", severity: 2 }],
    [], // Day 18 - no symptoms
    [], // Day 19 - no symptoms
    [{ symptom: "muscle_tension", severity: 4 }],
    [{ symptom: "nausea", severity: 2 }],
    [], // Day 22 - no symptoms
    [{ symptom: "insomnia", severity: 3 }],
    [{ symptom: "fatigue", severity: 4 }],
    [], // Day 25 - no symptoms
    [{ symptom: "headache", severity: 3 }],
    [], // Day 27 - no symptoms
    [{ symptom: "muscle_tension", severity: 2 }, { symptom: "back_pain", severity: 2 }],
    [{ symptom: "fatigue", severity: 2 }],
  ];

  const noteIndices = [1, 6, 7, 13, 16, 20, 23, 24, 26]; // Days with notes

  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    const daySymptoms = symptomPatterns[29 - i];

    // Only add entry if there are symptoms for that day
    if (daySymptoms && daySymptoms.length > 0) {
      const entry: SymptomEntry = {
        id: `symptom-${29 - i}`,
        date,
        symptoms: daySymptoms,
      };

      if (noteIndices.includes(29 - i)) {
        entry.note = "Stress au travail, j'ai remarqué que ça empire les symptômes";
      }

      symptoms.push(entry);
    }
  }

  return symptoms;
}

// Mock symptom data
export const mockSymptomData = generateSymptomData();

// Mock activities - predefined list of common wellness activities
export const mockActivities: Activity[] = [
  // Medication
  { id: "act-med-1", name: "Prendre médicaments matin", category: "medication" },
  { id: "act-med-2", name: "Prendre médicaments soir", category: "medication" },

  // Meditation
  { id: "act-medit-1", name: "Méditation guidée", category: "meditation" },
  { id: "act-medit-2", name: "Respiration profonde", category: "meditation" },
  { id: "act-medit-3", name: "Pleine conscience", category: "meditation" },

  // Exercise
  { id: "act-ex-1", name: "Marche 30 min", category: "exercise" },
  { id: "act-ex-2", name: "Yoga", category: "exercise" },
  { id: "act-ex-3", name: "Course à pied", category: "exercise" },
  { id: "act-ex-4", name: "Étirements", category: "exercise" },

  // Therapy
  { id: "act-ther-1", name: "Séance thérapie", category: "therapy" },
  { id: "act-ther-2", name: "Journaling thérapeutique", category: "therapy" },

  // Sleep
  { id: "act-sleep-1", name: "8h de sommeil", category: "sleep" },
  { id: "act-sleep-2", name: "Routine coucher", category: "sleep" },
  { id: "act-sleep-3", name: "Sieste réparatrice", category: "sleep" },

  // Nutrition
  { id: "act-nutr-1", name: "Petit-déjeuner équilibré", category: "nutrition" },
  { id: "act-nutr-2", name: "Boire 2L d'eau", category: "nutrition" },
  { id: "act-nutr-3", name: "Repas sains", category: "nutrition" },

  // Social
  { id: "act-soc-1", name: "Appeler un proche", category: "social" },
  { id: "act-soc-2", name: "Sortie entre amis", category: "social" },
  { id: "act-soc-3", name: "Activité sociale", category: "social" },
];

// Generate activity logs for last 30 days
function generateActivityLogs(): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const baseDate = new Date("2025-12-12");

  // Predefined patterns of activity IDs for each day
  const activityPatterns: string[][] = [
    ["act-med-1", "act-medit-1", "act-ex-1", "act-sleep-1", "act-nutr-1"],
    ["act-med-1", "act-med-2", "act-sleep-1", "act-nutr-1", "act-nutr-2"],
    ["act-med-1", "act-ex-2", "act-medit-2", "act-nutr-3"],
    ["act-med-1", "act-med-2", "act-ex-1", "act-sleep-1", "act-soc-1"],
    ["act-med-1", "act-medit-1", "act-sleep-2", "act-nutr-1"],
    ["act-med-1", "act-med-2", "act-ex-3", "act-nutr-2", "act-soc-2"],
    ["act-ther-1", "act-med-1", "act-medit-3", "act-sleep-1"],
    ["act-med-1", "act-ex-1", "act-nutr-1", "act-nutr-2"],
    ["act-med-1", "act-med-2", "act-medit-1", "act-sleep-1", "act-ex-4"],
    ["act-med-1", "act-sleep-1", "act-nutr-3", "act-soc-1"],
    ["act-med-1", "act-med-2", "act-ex-2", "act-medit-2", "act-nutr-1"],
    ["act-med-1", "act-sleep-2", "act-ex-1", "act-nutr-2"],
    ["act-med-1", "act-med-2", "act-medit-1", "act-sleep-1", "act-soc-3"],
    ["act-ther-2", "act-med-1", "act-ex-1", "act-nutr-1"],
    ["act-med-1", "act-med-2", "act-sleep-1", "act-medit-3", "act-nutr-2"],
    ["act-med-1", "act-ex-3", "act-nutr-1", "act-soc-1"],
    ["act-med-1", "act-med-2", "act-medit-1", "act-sleep-2", "act-ex-4"],
    ["act-med-1", "act-sleep-1", "act-nutr-3", "act-nutr-2"],
    ["act-med-1", "act-med-2", "act-ex-2", "act-medit-2"],
    ["act-med-1", "act-sleep-1", "act-soc-2", "act-nutr-1"],
    ["act-ther-1", "act-med-1", "act-med-2", "act-ex-1", "act-sleep-1"],
    ["act-med-1", "act-medit-1", "act-nutr-2", "act-ex-4"],
    ["act-med-1", "act-med-2", "act-sleep-2", "act-nutr-1"],
    ["act-med-1", "act-ex-1", "act-medit-3", "act-soc-1"],
    ["act-med-1", "act-med-2", "act-sleep-1", "act-nutr-3", "act-nutr-2"],
    ["act-med-1", "act-ex-2", "act-medit-1", "act-soc-3"],
    ["act-med-1", "act-med-2", "act-sleep-1", "act-nutr-1", "act-ex-4"],
    ["act-ther-2", "act-med-1", "act-medit-2", "act-sleep-2"],
    ["act-med-1", "act-med-2", "act-ex-1", "act-nutr-2", "act-soc-1"],
    ["act-med-1", "act-sleep-1", "act-medit-1", "act-nutr-1", "act-ex-3"],
  ];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    logs.push({
      id: `log-${29 - i}`,
      date,
      activities: activityPatterns[29 - i] || [],
    });
  }

  return logs;
}

export const mockActivityLogs = generateActivityLogs();

// Mock habits with tracking
export const mockHabits: Habit[] = [
  {
    id: "habit-1",
    name: "Méditation quotidienne",
    category: "meditation",
    targetFrequency: "daily",
    currentStreak: 12,
    longestStreak: 28,
    lastCompleted: new Date("2025-12-12"),
  },
  {
    id: "habit-2",
    name: "Exercice physique",
    category: "exercise",
    targetFrequency: "daily",
    currentStreak: 8,
    longestStreak: 15,
    lastCompleted: new Date("2025-12-12"),
  },
  {
    id: "habit-3",
    name: "Prendre médicaments",
    category: "medication",
    targetFrequency: "daily",
    currentStreak: 30,
    longestStreak: 45,
    lastCompleted: new Date("2025-12-12"),
  },
  {
    id: "habit-4",
    name: "Boire 2L d'eau",
    category: "nutrition",
    targetFrequency: "daily",
    currentStreak: 5,
    longestStreak: 20,
    lastCompleted: new Date("2025-12-11"),
  },
  {
    id: "habit-5",
    name: "Contact social",
    category: "social",
    targetFrequency: "weekly",
    currentStreak: 3,
    longestStreak: 8,
    lastCompleted: new Date("2025-12-10"),
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
