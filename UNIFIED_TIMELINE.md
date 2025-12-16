# Timeline Unifiée - Documentation

## 🎯 Vue d'ensemble

La **Timeline Unifiée** est une évolution majeure du système de tracking qui permet de saisir et visualiser **activités, humeur et symptômes** sur une même timeline interactive.

### Problème résolu

**Avant** : 3 pages séparées
- `/track/activities` - Timeline pour activités uniquement
- `/track/mood` - Formulaire isolé pour humeur
- `/track/symptoms` - Formulaire + heatmap calendar

**Maintenant** : 1 timeline unifiée
- `/track/activities-unified` - Timeline pour tous les types de données avec filtres par layers

## 📁 Architecture

### Nouveaux fichiers créés

```
src/
├── lib/
│   └── unified-timeline.ts                    # Types et utilitaires
│
├── components/activities/
│   ├── unified-timeline.tsx                   # Timeline multi-types
│   ├── unified-log-dialog.tsx                 # Dialog unifié avec tabs
│   └── layer-toggles.tsx                      # Filtres par type
│
└── app/[locale]/track/
    └── activities-unified/page.tsx            # Page principale
```

### Modèle de données

```typescript
// Type unifié pour toutes les entries
interface UnifiedTimelineEntry {
  id: string;
  type: 'activity' | 'mood' | 'symptom';
  timestamp: Date;
  data: ActivityEntryData | MoodEntryData | SymptomEntryData;
}

// Données spécifiques par type
interface ActivityEntryData {
  activityId: string;
  duration?: number;
  intensity?: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

interface MoodEntryData {
  mood: MoodLevel; // 1-10
  emotions: EmotionType[];
  duration?: number; // Nouveau : mood peut avoir une durée
  note?: string;
}

interface SymptomEntryData {
  symptoms: SymptomRecord[]; // Plusieurs symptômes simultanés
  duration?: number; // Nouveau : symptômes peuvent avoir une durée
  note?: string;
}
```

## ✨ Fonctionnalités clés

### 1. Saisie multi-types en un seul flow

**Avant** :
```
1. Aller sur /track/activities → Logger course (30s)
2. Aller sur /track/mood → Logger humeur post-sport (45s)
3. Total : 75s, 2 pages différentes
```

**Maintenant** :
```
1. Click sur timeline 08:00
2. Sélectionner "Course"
3. Toggle "Aussi logger humeur?" → ON
4. Choisir mood 8/10
5. Sauvegarder → 2 entries créées
6. Total : ~30s, 1 seul contexte
```

### 2. Timeline avec 3 types visuellement distincts

```typescript
// Couleurs automatiques par type
activity  → Bleu  (bg-blue-500/10)
mood      → Jaune (bg-yellow-500/10)
symptom   → Rouge (bg-red-500/10)
```

### 3. Filtrage par layers

**Sidebar avec toggles** :
- 🎯 Activités (visible par défaut)
- 😊 Humeur (visible par défaut)
- 🤒 Symptômes (visible par défaut)

L'utilisateur peut activer/désactiver chaque layer pour réduire le bruit visuel.

### 4. Données ponctuelles vs durées

**Nouveau concept** : Tous les types supportent maintenant les durées.

| Type | Ponctuel | Avec durée |
|------|----------|------------|
| **Activité** | "Médication à 8h" | "Course de 8h à 8h30" |
| **Humeur** | "Humeur 7/10 à 14h" | "J'étais à 7/10 de 14h à 16h" |
| **Symptôme** | "Mal de tête à 14h" | "Mal de tête de 14h à 16h" |

**Implémentation** :
- Durée = `null` → Bloc minimal (30 min par défaut pour visibilité)
- Durée = `number` → Hauteur du bloc = durée exacte

### 5. Interactions timeline

#### a) Click-to-create
```typescript
Click sur 14:00 → Ouvre dialog avec:
- Heure pré-remplie: 14:00
- Type par défaut: Activité
- Tabs disponibles: Activité | Humeur | Symptômes
```

#### b) Drag-to-create
```typescript
Drag de 14:00 à 14:30 → Ouvre dialog avec:
- Heure: 14:00
- Durée pré-remplie: 30 min
- Snapping: 15 min
```

#### c) Click on entry
```typescript
Click sur un bloc → Ouvre dialog en mode édition:
- Données actuelles pré-remplies
- Possibilité de modifier
- Bouton "Supprimer" disponible
```

## 🔧 Utilisation dans le code

### Importer les composants

```typescript
import { UnifiedTimeline } from "@/components/activities/unified-timeline";
import { UnifiedLogDialog } from "@/components/activities/unified-log-dialog";
import { LayerToggles } from "@/components/activities/layer-toggles";
import { DEFAULT_LAYERS, type UnifiedTimelineEntry } from "@/lib/unified-timeline";
```

### État minimal requis

```typescript
const [entries, setEntries] = useState<UnifiedTimelineEntry[]>([]);
const [activeLayers, setActiveLayers] = useState(DEFAULT_LAYERS);
const [dialogOpen, setDialogOpen] = useState(false);
```

### Render basique

```typescript
<UnifiedTimeline
  entries={entries}
  activeLayers={activeLayers}
  onTimeSlotClick={(hour, minute) => {
    // Ouvrir dialog à cette heure
  }}
  onTimeSlotDrag={(hour, minute, duration) => {
    // Ouvrir dialog avec durée pré-remplie
  }}
  onEntryClick={(entry) => {
    // Ouvrir dialog en mode édition
  }}
/>
```

### Dialog complet

```typescript
<UnifiedLogDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  quickPickActivities={favoriteActivities}
  defaultTime="14:00"           // Optionnel
  defaultDuration={30}          // Optionnel
  editingEntry={selectedEntry}  // Optionnel (mode édition)
  onLog={(newEntries) => {
    // newEntries peut contenir 1-3 entries selon ce qui a été loggé
    setEntries(prev => [...prev, ...newEntries]);
  }}
  onDelete={(id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }}
/>
```

## 📊 Comparaison avec l'ancien système

| Aspect | Ancien (3 pages) | Nouveau (Timeline unifiée) |
|--------|------------------|----------------------------|
| **Pages nécessaires** | 3 | 1 |
| **Contexte temporel** | Activités seulement | Tous les types |
| **Temps de saisie** | 75s (multiple pages) | 30s (un flow) |
| **Corrélations visibles** | Non | Oui (tout sur timeline) |
| **Durées** | Activités seulement | Tous les types |
| **Filtrage** | N/A | Layers toggleables |

## 🎨 Styles et personnalisation

### Couleurs par type

Défini dans `/lib/unified-timeline.ts` :

```typescript
export function getEntryBackgroundColor(type: TimelineEntryType): string {
  switch (type) {
    case "activity":
      return "bg-blue-500/10 border-blue-500/50 hover:border-blue-500";
    case "mood":
      return "bg-yellow-500/10 border-yellow-500/50 hover:border-yellow-500";
    case "symptom":
      return "bg-red-500/10 border-red-500/50 hover:border-red-500";
  }
}
```

Pour changer les couleurs, modifier cette fonction.

### Ajouter un nouveau type

1. **Définir le type** dans `unified-timeline.ts` :
```typescript
export type TimelineEntryType =
  | 'activity'
  | 'mood'
  | 'symptom'
  | 'medication'; // Nouveau
```

2. **Créer l'interface de données** :
```typescript
interface MedicationEntryData {
  medicationName: string;
  dosage: string;
  note?: string;
}
```

3. **Ajouter au type guard** :
```typescript
export function isMedicationEntry(entry: UnifiedTimelineEntry):
  entry is UnifiedTimelineEntry & { data: MedicationEntryData } {
  return entry.type === "medication";
}
```

4. **Ajouter aux layers par défaut** :
```typescript
export const DEFAULT_LAYERS: LayerConfig[] = [
  // ... existing
  {
    id: "medication",
    label: "Médicaments",
    icon: "💊",
    color: "green",
    visible: true,
  },
];
```

5. **Étendre le dialog** avec un nouveau tab dans `unified-log-dialog.tsx`

6. **Étendre le rendu** dans `unified-timeline.tsx` :
```typescript
const renderEntryContent = (entry: UnifiedTimelineEntry) => {
  // ... existing cases

  if (isMedicationEntry(entry)) {
    const data = entry.data as MedicationEntryData;
    return (
      <>
        <span className="text-lg">💊</span>
        <div className="flex-1">
          <div className="text-sm font-medium">{data.medicationName}</div>
          <div className="text-xs text-muted-foreground">
            {format(entry.timestamp, "HH:mm")} • {data.dosage}
          </div>
        </div>
      </>
    );
  }
}
```

## 🧪 Tests et validation

### Tests manuels effectués

✅ Lint pass (0 errors, 0 warnings)
✅ TypeScript typecheck pass
✅ Compilation réussie
✅ Compatibilité avec les données existantes (via adapters)

### Tests recommandés avant déploiement

1. **Saisie multi-types** :
   - Logger activité seule
   - Logger mood seul
   - Logger symptôme seul
   - Logger activité + mood simultanément
   - Logger les 3 types simultanément

2. **Interactions timeline** :
   - Click to create
   - Drag to create avec différentes durées
   - Édition d'entries existantes
   - Suppression d'entries

3. **Filtrage layers** :
   - Désactiver/activer chaque layer
   - Vérifier que les stats se mettent à jour
   - Tester avec 0 layers visibles

4. **Données ponctuelles vs durées** :
   - Activité sans durée
   - Activité avec durée
   - Mood ponctuel vs mood avec durée
   - Symptôme ponctuel vs symptôme avec durée

5. **Responsive** :
   - Desktop : sidebar visible
   - Mobile : layer toggles dans popover
   - Timeline scrollable horizontalement si nécessaire

## 🚀 Migration depuis l'ancien système

### Option 1 : Remplacement direct

Remplacer `/track/activities/page.tsx` par le nouveau code :

```bash
# Backup ancien
mv src/app/[locale]/track/activities/page.tsx \
   src/app/[locale]/track/activities/page.tsx.old

# Utiliser nouveau
mv src/app/[locale]/track/activities-unified/page.tsx \
   src/app/[locale]/track/activities/page.tsx
```

### Option 2 : Coexistence (recommandé pour beta)

Garder les deux versions :
- `/track/activities` - Ancien (activities seulement)
- `/track/activities-unified` - Nouveau (multi-types)

Ajouter un lien dans la navigation pour tester.

### Migration des données

Les adapters dans `unified-timeline.ts` permettent la conversion :

```typescript
import { activityLogToUnifiedEntry } from "@/lib/unified-timeline";

// Convertir logs existants
const oldActivityLogs: TimelineLog[] = [...]; // Données existantes
const unifiedEntries = oldActivityLogs.map(activityLogToUnifiedEntry);
```

## 📈 Prochaines étapes possibles

### Phase 1 (actuel)
✅ Modèle de données unifié
✅ Timeline multi-types
✅ Dialog unifié avec tabs
✅ Filtrage par layers

### Phase 2 (futur)
- [ ] Clustering intelligent (grouper entries proches)
- [ ] Focus mode (filtrer par plage horaire)
- [ ] Density heatmap background
- [ ] Multi-day view (semaine/mois)

### Phase 3 (avancé)
- [ ] Pattern detection (corrélations automatiques)
- [ ] AI insights overlay
- [ ] Predictive suggestions

## 🐛 Problèmes connus et limitations

1. **Pas de persistance** : Actuellement, les données sont en mémoire (state React). Il faudra ajouter l'intégration avec la DB.

2. **Pas de multi-day** : La timeline affiche une seule journée à la fois.

3. **Pas d'export** : Pas encore de fonction pour exporter les données (CSV, PDF, etc.).

4. **Performance** : Avec 100+ entries sur une journée, le rendu pourrait ralentir. Solution future : virtualization.

## 💡 Conseils d'utilisation

### Pour les développeurs

1. **Toujours utiliser les type guards** :
```typescript
if (isActivityEntry(entry)) {
  // TypeScript sait que entry.data est ActivityEntryData
  const activityId = entry.data.activityId; // ✅ Type-safe
}
```

2. **Ne pas modifier `data` directement** :
```typescript
// ❌ Mauvais
entry.data.duration = 30;

// ✅ Bon
const updatedEntry = {
  ...entry,
  data: {
    ...entry.data,
    duration: 30,
  },
};
```

3. **Utiliser les helpers de couleur** :
```typescript
import { getEntryBackgroundColor, getEntryTextColor } from "@/lib/unified-timeline";

const bgColor = getEntryBackgroundColor(entry.type);
const textColor = getEntryTextColor(entry.type);
```

### Pour les utilisateurs

1. **Utilisez les toggles pour réduire le bruit** : Si vous ne trackez pas de symptômes ce jour-là, désactivez le layer.

2. **Profitez du drag-to-create** : Pour les activités avec durée connue, glissez directement sur la timeline.

3. **Logger plusieurs types en même temps** : Après un exercice, loggez activité + humeur en un seul flow.

## 📝 Changelog

### v1.0.0 (2025-12-15)

**Ajouté** :
- Modèle de données unifié (`UnifiedTimelineEntry`)
- Timeline multi-types avec rendu distinct par type
- Dialog unifié avec tabs (Activité, Humeur, Symptômes)
- Filtrage par layers (toggles sidebar)
- Support durées pour mood et symptoms
- Adapters pour compatibilité avec ancien système
- Documentation complète

**Technique** :
- TypeScript strict mode compatible
- ESLint pass (0 warnings)
- Composants réutilisables et modulaires
- Type guards pour discrimination d'unions

---

**Auteur** : Claude Code
**Date** : 15 décembre 2025
**Licence** : Voir LICENSE du projet principal
