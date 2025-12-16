"use client";

import { useState, useEffect } from "react";
import { Check, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MoodScale } from "@/components/mood-scale";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockAllActivities, type Activity, type MoodLevel, type SymptomType } from "@/lib/mock-data";
import type {
  UnifiedTimelineEntry,
  ActivityEntryData,
  MoodEntryData,
  SymptomEntryData,
  SymptomRecord,
} from "@/lib/unified-timeline";
import { cn } from "@/lib/utils";

// Types pour les émotions (réutilise ceux de mock-data)
const EMOTIONS = [
  { id: "joy", label: "Joie", icon: "😊" },
  { id: "calm", label: "Calme", icon: "😌" },
  { id: "energy", label: "Énergie", icon: "⚡" },
  { id: "anxiety", label: "Anxiété", icon: "😰" },
  { id: "sadness", label: "Tristesse", icon: "😢" },
  { id: "anger", label: "Colère", icon: "😠" },
  { id: "neutral", label: "Neutre", icon: "😐" },
] as const;

// Symptômes disponibles
const SYMPTOMS = [
  { id: "headache", label: "Mal de tête", icon: "🤕" },
  { id: "fatigue", label: "Fatigue", icon: "😴" },
  { id: "muscle_tension", label: "Tension musculaire", icon: "💪" },
  { id: "stomach_ache", label: "Mal de ventre", icon: "🤢" },
  { id: "insomnia", label: "Insomnie", icon: "🌙" },
  { id: "heart_racing", label: "Palpitations", icon: "💓" },
  { id: "dizziness", label: "Vertiges", icon: "😵" },
  { id: "back_pain", label: "Mal de dos", icon: "🦴" },
  { id: "chest_tightness", label: "Oppression thoracique", icon: "🫁" },
  { id: "nausea", label: "Nausée", icon: "🤮" },
] as const;

interface UnifiedLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quickPickActivities?: Activity[];
  defaultTime?: string | undefined; // Format: "HH:mm"
  defaultDuration?: number | undefined; // Duration in minutes
  editingEntry?: UnifiedTimelineEntry | undefined; // If provided, dialog is in edit mode
  onLog: (entries: UnifiedTimelineEntry[]) => void;
  onDelete?: (id: string) => void;
}

export function UnifiedLogDialog({
  open,
  onOpenChange,
  quickPickActivities = [],
  defaultTime,
  defaultDuration,
  editingEntry,
  onLog,
  onDelete,
}: UnifiedLogDialogProps) {
  // Selected entry type (single type at a time)
  const [selectedType, setSelectedType] = useState<"activity" | "mood" | "symptom">("activity");

  // Common fields
  const [time, setTime] = useState<string>("");

  // Activity fields
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>();
  const [activityDuration, setActivityDuration] = useState<string>("");
  const [intensity, setIntensity] = useState<string>("");
  const [activityNote, setActivityNote] = useState<string>("");

  // Mood fields
  const [mood, setMood] = useState<MoodLevel>(3);
  const [selectedEmotions, setSelectedEmotions] = useState<Set<string>>(new Set());
  const [moodDuration, setMoodDuration] = useState<string>("");
  const [moodNote, setMoodNote] = useState<string>("");

  // Symptom fields
  const [selectedSymptoms, setSelectedSymptoms] = useState<Map<string, number>>(new Map());
  const [symptomDuration, setSymptomDuration] = useState<string>("");
  const [symptomNote, setSymptomNote] = useState<string>("");

  const isEditMode = !!editingEntry;

  // Initialize form when dialog opens
  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      if (editingEntry) {
        // Edit mode: populate from existing entry
        const hours = String(editingEntry.timestamp.getHours()).padStart(2, "0");
        const minutes = String(editingEntry.timestamp.getMinutes()).padStart(2, "0");
        setTime(`${hours}:${minutes}`);

        setSelectedType(editingEntry.type);

        if (editingEntry.type === "activity") {
          const data = editingEntry.data as ActivityEntryData;
          setSelectedActivityId(data.activityId);
          setActivityDuration(data.duration ? String(data.duration) : "");
          setIntensity(data.intensity ? String(data.intensity) : "");
          setActivityNote(data.note || "");
        } else if (editingEntry.type === "mood") {
          const data = editingEntry.data as MoodEntryData;
          setMood(data.mood);
          setSelectedEmotions(new Set(data.emotions));
          setMoodDuration(data.duration ? String(data.duration) : "");
          setMoodNote(data.note || "");
        } else if (editingEntry.type === "symptom") {
          const data = editingEntry.data as SymptomEntryData;
          const symptomsMap = new Map<string, number>();
          data.symptoms.forEach((s) => {
            symptomsMap.set(s.type, s.severity);
          });
          setSelectedSymptoms(symptomsMap);
          setSymptomDuration(data.duration ? String(data.duration) : "");
          setSymptomNote(data.note || "");
        }
      } else {
        // Create mode: reset to defaults
        setSelectedType("activity");

        // Set default time
        if (defaultTime) {
          setTime(defaultTime);
        } else {
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");
          setTime(`${hours}:${minutes}`);
        }

        // Reset all fields
        setSelectedActivityId(undefined);
        setActivityDuration(defaultDuration ? String(defaultDuration) : "");
        setIntensity("");
        setActivityNote("");

        setMood(3);
        setSelectedEmotions(new Set());
        setMoodDuration("");
        setMoodNote("");

        setSelectedSymptoms(new Map());
        setSymptomDuration("");
        setSymptomNote("");
      }
    });
  }, [open, defaultTime, defaultDuration, editingEntry]);

  // Toggle emotion
  const toggleEmotion = (emotionId: string) => {
    const newEmotions = new Set(selectedEmotions);
    if (newEmotions.has(emotionId)) {
      newEmotions.delete(emotionId);
    } else {
      newEmotions.add(emotionId);
    }
    setSelectedEmotions(newEmotions);
  };

  // Toggle symptom
  const toggleSymptom = (symptomId: string, severity: number) => {
    const newSymptoms = new Map(selectedSymptoms);
    if (newSymptoms.has(symptomId)) {
      newSymptoms.delete(symptomId);
    } else {
      newSymptoms.set(symptomId, severity);
    }
    setSelectedSymptoms(newSymptoms);
  };

  // Update symptom severity
  const updateSymptomSeverity = (symptomId: string, severity: number) => {
    const newSymptoms = new Map(selectedSymptoms);
    newSymptoms.set(symptomId, severity);
    setSelectedSymptoms(newSymptoms);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!time) return;

    // Validation: check if required fields are filled for selected type
    if (selectedType === "activity" && !selectedActivityId) {
      toast.error("Activité requise", {
        description: "Veuillez sélectionner une activité.",
        duration: 3000,
      });
      return;
    }

    if (selectedType === "symptom" && selectedSymptoms.size === 0) {
      toast.error("Symptôme requis", {
        description: "Veuillez sélectionner au moins un symptôme.",
        duration: 3000,
      });
      return;
    }

    // Parse time
    const timeParts = time.split(":");
    const hours = parseInt(timeParts[0] || "0", 10);
    const minutes = parseInt(timeParts[1] || "0", 10);
    const timestamp = new Date();
    timestamp.setHours(hours, minutes, 0, 0);

    let entry: UnifiedTimelineEntry;

    // Create entry based on selected type
    if (selectedType === "activity" && selectedActivityId) {
      const activityData: ActivityEntryData = {
        activityId: selectedActivityId,
      };

      if (activityDuration) {
        activityData.duration = parseInt(activityDuration, 10);
      }
      if (intensity) {
        activityData.intensity = parseInt(intensity, 10) as 1 | 2 | 3 | 4 | 5;
      }
      if (activityNote.trim()) {
        activityData.note = activityNote.trim();
      }

      entry = {
        id: editingEntry ? editingEntry.id : `entry-${Date.now()}-activity`,
        type: "activity",
        timestamp,
        data: activityData,
      };
    } else if (selectedType === "mood") {
      const moodData: MoodEntryData = {
        mood,
        emotions: Array.from(selectedEmotions) as any,
      };

      if (moodDuration) {
        moodData.duration = parseInt(moodDuration, 10);
      }
      if (moodNote.trim()) {
        moodData.note = moodNote.trim();
      }

      entry = {
        id: editingEntry ? editingEntry.id : `entry-${Date.now()}-mood`,
        type: "mood",
        timestamp,
        data: moodData,
      };
    } else if (selectedType === "symptom" && selectedSymptoms.size > 0) {
      const symptoms: SymptomRecord[] = Array.from(selectedSymptoms.entries()).map(
        ([type, severity]) => ({
          type: type as SymptomType,
          severity: severity as 1 | 2 | 3 | 4 | 5,
        })
      );

      const symptomData: SymptomEntryData = {
        symptoms,
      };

      if (symptomDuration) {
        symptomData.duration = parseInt(symptomDuration, 10);
      }
      if (symptomNote.trim()) {
        symptomData.note = symptomNote.trim();
      }

      entry = {
        id: editingEntry ? editingEntry.id : `entry-${Date.now()}-symptom`,
        type: "symptom",
        timestamp,
        data: symptomData,
      };
    } else {
      return;
    }

    onLog([entry]);
    onOpenChange(false);
  };

  const selectedActivity = mockAllActivities.find((a) => a.id === selectedActivityId);
  const isExercise = selectedActivity?.category === "exercise";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier l'entrée" : "Logger une entrée"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Modifiez les détails de votre entrée."
                : "Enregistrez une ou plusieurs entrées avec l'heure et des détails."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Time picker (common for all types) */}
            <div className="grid gap-2">
              <Label htmlFor="time">Heure *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Tabs for different types */}
            <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as typeof selectedType)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity">
                  Activité
                </TabsTrigger>
                <TabsTrigger value="mood">
                  Humeur
                </TabsTrigger>
                <TabsTrigger value="symptom">
                  Symptômes
                </TabsTrigger>
              </TabsList>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4 mt-4">
                {/* Quick picks */}
                {quickPickActivities.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">⚡ Favoris</Label>
                    <div className="flex flex-wrap gap-2">
                      {quickPickActivities.map((activity) => {
                        const isEmoji = activity.icon && /\p{Emoji}/u.test(activity.icon);
                        const isSelected = selectedActivityId === activity.id;

                        return (
                          <Button
                            key={activity.id}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "h-8 text-xs",
                              isSelected && "ring-2 ring-primary ring-offset-2"
                            )}
                            onClick={() => setSelectedActivityId(activity.id)}
                          >
                            {isEmoji && <span className="mr-1.5">{activity.icon}</span>}
                            {activity.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Activity selector */}
                <div className="grid gap-2">
                  <Label htmlFor="activity">Activité *</Label>
                  <Select value={selectedActivityId || ""} onValueChange={setSelectedActivityId}>
                    <SelectTrigger id="activity">
                      <SelectValue placeholder="Choisir une activité..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAllActivities.map((activity) => (
                        <SelectItem key={activity.id} value={activity.id}>
                          <span className="flex items-center gap-2">
                            {activity.icon && /\p{Emoji}/u.test(activity.icon) && (
                              <span>{activity.icon}</span>
                            )}
                            {activity.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="grid gap-2">
                  <Label htmlFor="activity-duration">Durée (minutes)</Label>
                  <Input
                    id="activity-duration"
                    type="number"
                    min="1"
                    max="1440"
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(e.target.value)}
                    placeholder="Ex: 30"
                  />
                </div>

                {/* Intensity (only for exercise) */}
                {isExercise && (
                  <div className="grid gap-2">
                    <Label htmlFor="intensity">Intensité</Label>
                    <Select value={intensity} onValueChange={setIntensity}>
                      <SelectTrigger id="intensity">
                        <SelectValue placeholder="Optionnel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Très léger</SelectItem>
                        <SelectItem value="2">2 - Léger</SelectItem>
                        <SelectItem value="3">3 - Modéré</SelectItem>
                        <SelectItem value="4">4 - Intense</SelectItem>
                        <SelectItem value="5">5 - Très intense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Note */}
                <div className="grid gap-2">
                  <Label htmlFor="activity-note">Note</Label>
                  <Textarea
                    id="activity-note"
                    value={activityNote}
                    onChange={(e) => setActivityNote(e.target.value)}
                    placeholder="Ajouter une note..."
                    rows={2}
                  />
                </div>
              </TabsContent>

              {/* Mood Tab */}
              <TabsContent value="mood" className="space-y-4 mt-4">
                {/* Mood scale */}
                <div className="grid gap-2">
                  <MoodScale
                    value={mood}
                    onChange={(value) => setMood(value)}
                    showLabel
                    className="mt-2"
                  />
                </div>

                {/* Emotions */}
                <div className="grid gap-2">
                  <Label>Émotions</Label>
                  <div className="flex flex-wrap gap-2">
                    {EMOTIONS.map((emotion) => (
                      <Button
                        key={emotion.id}
                        type="button"
                        variant={selectedEmotions.has(emotion.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleEmotion(emotion.id)}
                        className="text-xs"
                      >
                        <span className="mr-1.5">{emotion.icon}</span>
                        {emotion.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="grid gap-2">
                  <Label htmlFor="mood-duration">Durée (minutes)</Label>
                  <Input
                    id="mood-duration"
                    type="number"
                    min="1"
                    max="1440"
                    value={moodDuration}
                    onChange={(e) => setMoodDuration(e.target.value)}
                    placeholder="Laisser vide pour ponctuel"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optionnel : combien de temps vous étiez dans cet état
                  </p>
                </div>

                {/* Note */}
                <div className="grid gap-2">
                  <Label htmlFor="mood-note">Note</Label>
                  <Textarea
                    id="mood-note"
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder="Ajouter une note..."
                    rows={2}
                  />
                </div>
              </TabsContent>

              {/* Symptom Tab */}
              <TabsContent value="symptom" className="space-y-4 mt-4">
                {/* Symptom checklist with severity */}
                <div className="grid gap-2">
                  <Label>Symptômes ressentis</Label>
                  <div className="space-y-3">
                    {SYMPTOMS.map((symptom) => {
                      const isSelected = selectedSymptoms.has(symptom.id);
                      const severity = selectedSymptoms.get(symptom.id) || 3;

                      return (
                        <div key={symptom.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={symptom.id}
                              checked={isSelected}
                              onCheckedChange={() => toggleSymptom(symptom.id, 3)}
                            />
                            <label
                              htmlFor={symptom.id}
                              className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{symptom.icon}</span>
                              {symptom.label}
                            </label>
                          </div>
                          {isSelected && (
                            <div className="ml-6 flex items-center gap-2">
                              <Label className="text-xs text-muted-foreground">Sévérité:</Label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <Button
                                    key={level}
                                    type="button"
                                    variant={severity === level ? "default" : "outline"}
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => updateSymptomSeverity(symptom.id, level)}
                                  >
                                    {level}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div className="grid gap-2">
                  <Label htmlFor="symptom-duration">Durée (minutes)</Label>
                  <Input
                    id="symptom-duration"
                    type="number"
                    min="1"
                    max="1440"
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                    placeholder="Laisser vide pour ponctuel"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optionnel : combien de temps le symptôme a duré
                  </p>
                </div>

                {/* Note */}
                <div className="grid gap-2">
                  <Label htmlFor="symptom-note">Note</Label>
                  <Textarea
                    id="symptom-note"
                    value={symptomNote}
                    onChange={(e) => setSymptomNote(e.target.value)}
                    placeholder="Ajouter une note..."
                    rows={2}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {/* Delete button (only in edit mode) */}
            {isEditMode && editingEntry && onDelete && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="sm:mr-auto"
                onClick={() => {
                  if (confirm("Supprimer cette entrée ?")) {
                    onDelete(editingEntry.id);
                    onOpenChange(false);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            )}

            <div className="flex gap-2 sm:ml-auto">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={!time}>
                <Check className="mr-2 h-4 w-4" />
                {isEditMode ? "Enregistrer" : "Logger"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
