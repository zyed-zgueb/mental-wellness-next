# Plan d'Implémentation - Application de Suivi de Santé Mentale
**Ce fichier doit-être mis à jour en fonction du status de chaque tâche**
**Une phase est marquée terminée quand toutes les tâches de la phase sont réalisées**
**Dernière mise à jour** : 2025-12-11 (Phase 1 terminée)

---

## 📊 Progression Globale

- **Phase 0** : Nettoyage du Boilerplate → 🟢 Terminé
- **Phase 1** : Design System + Dashboard Minimal → 🟢 Terminé
- **Phase 2** : i18n + Pages Légales + SEO → 🟡 En cours
- **Phase 3** : Pages de Tracking (Mood, Journal, etc.) → ⚪ Pas commencé
- **Phase 4** : Visualisations & Analytics UI → ⚪ Pas commencé
- **Phase 5** : Chat IA & Objectifs UI → ⚪ Pas commencé
- **Phase 6** : Backend & Persistence → ⚪ Pas commencé
- **Phase 7** : Premium & Paiements → ⚪ Pas commencé
- **Phase 8** : RGPD & Sécurité → ⚪ Pas commencé
- **Phase 9** : Polish & Déploiement → ⚪ Pas commencé

**Légende** : 🟢 Terminé | 🟡 En cours | ⚪ Pas commencé | 🔴 Bloqué

---

## Phase 0 : Nettoyage du Boilerplate 🟢

**Objectif** : Supprimer tout le contenu de démo/placeholder pour partir sur une base propre.

**Statut** : ✅ Phase terminée - 2025-12-11

### 0.1 Supprimer les pages de démo
- [x] Remplacer `/app/page.tsx` (home) par une landing page minimale temporaire
- [x] Remplacer `/app/dashboard/page.tsx` par une page vide protégée
- [x] Remplacer `/app/chat/page.tsx` par une page vide protégée
- [x] Remplacer `/app/profile/page.tsx` par une page vide protégée

### 0.2 Supprimer les composants de démo
- [x] Supprimer `/components/setup-checklist.tsx`
- [x] Supprimer `/components/starter-prompt-modal.tsx`
- [x] Supprimer `/components/github-stars.tsx` (n'existait pas)
- [x] ~~Nettoyer le contenu de `/components/site-header.tsx`~~ → Reporté à Phase 1.3
- [x] ~~Nettoyer le contenu de `/components/site-footer.tsx`~~ → Reporté à Phase 1.3

### 0.3 Nettoyer les fichiers de documentation
- [x] Mettre à jour `/docs/business/starter-prompt.md` pour OpenRouter
- [x] ~~Supprimer les docs techniques non pertinentes~~ → Non nécessaire pour l'instant

### 0.4 Vérifications
- [x] Lint : Aucune erreur
- [x] Typecheck : Aucune erreur

---

## Phase 1 : Design System + Dashboard Minimal 🟢

**Objectif** : Établir le design system et créer un dashboard minimal fonctionnel pour validation rapide.

**Statut** : ✅ Phase terminée - 2025-12-11

### 1.1 Design System chaleureux ✅
- [x] Créer palette de couleurs chaleureuses (définir dans `globals.css`)
  - [x] Couleurs primaires vives mais douces (corail, lavande, vert menthe)
  - [x] Couleurs d'humeur (excellent=vert vif, bon=vert clair, neutre=jaune, bas=orange, très bas=rouge doux)
- [x] Installer composants shadcn/ui nécessaires :
  - [x] `tabs`, `select`, `calendar`, `progress`, `slider`
  - [x] `switch`, `checkbox`, `radio-group`
  - [x] `tooltip`, `popover`, `alert`
  - [x] `chart` (recharts)
- [x] Créer composants de base personnalisés :
  - [x] `EmotionIcon` (composant avec icônes émojis/lucide pour émotions)
  - [x] `MoodScale` (slider 1-10 avec gradient de couleurs)
  - [x] `StatCard` (card avec icône, titre, valeur, trend)
  - [x] `PageHeader` (titre de page + breadcrumb + actions)
- [x] Ajouter micro-interactions CSS (hover effects, transitions douces)
- [x] Configurer animations Framer Motion (installé)

### 1.2 Dashboard principal avec mock data (PRIORITÉ 1) ✅
- [x] Créer `/app/dashboard/page.tsx` (remplacer version basique existante)
- [x] Créer fichier mock data : `/lib/mock-data.ts`
  - [x] Données mood des 30 derniers jours
  - [x] 3-5 objectifs en cours avec progrès
  - [x] Dernières entrées journal (3-5)
  - [x] Stats rapides (streak, moyenne humeur, tendance)
- [x] Implémenter sections du dashboard :
  - [x] **Header** : "Bonjour [Prénom]" + date + mood actuel
  - [x] **Quick Mood Check** : Widget pour saisie rapide humeur du jour
  - [x] **Mood Trend** : Graphique en ligne des 7 derniers jours (recharts)
  - [x] **Active Goals** : 3 cartes d'objectifs avec progress bars
  - [x] **Recent Journal** : 2-3 dernières entrées en aperçu
  - [x] **AI Insight** : Card avec un message de l'IA
  - [x] **Quick Actions** : Boutons rapides (Nouveau journal, Chat IA, Voir stats)
- [x] Optimiser SEO : metadata dashboard page
- [x] Responsive design (mobile-first)

### 1.3 Navigation et header personnalisés ✅
- [x] Remplacer complètement `/components/site-header.tsx` avec navigation pour l'app de santé mentale
- [x] Ajouter liens : Dashboard, Suivi, Objectifs, Analytics, Chat IA
- [x] Intégrer UserProfile existant mais stylé avec le nouveau design
- [x] Remplacer `/components/site-footer.tsx` avec footer approprié (liens légaux, réseaux sociaux)

---

## Phase 2 : i18n + Pages Légales + SEO 🟡

**Objectif** : Internationalisation et conformité légale de base.

**Statut** : 🟡 En cours - Phase 2.1 (terminée le 2025-12-11)

### 2.1 Internationalisation (i18n) ✅ - Terminé 2025-12-11
- [x] Installer et configurer `next-intl` pour gestion multilingue
- [x] Créer structure de fichiers de traduction (`/messages/fr.json`, `/messages/en.json`)
- [x] Configurer middleware Next.js pour détection de langue (utilisé `proxy.ts` pour Next.js 16)
- [x] Implémenter composant `LanguageSwitcher` dans le header
- [x] Traduire tous les textes existants (header, footer, auth, dashboard)
- [x] Restructurer l'app avec `[locale]` dynamic segment
- [x] Créer configuration i18n (`src/i18n/routing.ts`, `src/i18n/request.ts`)
- [x] Mettre à jour `next.config.ts` avec plugin next-intl

### 2.2 Pages légales & SEO
- [ ] Créer `/app/legal/privacy/page.tsx` - Politique de confidentialité (FR/EN)
- [ ] Créer `/app/legal/terms/page.tsx` - Conditions d'utilisation (FR/EN)
- [ ] Créer `/app/legal/disclaimer/page.tsx` - Disclaimer santé mentale (FR/EN)
- [ ] Créer `/app/legal/cookies/page.tsx` - Politique cookies RGPD (FR/EN)
- [ ] Implémenter bandeau consentement cookies (shadcn Dialog)
- [ ] Optimiser métadonnées SEO pour toutes les pages (title, description, OG tags)
- [ ] Ajouter JSON-LD structured data pour SEO santé/bien-être
- [ ] Créer sitemap.xml et robots.txt optimisés

---

## Phase 3 : Pages de Tracking ⚪

**Objectif** : Créer toutes les interfaces de saisie de données avec mock data.

### 3.1 Page de saisie rapide d'humeur
- [ ] Créer `/app/track/mood/page.tsx`
- [ ] Formulaire saisie rapide :
  - [ ] Date/heure (par défaut maintenant, éditable)
  - [ ] Échelle humeur 1-10 avec `MoodScale` slider
  - [ ] Sélection émotions multiples (anxiété, joie, tristesse, colère, calme, énergie)
  - [ ] Note optionnelle (textarea courte)
  - [ ] Bouton "Enregistrer" avec animation de succès
- [ ] Mode "saisie période" :
  - [ ] Toggle pour basculer en mode période
  - [ ] Sélection date début + date fin
  - [ ] Humeur moyenne sur la période
- [ ] Afficher historique des 5 dernières saisies en bas de page
- [ ] Animations de feedback (confetti lors de l'enregistrement?)
- [ ] SEO : metadata page tracking

### 3.2 Page journal détaillé
- [ ] Créer `/app/journal/page.tsx` - Liste des entrées journal
- [ ] Créer `/app/journal/new/page.tsx` - Nouvelle entrée
- [ ] Créer `/app/journal/[id]/page.tsx` - Lecture/édition d'une entrée
- [ ] Composant `JournalEntry` :
  - [ ] Titre optionnel
  - [ ] Date/heure
  - [ ] Éditeur de texte riche (textarea avec formatting basique ou Tiptap)
  - [ ] Tags libres (ex: travail, famille, santé)
  - [ ] Humeur associée (MoodScale)
  - [ ] Photos/images optionnelles (UI mockée, upload réel en Phase 5)
- [ ] Liste journal : affichage chronologique avec filtres (date, humeur, tags)
- [ ] Fonction recherche dans les entrées journal
- [ ] SEO : metadata pages journal

### 3.3 Page suivi des symptômes
- [ ] Créer `/app/track/symptoms/page.tsx`
- [ ] Liste de symptômes physiques courants avec checkboxes
- [ ] Intensité par symptôme (slider 1-5)
- [ ] Sélecteur de date
- [ ] Vue calendrier avec heatmap des symptômes (mock data)
- [ ] SEO : metadata page symptoms

### 3.4 Page activités & habitudes
- [ ] Créer `/app/track/activities/page.tsx`
- [ ] Catégories d'activités (Médicaments, Méditation, Exercice, Thérapie, Sommeil, Alimentation, Social)
- [ ] Interface rapide pour cocher activités du jour
- [ ] Tracking de habitudes avec streaks
- [ ] Vue historique des habitudes avec graphiques
- [ ] SEO : metadata page activities

---

## Phase 4 : Visualisations & Analytics UI ⚪

### 3.1 Page Analytics complète
- [ ] Créer `/app/analytics/page.tsx`
- [ ] Onglets de visualisation (Tabs shadcn)
- [ ] Graphiques avec recharts :
  - [ ] Ligne : Tendance humeur sur 30/90/365 jours
  - [ ] Barres : Fréquence des émotions
  - [ ] Radar : Équilibre vie
  - [ ] Heatmap calendrier : Mood par jour
- [ ] Filtres de période (7j, 30j, 90j, 1an, custom)
- [ ] Statistiques résumées (moyenne, médiane, écart-type)
- [ ] SEO : metadata page analytics

### 4.2 Rapports périodiques (UI mockée)
- [ ] Créer `/app/reports/page.tsx` - Liste des rapports générés
- [ ] Créer `/app/reports/[id]/page.tsx` - Vue rapport détaillé
- [ ] Design rapport mocké avec insights IA
- [ ] Bouton "Générer nouveau rapport" (UI seulement)
- [ ] SEO : metadata pages reports

### 4.3 Export de données (UI mockée)
- [ ] Créer `/app/export/page.tsx`
- [ ] Formulaire d'export (période, types de données, format PDF/CSV)
- [ ] Bouton "Télécharger" (affiche modal "Fonctionnalité premium")
- [ ] Preview du PDF/CSV mockée
- [ ] SEO : metadata page export

---

## Phase 5 : Chat IA & Objectifs UI ⚪

### 4.1 Amélioration du chat existant
- [ ] Refactoriser `/app/chat/page.tsx` avec style chaleureux
- [ ] Ajouter avatars personnalisés pour user et IA
- [ ] Prompts suggérés au démarrage
- [ ] UI pour afficher "pensée en cours" avec animation
- [ ] Boutons quick actions dans les messages IA
- [ ] SEO : metadata page chat optimisée

### 5.2 Page Objectifs
- [ ] Créer `/app/goals/page.tsx` - Liste de tous les objectifs
- [ ] Créer `/app/goals/[id]/page.tsx` - Détail objectif avec historique
- [ ] Card objectif (titre, description, progress bar, check-ins)
- [ ] Filtres : Actifs / Complétés / Archivés
- [ ] UI création d'objectif (formulaire ou via chat IA)
- [ ] Mock data : 5-10 objectifs variés
- [ ] SEO : metadata pages goals

### 5.3 Notifications in-app proactives (UI)
- [ ] Créer composant `NotificationCenter` dans header
- [ ] Badge avec nombre de notifications non lues
- [ ] Dropdown avec liste notifications mockées
- [ ] Types de notifications (check-in IA, rappels, encouragements)
- [ ] Marquer comme lu / Tout marquer comme lu

### 5.4 Onboarding utilisateur
- [ ] Créer `/app/onboarding/page.tsx`
- [ ] Flow multi-étapes (Bienvenue, Objectifs, Préférences, Première saisie)
- [ ] Design accueillant avec illustrations
- [ ] SEO : metadata page onboarding

---

## Phase 6 : Backend & Persistence ⚪

### 5.1 Database Schema
- [ ] Mettre à jour `/src/lib/schema.ts` avec nouvelles tables
- [ ] Générer migration : `pnpm run db:generate`
- [ ] Appliquer migration : `pnpm run db:migrate`

### 6.2 API Routes - CRUD basique
- [ ] Créer `/app/api/mood/route.ts` (GET, POST)
- [ ] Créer `/app/api/journal/route.ts` (GET, POST)
- [ ] Créer `/app/api/journal/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] Créer `/app/api/symptoms/route.ts` (GET, POST)
- [ ] Créer `/app/api/activities/route.ts` (GET, POST)
- [ ] Créer `/app/api/goals/route.ts` (GET, POST)
- [ ] Créer `/app/api/goals/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] Créer `/app/api/notifications/route.ts` (GET, PATCH)

### 6.3 Connexion UI au backend
- [ ] Remplacer mock data par appels API dans toutes les pages
- [ ] Ajouter états de chargement (Skeleton shadcn)
- [ ] Gérer erreurs avec Toasts
- [ ] Implémenter optimistic updates

### 6.4 AI Memory persistante
- [ ] Modifier `/app/api/chat/route.ts` pour sauvegarder messages en DB
- [ ] Implémenter RAG (embeddings + recherche sémantique)
- [ ] Créer page `/app/settings/data/page.tsx` pour gérer mémoire IA

### 6.5 Génération de rapports IA
- [ ] Créer `/app/api/reports/generate/route.ts`
- [ ] Logique génération rapport avec OpenRouter
- [ ] Connecter UI `/app/reports/page.tsx` à l'API

### 6.6 Export PDF/CSV réel
- [ ] Installer `jspdf` et `papaparse`
- [ ] Créer `/app/api/export/route.ts`
- [ ] Logique export PDF/CSV
- [ ] Connecter UI export à l'API

---

## Phase 7 : Premium & Paiements ⚪

### 6.1 Définition fonctionnalités Free vs Premium
- [ ] Documenter limites Free et avantages Premium

### 6.2 Infrastructure paiement
- [ ] Choisir provider (Stripe ou Polar)
- [ ] Ajouter colonne `subscriptionTier` dans table `user`
- [ ] Ajouter table `subscriptions`
- [ ] Configurer compte Stripe/Polar et clés API

### 7.3 Pages premium
- [ ] Créer `/app/pricing/page.tsx`
- [ ] Créer `/app/checkout/page.tsx`
- [ ] Créer `/app/billing/page.tsx`

### 7.4 Intégration Stripe/Polar
- [ ] Créer `/app/api/create-checkout-session/route.ts`
- [ ] Créer `/app/api/webhooks/stripe/route.ts`
- [ ] Créer middleware `lib/check-premium.ts`
- [ ] Ajouter gating UI (badges Premium, modals)
- [ ] Tester flow complet

---

## Phase 8 : RGPD & Sécurité ⚪

### 7.1 Consentement & transparence
- [ ] Implémenter système de consentement granulaire
- [ ] Créer page `/app/settings/privacy/page.tsx`
- [ ] Modal de consentement initial

### 8.2 Chiffrement & audit
- [ ] Ajouter chiffrement at-rest pour données sensibles
- [ ] Logger actions dans `audit_logs`
- [ ] Créer `/app/admin/audit/page.tsx`

### 8.3 Sécurité API
- [ ] Rate limiting sur toutes API routes
- [ ] Validation stricte des inputs (Zod)
- [ ] Headers de sécurité dans `next.config.js`
- [ ] Implémenter 2FA optionnel

### 8.4 Documentation RGPD
- [ ] Finaliser politique de confidentialité
- [ ] Créer `/legal/data-protection/page.tsx`
- [ ] Procédure interne de traitement des demandes RGPD

---

## Phase 9 : Polish & Déploiement ⚪

### 8.1 Optimisations performances
- [ ] Lazy loading des composants lourds
- [ ] Optimisation images (next/image)
- [ ] Code splitting par route
- [ ] Lighthouse audit : score > 90/100

### 8.2 Accessibilité (a11y)
- [ ] Audit axe DevTools
- [ ] Navigation clavier complète
- [ ] ARIA labels sur composants interactifs
- [ ] Contraste couleurs AA minimum

### 8.3 SEO final
- [ ] Créer `/blog/page.tsx` (optionnel)
- [ ] Ajouter articles SEO-optimisés (3-5)
- [ ] Open Graph images pour toutes pages
- [ ] Soumettre sitemap à Google Search Console

### 8.4 Documentation utilisateur
- [ ] Créer `/help/page.tsx` - Centre d'aide
- [ ] Créer `/about/page.tsx`
- [ ] Ajouter tooltips contextuels dans UI
- [ ] Email de bienvenue

### 9.5 Monitoring & Error tracking
- [ ] Configurer Sentry ou Vercel Error Tracking
- [ ] Logging structuré
- [ ] Dashboard de monitoring
- [ ] Uptime monitoring

### 8.6 Déploiement production
- [ ] Préparer base de données prod
- [ ] Configurer env vars en production
- [ ] Déployer sur Vercel
- [ ] Tester flow complet en prod
- [ ] Backup automatique DB

---

## 📦 Dépendances à installer

### Phase 1-2
```bash
pnpm add recharts framer-motion  # framer-motion optionnel
```

### Phase 2
```bash
pnpm add next-intl
```

### Phase 3-4
```bash
# Déjà installés en Phase 1
```

### Phase 6
```bash
pnpm add jspdf papaparse
pnpm add -D @types/papaparse
pnpm add @xenova/transformers  # ou utiliser OpenRouter embeddings
```

### Phase 7
```bash
pnpm add stripe @stripe/stripe-js
# ou
pnpm add @polar-sh/sdk
```

### Phase 8
```bash
pnpm add @upstash/ratelimit @upstash/redis
```

### Phase 9
```bash
pnpm add @sentry/nextjs
```

---

## 🎯 Priorités actuelles

**Terminé** :
- Phase 0 - Nettoyage du boilerplate ✅
- Phase 1 - Design System + Dashboard Minimal ✅

**Prochaine étape** : Phase 2 - i18n + Pages Légales + SEO

---

## 📝 Notes de développement

- **⚠️ CRITIQUE** : Remplacer COMPLÈTEMENT le contenu boilerplate (pas d'approche hybride)
- **Design** : Couleurs chaleureuses (corail, lavande, vert menthe)
- **Approche** : Nettoyage d'abord (Phase 0), puis UI avec mock data (Phases 1-5), puis backend (Phase 6+)
- **SEO** : Optimiser metadata sur chaque page créée
- **Pas de tests** : Focus sur implémentation pour validation UX
- **shadcn/ui** : Utiliser uniquement les composants shadcn
- **IA** : Utiliser OpenRouter (pas OpenAI direct) avec env var `OPENROUTER_MODEL`

---

**Temps estimé total** : 6-10 semaines
