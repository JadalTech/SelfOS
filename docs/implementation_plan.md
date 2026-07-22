# SelfOS — Foundation Architecture & Project Setup

## 1. Document Analysis & Critique

I've read your [SelfOS_Project_Support_Document.md](file:///d:/SelfOS/SelfOS_Project_Support_Document.md) end-to-end. Here's my honest Staff Engineer-level assessment:

### What's Strong

| Aspect | Assessment |
|---|---|
| **Vision** | Clear pain point. "One OS for personal growth" is a compelling product narrative. |
| **Module Scope** | Comprehensive — Health, Fitness, Nutrition, Progress, AI — covers the full self-improvement stack. |
| **Tech Stack** | React Native Expo + TypeScript + Firebase is a battle-tested trio for solo/small-team mobile apps. |
| **Resume Positioning** | Explicitly designed around interview-value — smart. |
| **Git Workflow** | Branch-per-feature with `main` + `develop` is industry standard. |

### Weaknesses & Gaps I Will Fix

| # | Weakness | Risk | My Fix |
|---|---|---|---|
| 1 | **Flat Firestore collections** (`daily_logs`, `habits`, `streaks`, `analytics` as top-level) | Query inefficiency, security rule sprawl, impossible to paginate per-user | Nest under `users/{uid}/` using subcollections. Keep top-level only for cross-user queries (admin/analytics). |
| 2 | **No Routine Engine abstraction** | Haircare, Skincare, Gym, Water etc. built as separate systems → duplicated CRUD, duplicated UI, duplicated notification logic | Design a **generic Routine Engine** with a `RoutineDefinition` → `RoutineInstance` → `TaskCompletion` model. Each domain (hair, skin, gym) becomes a _configuration_ of this engine, not a separate codebase. |
| 3 | **Folder structure is screen-centric** (`screens/`, `components/`, `services/`) | Doesn't scale past 15 screens. Leads to 200-file flat directories. | Use **feature-based architecture** where each feature owns its screens, components, hooks, types, and services. Shared code lives in `src/shared/`. |
| 4 | **No offline-first strategy** | Document says "offline capable" but no design for it | MMKV for fast local cache + React Query's persistence plugin + Firestore offline persistence. Optimistic updates with conflict resolution. |
| 5 | **No state management plan** | Will lead to prop drilling or unstructured Context sprawl | React Query for server state, Zustand for client state (lightweight, TypeScript-friendly, no boilerplate). MMKV for persistent local state. |
| 6 | **No error boundary / error handling strategy** | App crashes on any unhandled error | Global ErrorBoundary, per-feature error boundaries, toast notification system, Sentry-ready error reporting. |
| 7 | **No design system / theming** | NativeWind mentioned but no design tokens, no typography scale, no color palette | Build a proper design system: color tokens, typography scale, spacing scale, component variants — all in `src/shared/theme/`. |
| 8 | **No environment configuration** | Firebase keys will be hardcoded | `.env` files with `expo-constants`, environment-specific configs for dev/staging/prod. |
| 9 | **No testing strategy** | Document jumps from "build" to "Play Store" | Jest + React Native Testing Library for unit/component tests. Detox consideration for E2E. |
| 10 | **Chart library undecided** | Victory Native vs Chart Kit — both have tradeoffs | Use **react-native-skia** + **Victory Native XL** (Skia-powered). Performant, customizable, actively maintained. |

---

## 2. Improved Product Vision

### Core Insight

SelfOS isn't just a checklist app. It's a **personal operating system** — the difference is that an OS is:
- **Configurable** (users define their own routines, not just hair/skin)
- **Intelligent** (learns patterns, suggests optimizations)
- **Observable** (provides analytics on _everything_ the user tracks)

### Architecture Philosophy

```
┌─────────────────────────────────────────────┐
│                  SelfOS                      │
├─────────────────────────────────────────────┤
│  UI Layer        │  Feature Screens          │
│                  │  Shared Components        │
│                  │  Design System            │
├──────────────────┼──────────────────────────┤
│  Feature Layer   │  Auth Module              │
│                  │  Dashboard Module          │
│                  │  Routine Engine Module     │
│                  │  Nutrition Module          │
│                  │  Progress Module           │
│                  │  Analytics Module          │
│                  │  AI Module                 │
├──────────────────┼──────────────────────────┤
│  Domain Layer    │  Routine Engine Core       │
│                  │  Streak Calculator         │
│                  │  Schedule Resolver         │
│                  │  Notification Scheduler    │
├──────────────────┼──────────────────────────┤
│  Data Layer      │  Firebase Repository       │
│                  │  MMKV Cache                │
│                  │  React Query Cache         │
│                  │  Offline Queue             │
├──────────────────┼──────────────────────────┤
│  Infrastructure  │  Firebase SDK              │
│                  │  Expo APIs                 │
│                  │  Push Notifications        │
│                  │  Cloud Storage             │
└──────────────────┴──────────────────────────┘
```

---

## 3. Proposed Repository Structure

```
d:\SelfOS\
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint + typecheck + test on PR
│       └── eas-build.yml             # EAS Build trigger
├── .husky/
│   ├── pre-commit                    # lint-staged
│   └── commit-msg                    # commitlint
├── docs/
│   ├── architecture.md              # Architecture decisions
│   ├── firestore-schema.md          # Firestore data model
│   ├── routine-engine.md            # Routine engine design
│   └── setup.md                     # Developer setup guide
├── src/
│   ├── app/                         # Expo Router entry (layouts + routes)
│   │   ├── _layout.tsx              # Root layout (providers, fonts, splash)
│   │   ├── index.tsx                # Entry redirect
│   │   ├── (auth)/                  # Auth group
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── (main)/                  # Authenticated group
│   │   │   ├── _layout.tsx          # Tab navigator
│   │   │   ├── (tabs)/
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── index.tsx        # Dashboard
│   │   │   │   ├── timeline.tsx
│   │   │   │   ├── routines.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   └── profile.tsx
│   │   │   ├── routine/
│   │   │   │   ├── [id].tsx         # Routine detail
│   │   │   │   └── create.tsx       # Create routine
│   │   │   ├── nutrition/
│   │   │   │   ├── index.tsx
│   │   │   │   └── protein-planner.tsx
│   │   │   └── settings/
│   │   │       └── index.tsx
│   │   └── +not-found.tsx
│   ├── features/                    # Feature modules (business logic + UI)
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── auth.repository.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── routine-engine/          # THE CORE ENGINE
│   │   │   ├── components/
│   │   │   │   ├── RoutineCard.tsx
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   ├── RoutineTimeline.tsx
│   │   │   │   └── StreakBadge.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useRoutine.ts
│   │   │   │   ├── useRoutineCompletion.ts
│   │   │   │   ├── useStreaks.ts
│   │   │   │   └── useScheduleResolver.ts
│   │   │   ├── services/
│   │   │   │   ├── routine.service.ts
│   │   │   │   ├── streak.service.ts
│   │   │   │   └── schedule-resolver.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── routine.repository.ts
│   │   │   ├── types/
│   │   │   │   ├── routine.types.ts
│   │   │   │   └── schedule.types.ts
│   │   │   ├── constants/
│   │   │   │   └── routine.constants.ts
│   │   │   └── configs/             # Domain-specific configurations
│   │   │       ├── haircare.config.ts
│   │   │       ├── skincare.config.ts
│   │   │       ├── medication.config.ts
│   │   │       ├── gym.config.ts
│   │   │       └── water.config.ts
│   │   ├── nutrition/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   └── types/
│   │   ├── progress/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   └── types/
│   │   ├── analytics/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── notifications/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── ai-coach/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── settings/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── types/
│   ├── shared/                      # Shared across all features
│   │   ├── components/
│   │   │   ├── ui/                  # Primitive UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── ProgressCircle.tsx
│   │   │   │   ├── BottomSheet.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   └── index.ts         # Barrel export
│   │   │   ├── feedback/
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   └── LoadingScreen.tsx
│   │   │   └── layout/
│   │   │       ├── ScreenWrapper.tsx
│   │   │       └── Section.tsx
│   │   ├── hooks/
│   │   │   ├── useAppState.ts
│   │   │   ├── useNetworkStatus.ts
│   │   │   └── useKeyboard.ts
│   │   ├── services/
│   │   │   ├── firebase/
│   │   │   │   ├── app.ts           # Firebase app initialization
│   │   │   │   ├── auth.ts          # Firebase auth instance
│   │   │   │   ├── firestore.ts     # Firestore instance
│   │   │   │   └── storage.ts       # Cloud Storage instance
│   │   │   ├── storage/
│   │   │   │   └── mmkv.ts          # MMKV instance + typed helpers
│   │   │   └── notifications/
│   │   │       └── notification.service.ts
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── QueryProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── theme/
│   │   │   ├── colors.ts            # Color tokens (light + dark)
│   │   │   ├── typography.ts        # Type scale
│   │   │   ├── spacing.ts           # Spacing scale
│   │   │   ├── shadows.ts           # Shadow presets
│   │   │   └── index.ts
│   │   ├── constants/
│   │   │   ├── app.constants.ts     # App-wide constants
│   │   │   ├── query-keys.ts        # React Query key factory
│   │   │   └── routes.ts            # Route constants
│   │   ├── types/
│   │   │   ├── common.types.ts      # Shared types (Timestamps, IDs, etc.)
│   │   │   ├── navigation.types.ts
│   │   │   └── firebase.types.ts
│   │   ├── utils/
│   │   │   ├── date.utils.ts        # Date formatting/manipulation
│   │   │   ├── validation.utils.ts  # Zod schema helpers
│   │   │   ├── format.utils.ts      # Number/string formatting
│   │   │   └── platform.utils.ts    # Platform-specific helpers
│   │   └── lib/
│   │       ├── queryClient.ts       # React Query client config
│   │       └── zod-schemas.ts       # Shared Zod schemas
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── .env.example                     # Environment template
├── .eslintrc.js                     # ESLint config
├── .prettierrc                      # Prettier config
├── app.json                         # Expo config
├── babel.config.js                  # Babel + NativeWind
├── commitlint.config.js             # Commit message linting
├── eas.json                         # EAS Build config
├── global.css                       # NativeWind global styles
├── metro.config.js                  # Metro bundler config
├── nativewind-env.d.ts              # NativeWind type declarations
├── tailwind.config.js               # Tailwind/NativeWind config
├── tsconfig.json                    # TypeScript config
├── package.json
└── README.md
```

---

## 4. Firestore Data Model (Improved)

> [!IMPORTANT]
> This is a critical architectural decision. The original document has flat top-level collections which won't scale and will create security rule nightmares.

### Proposed Schema

```
users/{uid}
├── profile: { displayName, email, photoUrl, createdAt, updatedAt }
├── settings: { theme, notifications, timezone }
│
├── routines/{routineId}                    # Routine definitions
│   ├── name, category, icon, color
│   ├── schedule: { type, daysOfWeek, interval, customDates }
│   ├── tasks: [{ id, name, order, isOptional }]
│   ├── reminders: [{ time, enabled }]
│   ├── isActive, createdAt, updatedAt
│   │
│   └── completions/{dateKey}              # YYYY-MM-DD
│       ├── completedTasks: [taskId]
│       ├── completedAt, notes
│       └── completionPercentage
│
├── daily_logs/{dateKey}                   # Daily aggregated data
│   ├── waterIntake: { current, goal, entries: [] }
│   ├── sleep: { bedtime, wakeTime, quality }
│   ├── weight, mood, notes
│   └── completionSummary: { total, completed, percentage }
│
├── nutrition/{dateKey}
│   ├── meals: [{ type, items, calories, protein }]
│   └── proteinRotation: { currentIndex, items }
│
├── progress_photos/{photoId}
│   ├── category, imageUrl, thumbnailUrl
│   ├── date, notes, tags
│   └── measurements: {}
│
├── streaks/{routineId}
│   ├── currentStreak, longestStreak
│   ├── lastCompletedDate
│   └── history: [{ startDate, endDate, length }]
│
└── analytics/{periodKey}                  # weekly/monthly aggregates
    ├── period: 'weekly' | 'monthly'
    ├── routineCompletionRates: {}
    ├── waterAverage, sleepAverage
    └── trends: {}
```

### Why Subcollections?

| Approach | Reads per dashboard load | Security Rules Complexity | Scales to 10K users? |
|---|---|---|---|
| **Flat (original)** | N queries with `where(uid == ...)` | Complex compound rules | ❌ Full collection scans |
| **Subcollections (proposed)** | Direct path reads | Simple `match users/{uid}/**` | ✅ Reads scoped to user |

---

## 5. Routine Engine — Core Design

> [!IMPORTANT]
> This is the most important architectural decision in the entire project. The Routine Engine must be generic enough to power Hair, Skin, Gym, Medication, Water, and any future routine — yet specific enough to feel native for each use case.

### Data Model

```typescript
// RoutineDefinition — the "template"
interface RoutineDefinition {
  id: string;
  userId: string;
  name: string;
  category: RoutineCategory;      // 'haircare' | 'skincare' | 'gym' | 'medication' | 'custom'
  icon: string;
  color: string;
  schedule: RoutineSchedule;
  tasks: RoutineTask[];
  reminders: RoutineReminder[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// RoutineSchedule — when should it run?
interface RoutineSchedule {
  type: 'daily' | 'weekly' | 'monthly' | 'custom' | 'interval';
  daysOfWeek?: number[];           // 0-6 (Sun-Sat) for weekly
  daysOfMonth?: number[];          // 1-31 for monthly
  intervalDays?: number;           // Every N days
  customDates?: string[];          // Specific dates (YYYY-MM-DD)
  startDate: string;
  endDate?: string;                // Optional end date
}

// RoutineTask — individual checklist item
interface RoutineTask {
  id: string;
  name: string;
  description?: string;
  order: number;
  isOptional: boolean;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  metadata?: Record<string, unknown>;  // Domain-specific data
}

// RoutineCompletion — daily execution record
interface RoutineCompletion {
  routineId: string;
  date: string;                    // YYYY-MM-DD
  completedTaskIds: string[];
  skippedTaskIds: string[];
  completedAt: Timestamp;
  completionPercentage: number;
  notes?: string;
}
```

### How Domains Map to the Engine

| Domain | Category | Example Tasks | Special Metadata |
|---|---|---|---|
| **Haircare** | `haircare` | Minoxidil, Shampoo, Oil | `productName`, `applicationArea` |
| **Skincare** | `skincare` | Face Wash, Moisturiser, Sunscreen | `productName`, `skinType` |
| **Gym** | `gym` | Push Day, Pull Day, Legs | `sets`, `reps`, `weight` |
| **Medication** | `medication` | Tranx OD, Tendrone | `dosage`, `withFood` |
| **Custom** | `custom` | Any user-defined routine | User-defined |

### Interview Talking Points This Creates

- "I built a **generic routine engine** that treats haircare, skincare, gym, and medication as *configurations*, not separate codebases"
- "The engine supports daily, weekly, monthly, interval, and custom schedules with a **single Schedule Resolver**"
- "Adding a new routine type requires **zero code changes** — just a new config file"
- "Streak calculation uses a **pure function** tested with 30+ edge cases"

---

## 6. State Management Architecture

```
┌────────────────────────────────────────────┐
│              State Architecture             │
├────────────────────────────────────────────┤
│                                            │
│  Server State (React Query / TanStack)     │
│  ├── Routines, Completions, Logs           │
│  ├── Automatic cache invalidation          │
│  ├── Background refetch                    │
│  ├── Optimistic updates                    │
│  └── Offline persistence (MMKV plugin)     │
│                                            │
│  Client State (Zustand)                    │
│  ├── UI state (modals, sheets, filters)    │
│  ├── App state (onboarding, theme)         │
│  └── Transient state (form drafts)         │
│                                            │
│  Persistent State (MMKV)                   │
│  ├── Auth tokens                           │
│  ├── User preferences                      │
│  ├── Onboarding completion                 │
│  └── React Query cache persistence         │
│                                            │
└────────────────────────────────────────────┘
```

---

## 7. Phase 1 Scope — What We Build Now

This plan covers **Phase 1: Foundation Setup** only. No business features yet.

### Files to Generate

| # | File | Purpose |
|---|---|---|
| 1 | `package.json` | All dependencies with exact versions |
| 2 | `app.json` | Expo configuration |
| 3 | `tsconfig.json` | TypeScript with path aliases |
| 4 | `babel.config.js` | Babel + NativeWind + module resolver |
| 5 | `metro.config.js` | Metro bundler config |
| 6 | `tailwind.config.js` | NativeWind/Tailwind config with design tokens |
| 7 | `global.css` | Global Tailwind directives |
| 8 | `nativewind-env.d.ts` | NativeWind type declarations |
| 9 | `.eslintrc.js` | ESLint with RN + TS + import rules |
| 10 | `.prettierrc` | Prettier config |
| 11 | `commitlint.config.js` | Conventional commits |
| 12 | `.env.example` | Environment variable template |
| 13 | `eas.json` | EAS Build profiles |
| 14 | `.gitignore` | Comprehensive gitignore |
| 15 | `README.md` | Professional README |
| 16 | `src/shared/theme/*` | Complete design system tokens |
| 17 | `src/shared/constants/*` | App constants, query keys, routes |
| 18 | `src/shared/types/*` | Base TypeScript types |
| 19 | `src/shared/services/firebase/*` | Firebase initialization |
| 20 | `src/shared/services/storage/mmkv.ts` | MMKV setup |
| 21 | `src/shared/lib/*` | Query client, Zod schemas |
| 22 | `src/shared/providers/*` | Auth, Query, Theme providers |
| 23 | `src/shared/components/ui/*` | Base UI component library |
| 24 | `src/shared/components/feedback/*` | Error boundary, loading, toast |
| 25 | `src/shared/components/layout/*` | Screen wrapper, section |
| 26 | `src/shared/utils/*` | Utility functions |
| 27 | `src/shared/hooks/*` | Shared hooks |
| 28 | `src/app/_layout.tsx` | Root layout with all providers |
| 29 | `src/app/index.tsx` | Entry point with auth redirect |
| 30 | `docs/architecture.md` | Architecture documentation |
| 31 | `docs/firestore-schema.md` | Data model documentation |
| 32 | `.github/workflows/ci.yml` | CI pipeline |
| 33 | `.husky/pre-commit` | Pre-commit hook |

> [!NOTE]
> This generates ~33 files. Every file will be complete, production-ready, and documented. No TODOs, no placeholders.

---

## 8. Key Dependency Decisions

| Category | Package | Why |
|---|---|---|
| **Framework** | `expo` ~52 | Latest stable SDK |
| **Router** | `expo-router` v4 | File-based routing, deep linking, typed routes |
| **Styling** | `nativewind` v4 + `tailwindcss` v3.4 | Utility-first, design token support |
| **State (Server)** | `@tanstack/react-query` v5 | Cache, offline, optimistic updates |
| **State (Client)** | `zustand` v5 | Minimal boilerplate, TS-friendly |
| **Storage** | `react-native-mmkv` | 30x faster than AsyncStorage |
| **Forms** | `react-hook-form` + `zod` | Performant forms + schema validation |
| **Firebase** | `@react-native-firebase/*` | Native Firebase SDK (not JS SDK) |
| **Navigation** | Built into `expo-router` | — |
| **Icons** | `@expo/vector-icons` | Ships with Expo |
| **Dates** | `date-fns` | Tree-shakeable, immutable |
| **Charts** | `victory-native` (Skia) | Performant, customizable |
| **Linting** | `eslint` + `@typescript-eslint` | Industry standard |
| **Formatting** | `prettier` | Consistent code style |
| **Commits** | `husky` + `commitlint` + `lint-staged` | Enforce quality gates |

> [!WARNING]
> **Firebase SDK Choice**: I'm recommending `@react-native-firebase` (native SDK) over the JS SDK. This gives us better performance, offline support, and access to native features like Crashlytics. However, it requires a **development build** (not Expo Go). We'll use EAS Build or local dev builds. This is the production-correct choice.

---

## Open Questions

> [!IMPORTANT]
> **Q1: Firebase Project** — Do you already have a Firebase project created? If yes, share the `google-services.json` (Android) file. If not, I'll set up the config structure and you can drop in the files later.

> [!IMPORTANT]
> **Q2: Expo Go vs Dev Build** — Using `@react-native-firebase` means we can't use Expo Go for testing. We'll need EAS Build or a local development build. Are you comfortable with this? The alternative is using the Firebase JS SDK (slightly less performant but works with Expo Go during development).

> [!IMPORTANT]
> **Q3: Design Direction** — Do you have any reference apps whose UI/UX you admire? This will help me define the design tokens (colors, typography, spacing) accurately. If not, I'll design a premium dark-mode-first system inspired by apps like Rise, Gentler Streak, and Apple Health.

> [!IMPORTANT]
> **Q4: Zustand** — Your tech stack list doesn't mention Zustand, but it's the ideal client-state solution for this architecture. React Query handles server state; Zustand handles UI/client state. Are you okay adding it, or do you want to stick with React Context?

---

## Verification Plan

### After Phase 1 Setup

1. **TypeScript compilation**: `npx tsc --noEmit` — zero errors
2. **ESLint**: `npx eslint src/ --ext .ts,.tsx` — zero warnings
3. **App launches**: `npx expo start` — no crash, shows root layout
4. **Path aliases work**: Imports like `@/shared/theme` resolve correctly
5. **NativeWind works**: Tailwind classes render correctly
6. **Firebase initializes**: No initialization errors in console

### Automated (CI)
```bash
npx tsc --noEmit
npx eslint src/ --ext .ts,.tsx
npx jest --passWithNoTests
```
