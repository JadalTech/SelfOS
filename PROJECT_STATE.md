# SelfOS — Project State

> This file enables any engineer or AI assistant to resume the project without losing context.

---

## Current Status

| Field | Value |
|-------|-------|
| **Current Batch** | Batch 6F ✅ (AI Hair Coach & Intelligent Recommendations Complete — Haircare Module Complete) |
| **Branch** | `feature/haircare-ai` |
| **Last Tag** | `v0.8.0` (Batch 6F — AI Hair Coach & Intelligent Recommendations) |
| **Last Commit** | Batch 6F (completed & verified) |


---

## Completed Batches

### Batch 1 — Project Foundation ✅
- Expo SDK 57 + TypeScript 6
- Expo Router with filesystem routing
- NativeWind v4 + Tailwind CSS 3 integration
- Dark/Light CSS theme variables in `global.css`
- Welcome screen (`src/app/index.tsx`)
- Git workflow: `main` → `develop` → feature branches

### Batch 2A — Infrastructure Core ✅
- **Environment Config**: Validated `EXPO_PUBLIC_FIREBASE_*` vars with dev/prod error messages
- **Firebase JS SDK**: Lazy singleton initialization (`getFirebaseApp/Auth/Firestore/Storage()`)
- **Storage Abstraction**: `StorageService` interface + `AsyncStorageService` implementation
- **React Query**: `QueryClient` with mobile defaults (5min stale, 30min gc, 2 retries)
- **Providers**: `GestureHandlerRootView` → `SafeAreaProvider` → `QueryClientProvider`
- **Error Handling**: `AppError` class, `ErrorBoundary`, `normalizeFirebaseError()`
- **Logger**: Structured dev-only logger with levels and context prefixes

### Batch 2B — Foundation Layer ✅
- **Zustand Stores**: `useAuthStore`, `useAppStore`, `useSettingsStore` (with persistence)
- **Theme Tokens**: colors, spacing, typography, radius, shadows (platform-aware)
- **Constants**: storage keys, Firestore collection names, app metadata
- **Shared Types**: `Result<T,E>`, `AsyncState<T>`, `FirestoreDocument`, `CreateDocument<T>`, `UpdateDocument<T>`
- **Utilities**: date helpers, Zod validation schemas, general helpers
- **Loading Components**: `FullScreenLoader`, `InlineLoader`
- **Master Barrel**: `@/shared` single import point

### Batch 3 — Authentication ✅
- **Lightweight AppUser**: Clean mapped representation of the Firebase User object.
- **Service & Repository**: `FirebaseAuthService` communicating with Firebase SDK and `AuthRepository` implementing the mapping and error normalization.
- **Four Zustand States**: `unknown`, `checking`, `authenticated`, `unauthenticated` states to eliminate UI flickering during startup.
- **Router Guards & Layouts**: Reusable `useRequireAuth` layout guard with stack layouts split into protected `(app)` and public `(auth)` file-system groups.
- **Forms & Validation**: Hook Form controllers and Zod schema validations for Login, Register, Forgot Password, and Email Verification.
### Batch 4A — Generic Routine Domain Engine ✅
- **Pure Engine Architecture**: `scheduler.ts`, `streak.ts`, and `completion.ts` implemented in `src/features/routine/engine/` with zero database or framework dependencies.
- **Timezone-Aware Scheduling**: Daily, weekly, monthly, and custom day calculations relative to IANA timezones.
- **Streak Calculation**: Pure functions calculating consecutive logging and log-rebuilds on undo.
- **Form Schemas**: Zod validation rules in `routine.validation.ts`.

### Batch 4B — Routine Infrastructure Integration ✅
- **Firestore Converters**: `routineConverter` and `routineLogConverter` handling Timestamp ⇄ Date transformations, default values, and nullable fields.
- **RoutineService**: Handles direct Firestore collection access, queries, soft-deletion archiving, and atomic `writeBatch` transactions.
- **RoutineRepository**: Coordinates domain engine calculations with Firestore services, validates authenticated user sessions, and normalizes errors into `AppError`.
- **React Query Hooks**: `useRoutines`, `useRoutine`, and `useRoutineMutations` with hierarchical `routineKeys` query keys factory.

### Batch 4C — Routine CRUD UI ✅
- **UI Components**: `RoutineCard`, `LoadingRoutineCard`, `EmptyRoutineState`, `RoutineStatusBadge`, `ArchiveRoutineDialog`, `FrequencySelector`, `ScheduleSelector`, `ReminderPicker`, `RoutineForm`.
- **Screen Components**: `RoutineListScreen` (with search, category filter, sorting, pull-to-refresh), `RoutineDetailsScreen` (with completion stats, logs, actions), `CreateRoutineScreen`, `EditRoutineScreen`.
- **Expo Router Routes**: `app/(app)/routines/index.tsx`, `new.tsx`, `[id].tsx`, `[id]/edit.tsx`.

### Batch 5A — Dashboard Architecture Planning ✅
- **Dynamic Widget Registry**: `widget.registry.ts` defining widget specs with localized `WidgetErrorFallback` error boundary wrappers.
- **Modular View Models & Mappers**: Split into domain-specific mappers (`greeting.mapper.ts`, `progress.mapper.ts`, `stats.mapper.ts`, `weekly.mapper.ts`, `activity.mapper.ts`) producing `DashboardViewModel`.
- **Module Registry**: `module.registry.ts` catalog for active and upcoming health modules.

### Batch 5B — Dashboard Implementation ✅
- **UI Components**: `DashboardHeader`, `TodayProgressCard`, `TodayRoutinesList`, `QuickActionsBar`, `StreakOverviewCard`, `StatsGrid`, `WeeklyProgressCard`, `RecentActivityCard`, `ModuleNavGrid`, `LoadingDashboard`, `EmptyDashboard`, `ErrorDashboard`.
- **Aggregation Hook**: `useDashboard` coordinating parallel React Query routine and log queries with quick action handlers (`completeRoutine`, `skipRoutine`).
- **Screen Component**: `DashboardScreen` composing presentational widgets with pull-to-refresh.
- **Route Integration**: `src/app/(app)/index.tsx` rendering `DashboardScreen` as primary home screen.

### Batch 6A — Haircare Module Architecture Planning ✅
- **Domain Extension Specification**: Designed `HairProduct`, `HairRoutine`, `HairLog` domain entities extending core generic `Routine` without duplicating scheduling/streak/completion math.
- **Clean Architecture Pipeline**: Specified UI ⇄ Hooks ⇄ Mappers ⇄ Repository ⇄ Service ⇄ Firestore pipeline.
- **Firestore Subcollections**: Schema definitions under `users/{uid}/hair_products`, `users/{uid}/hair_routines`, `users/{uid}/hair_logs`.

### Batch 6B — Haircare Module Implementation (v0.7.0) ✅
- **Domain Entities & Converters**: Firestore converters for `HairProduct`, `HairRoutine`, `HairLog` with Timestamp transformations.
- **Service & Repository**: `HaircareService` for collection CRUD and `HaircareRepository` returning `Result<T, AppError>`.
- **Modular Mappers**: `products.mapper.ts`, `routines.mapper.ts`, `logs.mapper.ts`, `dashboard.mapper.ts`.
- **Zod Validation Schemas**: Form validation for products, routines, and wash logs.
- **React Query Hooks**: `useHairProducts`, `useHairRoutines`, `useHairLogs`, `useHaircareDashboard`.
- **Components**: `HaircareHeader`, `ProductCard`, `ProductForm`, `HairRoutineCard`, `HairRoutineForm`, `HairLogCard`, `HairLogForm`, `HaircareWidget`, `LoadingHaircare`, `EmptyHaircare`, `ErrorHaircare`.
- **Screens & Routes**: `HaircareDashboardScreen`, `HairProductsScreen`, `HairRoutinesScreen`, `HairLogsScreen` under `app/(app)/haircare/`.
- **Main Dashboard Integration**: Updated `REGISTERED_MODULES` in `module.registry.ts`.

### Batch 6C — Hair Progress Photos & Timeline (v0.7.1) ✅
- **Domain Entity & Storage**: `HairPhoto` domain model, `hairPhotoConverter` for Firestore metadata (`users/{uid}/hair_photos`), and `HairStorageService` for Firebase Storage uploads & deletions (`users/{uid}/haircare/photos/{photoId}.jpg`).
- **Repository**: `HairPhotoRepository` coordinating binary storage uploads and Firestore metadata returning `Result<T, AppError>`.
- **Photos Mapper & Validation**: `photos.mapper.ts` (`mapToHairPhotoVM`, `groupPhotosByMonth`) and `hairPhotoUploadSchema`.
- **React Query Hooks**: `useHairPhotos`, `useUploadHairPhoto`, `useDeleteHairPhoto`, `useHairTimeline`.
- **Components**: `PhotoCard`, `PhotoGrid`, `TimelineCard`, `ComparisonCard`, `UploadPhotoButton`, `DeletePhotoDialog`, `EmptyGallery`.
- **Screens & Routes**: `HairTimelineScreen`, `ComparePhotosScreen` under `app/(app)/haircare/timeline.tsx` and `app/(app)/haircare/compare.tsx`.
- **Dashboard Preview Integration**: Added timeline stat tile and latest progress photo preview card to `HaircareDashboardScreen`.

### Batch 6D — Hair & Scalp Condition Tracking (v0.7.2) ✅
- **Domain Entity & Firestore**: `HairCondition` domain model (hair type, porosity, scalp type, density, 1-5 rating metrics, overall health score 1-10, lifestyle factors), `hairConditionConverter` under `users/{uid}/hair_conditions`.
- **Repository**: `HairConditionRepository` with search, filtering, and CRUD returning `Result<T, AppError>`.
- **Condition Mapper & Validation**: `condition.mapper.ts` (`mapToHairConditionVM`, `filterConditionVMs`) and `hairConditionSchema`.
- **React Query Hooks**: `useHairConditions`, `useLatestHairCondition`, `useCreateHairCondition`, `useUpdateHairCondition`, `useDeleteHairCondition`.
- **Components**: `ConditionBadge`, `ConditionCard`, `ConditionSummaryCard`, `ConditionForm`, `EmptyConditionState`.
- **Screens & Routes**: `HairConditionHistoryScreen` (with real-time search & scalp type filtering) and `HairConditionFormScreen` (create/edit) under `app/(app)/haircare/condition/`.
- **Dashboard Summary Integration**: Added scalp condition summary card (`ConditionSummaryCard`) to `HaircareDashboardScreen`.

### Batch 6E — Haircare Analytics & Insights (v0.7.3) ✅
- **Pure Calculation Engine**: `hairAnalytics.ts` (`calculateWeeklyAnalytics`, `calculateMonthlyAnalytics`, `calculateProductAnalytics`, `calculateConditionTrends`, `generateInsightCards`, `buildHairAnalyticsVM`). Zero side effects, zero async.
- **Analytics ViewModels**: `HairAnalyticsVM`, `WeeklyAnalyticsVM`, `MonthlyAnalyticsVM`, `ProductUsageVM`, `ConditionTrendVM`, `InsightCardVM`.
- **React Query Hooks**: `useHairAnalytics` aggregating routines, hair routines, products, wash logs, photos, and condition assessments.
- **Pure Chart Components**: `InsightCard`, `CompletionBarChart` (weekly frequency breakdown), `ConditionTrendChart` (scalp health averages & trend direction), `ProductUsageChart` (usage frequency ranking), `AnalyticsSummaryWidget`.
- **Screens & Routes**: `HairAnalyticsDashboardScreen` under `app/(app)/haircare/analytics.tsx`.
- **Dashboard Integration**: Added Analytics CTA header button and `AnalyticsSummaryWidget` tile to `HaircareDashboardScreen`.

### Batch 6F — AI Hair Coach & Intelligent Recommendations (v0.8.0) ✅
- **AI Engine & Context**: Provider strategy pattern (`HairAIProvider`, `FallbackHeuristicAIProvider`), `HairAIContextBuilder` (building token-efficient structured JSON payload from user history), and `PromptBuilder` system/user prompts.
- **Service & Repository**: `HairAIService` (rule-based recommendation engine, natural language Q&A, and weekly progress reviews) and `HairAIRepository` returning `Result<T, AppError>`.
- **React Query Hooks**: `useHairRecommendations`, `useAskHairCoach`, `useWeeklyHairReview`.
- **Presentation Components**: `ChatMessage`, `RecommendationCard`, `AICoachCard` (Dashboard widget), `PromptInput`, `EmptyConversation`.
- **Screens & Routes**: `HairCoachScreen` under `app/(app)/haircare/coach.tsx` (featuring Chat, Recommendations, and Weekly Review tabs).
- **Dashboard Integration**: Added AI Coach CTA header button and `AICoachCard` summary widget to `HaircareDashboardScreen`.

---

## Architecture

```
src/
├── app/                    ← Expo Router filesystem routes
│   ├── _layout.tsx         ← Root layout (Providers + ErrorBoundary + Stack)
│   └── index.tsx           ← Welcome screen
└── shared/                 ← Shared infrastructure (Batch 2)
    ├── config/             ← Environment validation
    ├── firebase/           ← Lazy Firebase initialization
    ├── storage/            ← Abstract StorageService + AsyncStorage impl
    ├── query/              ← React Query client
    ├── stores/             ← Zustand stores (auth, app, settings)
    ├── theme/              ← Design tokens (colors, spacing, typography, radius, shadows)
    ├── constants/          ← Storage keys, collections, app constants
    ├── types/              ← Common + Firebase types
    ├── errors/             ← AppError, ErrorBoundary, error utils
    ├── utils/              ← Logger, date, validation, helpers
    ├── components/         ← Loading components
    ├── providers/          ← Root provider composition
    └── index.ts            ← Master barrel export
```

Future features follow feature-first architecture:
```
src/features/
├── auth/
├── dashboard/
├── routines/
│   ├── haircare/
│   └── skincare/
├── nutrition/
├── water-tracker/
├── sleep/
├── progress/
└── analytics/
```

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| AsyncStorage over MMKV | Expo Go compatibility during dev; swappable via `StorageService` interface |
| Lazy Firebase init | No eager startup cost; init only when first feature calls it |
| System theme default | Respects user OS preference; manual override in future batch |
| No route constants | Expo Router provides filesystem routing; route constants are redundant |
| `require()` for Firebase auth persistence | Firebase v12 TS typing bug — `getReactNativePersistence` missing from types |
| Minimal providers | Only compose what exists now; avoid speculative providers |
| `Result<T,E>` union | Type-safe error handling without try/catch at every call site |
| Direct service layer | No interfaces for FirebaseAuthService because there is only one provider, avoiding unnecessary abstraction |
| AppUser mapping | Used a lightweight AppUser type mapped from Firebase User to keep user model intentionally simple |
| Four auth states | Used unknown, checking, authenticated, unauthenticated to prevent UI flickering during session restoration |
| Single Auth listener | Mounted once at root _layout to ensure consistent single source of truth in Zustand store |
| No React Query for Auth | Auth is strictly client application state, not server data caching |

---

## Dependencies Added (Batch 2)

| Package | Version | Purpose |
|---------|---------|---------|
| `firebase` | 12.16.0 | Firebase JS SDK (auth, firestore, storage) |
| `@tanstack/react-query` | latest | Server state management |
| `zustand` | latest | Client state management |
| `@react-native-async-storage/async-storage` | latest | Local persistence |
| `react-hook-form` | latest | Form management |
| `@hookform/resolvers` | latest | Zod resolver for RHF |
| `zod` | latest | Schema validation |

---

## Known Issues

1. **Node version warning**: React Native 0.86 recommends Node `^22.13.0`; current env has `v22.12.0`. Warnings only — everything builds.
2. **Firebase TS types**: `getReactNativePersistence` not in Firebase v12 default types. Workaround in `firebase/auth.ts` using `require()`.
3. **`.env` required**: App will throw on startup without valid Firebase credentials in `.env`.

---

## Remaining Batches

| Batch | Scope | Status |
|-------|-------|--------|
| 3 | Authentication (Firebase Auth, screens, auth flow) | ✅ Completed |
| 4 | Navigation + Dashboard shell | 🔲 Next |
| 5 | Daily Timeline + Checklist | 🔲 Planned |
| 6 | Routines (Haircare, Skincare) | 🔲 Planned |
| 7 | Nutrition + Protein Rotation | 🔲 Planned |
| 8 | Water Tracker + Sleep | 🔲 Planned |
| 9 | Progress Photos | 🔲 Planned |
| 10 | Analytics + Charts | 🔲 Planned |
| 11 | Notifications | 🔲 Planned |
| 12 | AI Coach | 🔲 Planned |

---

## Next Recommended Task

**Batch 4: Navigation & Dashboard Shell**
- Define tab navigation layout using Expo Router
- Design bottom navigation layout and routing
- Create Dashboard view shell structure
- Support routing checks for onboarding status

