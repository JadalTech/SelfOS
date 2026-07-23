# SelfOS — Project State

> This file enables any engineer or AI assistant to resume the project without losing context.

---

## Current Status

| Field | Value |
|-------|-------|
| **Current Batch** | Batch 2B ✅ (Infrastructure Complete) |
| **Branch** | `develop` |
| **Last Tag** | `v0.1.0` (Batch 1 — Project Foundation) |
| **Last Commit** | Batch 2A + 2B (pending commit) |

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
| 3 | Authentication (Firebase Auth, screens, auth flow) | 🔲 Next |
| 4 | Navigation + Dashboard shell | 🔲 Planned |
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

**Batch 3: Authentication**
- Firebase Auth service (sign up, sign in, sign out, password reset)
- Auth screens (Login, Signup, Forgot Password)
- Auth state listener (`onAuthStateChanged` → `useAuthStore`)
- Protected route guard
- Onboarding flow
