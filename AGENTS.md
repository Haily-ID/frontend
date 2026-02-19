# AGENTS.md - Haily Frontend

## Project Overview

**Haily Frontend** is an enterprise frontend application consisting of multiple independent apps, each deployed on its own subdomain:

| App         | Subdomain            | Description                        |
| ----------- | -------------------- | ---------------------------------- |
| `auth`      | `auth.haily.id`      | Central SSO (login, register, OTP) |
| `finance`   | `finance.haily.id`   | Finance Management                 |
| `erp`       | `erp.haily.id`       | ERP (Enterprise Resource Planning) |
| `hr`        | `hr.haily.id`        | HR Management                      |
| `inventory` | `inventory.haily.id` | Inventory Management               |

Built as a **pnpm multi-app monorepo** — each app is an independent Vite application that shares common packages (`ui`, `auth`, `api`, `types`, `utils`) via pnpm workspaces.

Each app can be developed, built, and deployed independently. Shared packages are versioned together in the same monorepo.

---

## Tech Stack

**Core Technologies**:

- **Language**: TypeScript (strict mode)
- **Framework**: Vue 3 (Composition API + `<script setup>`)
- **UI Library**: Naive UI (primary, all standard components)
- **Styling**: Tailwind CSS (custom/layout only, not for replacing Naive UI)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Package Manager**: pnpm (workspaces)
- **Architecture**: Multi-app monorepo, feature-based per app
- **Structure**: Monorepo (shared with backend, multi-app frontend)
- **Testing**: Vitest + Vue Test Utils
- **Linting**: ESLint + Prettier
- **i18n**: Vue I18n (en / id)

**Development Principles**:

1. **Multi-app Monorepo**: Each subdomain is a separate Vite app under `apps/`
2. **Shared Packages**: Common code lives in `packages/`, never duplicated across apps
3. **Feature-based Structure**: Within each app, group files by feature/module
4. **Composition API Only**: No Options API, always `<script setup>`
5. **Naive UI First**: Use Naive UI components for all standard UI needs
6. **Tailwind for Custom Only**: Use Tailwind only when Naive UI cannot fulfill a layout or styling need
7. **No Pure CSS**: Never write raw CSS (no `<style>` blocks with custom classes, no inline `style=""` unless absolutely required by a third-party constraint) — always reach for Naive UI props/theming first, then Tailwind utilities
8. **Type Safety**: Strict TypeScript, avoid `any`
9. **Minimal Comments**: Self-explanatory code, comment only complex logic
10. **API Design Alignment**: Match backend response format `{data}` or `{error}`
11. **UI Consistency & Mobile-First**: Every screen must be responsive. Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) and Naive UI's built-in responsive props. Test all layouts at mobile width. Consistent spacing, colour, and typography must be maintained across all apps using shared theme tokens.
12. **Localization is mandatory**: This is a multi-language application (currently `en` + `id`). Every user-visible string — labels, placeholders, error messages, tooltips, button text — **must** go through `vue-i18n`. Never hardcode a display string in a `.vue` file.

---

## Project Structure

```
frontend/
├── apps/
│   ├── auth/                    # → auth.haily.id (SSO center)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── App.vue
│   │   │   ├── router/
│   │   │   │   └── index.ts
│   │   │   └── modules/
│   │   │       ├── login/
│   │   │       ├── register/
│   │   │       └── verify-email/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── .env
│   │   └── .env.example
│   ├── finance/                 # → finance.haily.id
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── App.vue
│   │   │   ├── router/
│   │   │   │   └── index.ts
│   │   │   └── modules/
│   │   │       ├── dashboard/
│   │   │       ├── invoice/
│   │   │       └── report/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── .env
│   │   └── .env.example
│   ├── erp/                     # → erp.haily.id
│   ├── hr/                      # → hr.haily.id
│   └── inventory/               # → inventory.haily.id
├── packages/
│   ├── ui/                      # Shared Naive UI component wrappers
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   └── index.ts
│   │   └── package.json         # name: @haily/ui
│   ├── auth/                    # Shared auth logic (store, composables, interceptor)
│   │   ├── src/
│   │   │   ├── store/
│   │   │   ├── composables/
│   │   │   └── index.ts
│   │   └── package.json         # name: @haily/auth
│   ├── api/                     # Shared Axios instance + interceptors
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json         # name: @haily/api
│   ├── types/                   # Shared TypeScript types (DTOs, common)
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json         # name: @haily/types
│   └── utils/                   # Shared pure utilities
│       ├── src/
│       │   └── index.ts
│       └── package.json         # name: @haily/utils
├── pnpm-workspace.yaml
├── package.json                 # Root scripts + shared devDependencies
├── tailwind.config.ts           # Shared Tailwind config (extended per app)
├── tsconfig.base.json           # Base TS config (extended per app)
├── .eslintrc.cjs                # Shared ESLint config
└── .prettierrc
```

**pnpm-workspace.yaml**:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**How apps consume shared packages**:

```json
// apps/finance/package.json
{
  "dependencies": {
    "@haily/ui": "workspace:*",
    "@haily/auth": "workspace:*",
    "@haily/api": "workspace:*",
    "@haily/types": "workspace:*",
    "@haily/utils": "workspace:*"
  }
}
```

---

## App Structure (per `apps/*`)

Each app is a self-contained Vite app. Internally, it follows feature-based module structure:

```
apps/{app}/src/
├── main.ts
├── App.vue
├── router/
│   └── index.ts
└── modules/
    └── {module}/
        ├── components/    # UI components specific to this module
        ├── composables/   # Vue composables (useXxxList, useXxxForm, etc.)
        ├── pages/         # Route-level page components
        ├── services/      # API calls for this module
        ├── store/         # Pinia store for this module
        └── types/         # TypeScript types (extends @haily/types if needed)
```

**Example (finance app, invoice module)**:

```
apps/finance/src/modules/invoice/
├── components/
│   ├── InvoiceTable.vue
│   └── InvoiceForm.vue
├── composables/
│   └── useInvoiceList.ts
├── pages/
│   ├── InvoiceListPage.vue
│   └── InvoiceDetailPage.vue
├── services/
│   └── invoice.service.ts
├── store/
│   └── invoice.store.ts
└── types/
    └── invoice.types.ts
```

## Package Structure (per `packages/*`)

Shared packages follow a simple structure:

```
packages/{package}/
├── src/
│   └── index.ts        # Public API (named exports)
├── package.json        # name: @haily/{package}
└── tsconfig.json       # Extends tsconfig.base.json
```

**Rule**: If a piece of code is needed by **2 or more apps** → move it to the appropriate package. If it's only for one app → keep it inside that app.

---

## Naming Conventions

**Files**: `PascalCase` for Vue components (`LoginForm.vue`), `camelCase` for others (`useAuth.ts`, `auth.service.ts`)
**Packages/Folders**: `kebab-case` (`email-verification/`) or `camelCase` for composables/services
**Components**: `PascalCase` (`<LoginForm />`, `<UserTable />`)
**Composables**: `use` prefix, `camelCase` (`useAuth`, `useUserList`)
**Stores**: `camelCase` + `Store` suffix (`authStore`, `userStore`)
**Services**: `camelCase` + `.service.ts` suffix (`auth.service.ts`)
**Types/Interfaces**: `PascalCase` (`LoginRequest`, `UserResponse`)
**Constants**: `UPPER_SNAKE_CASE` for global constants, `camelCase` for local

---

## Styling Guide

### Naive UI — Primary UI Library

Use Naive UI for **all standard UI components**:

- Layout: `NLayout`, `NLayoutSider`, `NLayoutHeader`, `NLayoutContent`
- Navigation: `NMenu`, `NBreadcrumb`, `NTabs`
- Forms: `NForm`, `NFormItem`, `NInput`, `NSelect`, `NDatePicker`, `NCheckbox`, `NRadio`, `NSwitch`
- Data Display: `NDataTable`, `NCard`, `NStatistic`, `NTag`, `NBadge`, `NAvatar`
- Feedback: `NModal`, `NDrawer`, `NAlert`, `NMessage`, `NNotification`, `NSpin`, `NSkeleton`
- Buttons: `NButton`, `NButtonGroup`
- Other: `NSpace`, `NDivider`, `NGrid`, `NGridItem`

**Theme customization**: Configure via `NConfigProvider` at app root, never override Naive UI CSS directly.

### Tailwind CSS — Custom / Layout Supplement

Use Tailwind **only** when Naive UI does not cover the need:

✅ **Allowed Tailwind usage**:

- Custom spacing/layout not achievable with `NSpace` or `NGrid`
- Utility classes for page-level layout (`flex`, `grid`, `gap`, `min-h-screen`, etc.)
- Responsive wrappers around Naive UI components
- Custom animations or transitions not in Naive UI

❌ **Forbidden Tailwind usage**:

- Replacing Naive UI form components with plain HTML + Tailwind
- Styling typography/colors that conflict with Naive UI theme tokens
- Building custom button, input, select, table, modal — always use Naive UI

**Priority rule**: Naive UI component → Naive UI props/slots → Tailwind utility → custom CSS (last resort)

---

## API Integration

### Axios Setup (`packages/api/src/index.ts`)

- Shared Axios instance in `@haily/api` package
- Base URL from `VITE_API_BASE_URL` env variable (per-app)
- Request interceptor: attach `Authorization: Bearer <token>` from `@haily/auth` store
- Response interceptor: unwrap `data` field on success, extract `error` field on failure
- Centralized error handling: map backend error codes to user-facing messages via i18n

### Service Pattern

Each module has a service file that wraps API calls:

```ts
// apps/finance/src/modules/invoice/services/invoice.service.ts
import { api } from '@haily/api'
import type { InvoiceResponse, CreateInvoiceRequest } from '../types/invoice.types'

export const invoiceService = {
  list(): Promise<InvoiceResponse[]> {
    return api.get('/invoices')
  },
  create(payload: CreateInvoiceRequest): Promise<InvoiceResponse> {
    return api.post('/invoices', payload)
  },
}
```

### Response Type Alignment

Match backend DTOs exactly. All types are defined in `packages/types/src/index.ts` and available via `@haily/types`.

---

## Backend API Contract

All auth endpoints are under `/api/v1/auth`. The backend uses JWT (HS256) with these claims:
`user_id` (int64 as float64), `email` (string), `status` (string), `exp` (Unix).

### Types (`packages/types/src/index.ts`)

```ts
// ─── User ───────────────────────────────────────────────────────
export type UserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED'
export type UserGender = 'MALE' | 'FEMALE'

export interface UserDTO {
  id: string // Snowflake int64 → string
  email: string
  name: string
  phone: string | null
  gender: UserGender | null
  avatar_key: string | null
  status: UserStatus
  email_verified_at: number | null // Unix timestamp
  last_login_at: number | null // Unix timestamp
  created_at: number // Unix timestamp
  updated_at: number // Unix timestamp
}

// ─── Auth Requests ────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string // min 8 chars
  name: string // min 2 chars
}

export interface VerifyEmailRequest {
  token: string // from registration response
  otp: string // 6-digit code from email
}

export interface ResendOTPRequest {
  email: string
}

// ─── Auth Responses ───────────────────────────────────────────
export interface LoginResponse {
  token: string // JWT Bearer token
  user: UserDTO
}

export interface RegisterResponse {
  user: UserDTO
  verification_token: string // used in VerifyEmailRequest.token
  message: string // localized success message
}
```

### Auth Endpoints

| Method | Endpoint                    | Auth      | Description                                             |
| ------ | --------------------------- | --------- | ------------------------------------------------------- |
| `POST` | `/api/v1/auth/register`     | ❌        | Register → returns `RegisterResponse` + sends OTP email |
| `POST` | `/api/v1/auth/login`        | ❌        | Login → returns `LoginResponse` with JWT                |
| `POST` | `/api/v1/auth/verify-email` | ❌        | Submit OTP → activates account                          |
| `POST` | `/api/v1/auth/resend-otp`   | ❌        | Resend OTP email                                        |
| `GET`  | `/api/v1/auth/me`           | ✅ Bearer | Get current user                                        |

### Auth Error Codes

```ts
// packages/utils/src/errorMessages.ts — must map ALL backend auth error codes
export const AUTH_ERROR_CODES = {
  VALIDATION_ERROR: 'error.validationError',
  EMAIL_ALREADY_EXISTS: 'error.emailAlreadyExists',
  INVALID_CREDENTIALS: 'error.invalidCredentials',
  EMAIL_NOT_VERIFIED: 'error.emailNotVerified',
  ACCOUNT_SUSPENDED: 'error.accountSuspended',
  INVALID_VERIFICATION_TOKEN: 'error.invalidVerificationToken',
  VERIFICATION_TOKEN_USED: 'error.verificationTokenUsed',
  VERIFICATION_TOKEN_EXPIRED: 'error.verificationTokenExpired',
  MAX_OTP_ATTEMPTS_EXCEEDED: 'error.maxOtpAttemptsExceeded',
  INVALID_OTP: 'error.invalidOtp',
  USER_NOT_FOUND: 'error.userNotFound',
  EMAIL_ALREADY_VERIFIED: 'error.emailAlreadyVerified',
  UNAUTHORIZED: 'error.unauthorized',
  INTERNAL_SERVER_ERROR: 'error.internalServerError',
} as const
```

### Register → Verify Email Flow

```
POST /register
  → 201 { data: { user, verification_token, message } }
  → OTP sent to email (6 digits, expires per backend config)

POST /verify-email  { token: verification_token, otp: "123456" }
  → 200 { data: UserDTO }  (status: ACTIVE)

POST /resend-otp  { email }
  → 200 { data: { message } }  (invalidates previous OTP, sends new one)
```

### Login Flow

```
POST /login  { email, password }
  → 200 { data: { token: "eyJ...", user: UserDTO } }
  → Requires status: ACTIVE (not PENDING_VERIFICATION, not SUSPENDED)
```

---

## State Management (Pinia)

**Global Stores** (`packages/auth/src/store/`):

- `useAuthStore` — token, user, SSO hydration, login/logout (shared via `@haily/auth`)
- `useThemeStore` — Naive UI theme (light/dark) — local per app or shared as needed

**Module Stores** (`apps/{app}/src/modules/{module}/store/`):

- Scoped to one feature domain within one app
- Keep UI state (loading, pagination, selected rows)
- Call services to fetch/mutate data

**Store Pattern**:

```ts
// apps/finance/src/modules/invoice/store/invoice.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { invoiceService } from '../services/invoice.service'
import type { InvoiceResponse } from '../types/invoice.types'

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref<InvoiceResponse[]>([])
  const loading = ref(false)

  async function fetchInvoices() {
    loading.value = true
    try {
      invoices.value = await invoiceService.list()
    } finally {
      loading.value = false
    }
  }

  return { invoices, loading, fetchInvoices }
})
```

---

## Composables

Composables encapsulate reusable stateful logic:

```ts
// apps/finance/src/modules/invoice/composables/useInvoiceList.ts
import { onMounted } from 'vue'
import { useInvoiceStore } from '../store/invoice.store'
import { storeToRefs } from 'pinia'

export function useInvoiceList() {
  const invoiceStore = useInvoiceStore()
  const { invoices, loading } = storeToRefs(invoiceStore)

  onMounted(() => invoiceStore.fetchInvoices())

  return { invoices, loading }
}
```

**Rules**:

- Always prefixed with `use`
- Return reactive refs/computed
- Keep composables focused on one concern
- UI composables (useModal, useForm) are separate from data composables (useUserList)

---

## Routing

**Vue Router 4** — each app has its own router. **Non-auth apps redirect unauthenticated users to `auth.haily.id`** instead of a local login page:

```ts
// apps/finance/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@haily/auth'

const AUTH_APP_URL = import.meta.env.VITE_AUTH_APP_URL // https://auth.haily.id

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@haily/ui/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          component: () => import('../modules/dashboard/pages/DashboardPage.vue'),
        },
        {
          path: 'invoices',
          component: () => import('../modules/invoice/pages/InvoiceListPage.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    const redirect = encodeURIComponent(window.location.href)
    window.location.href = `${AUTH_APP_URL}/login?redirect=${redirect}`
    return false
  }
})

export default router
```

**`apps/auth` router** (handles all auth flows, no requiresAuth guard):

```ts
// apps/auth/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@haily/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: () => import('../modules/login/pages/LoginPage.vue') },
    { path: '/register', component: () => import('../modules/register/pages/RegisterPage.vue') },
    {
      path: '/verify-email',
      component: () => import('../modules/verify-email/pages/VerifyEmailPage.vue'),
    },
  ],
})

// If already authenticated, skip login/register
router.beforeEach((to) => {
  const authStore = useAuthStore()
  const publicPaths = ['/login', '/register', '/verify-email']
  if (authStore.isAuthenticated && publicPaths.includes(to.path)) {
    const redirect = new URLSearchParams(window.location.search).get('redirect')
    window.location.href = redirect ?? import.meta.env.VITE_DEFAULT_REDIRECT_URL
    return false
  }
})

export default router
```

**Route meta**: Use `meta.requiresAuth` and `meta.roles` for access control.

**Cross-app navigation**: Use `window.location.href` or full URL links. Do NOT use Vue Router for cross-app navigation.

---

## i18n / Localization

**Package**: Vue I18n (composables API, `useI18n`)

**Supported Languages**: `en` (default), `id`

**Detection**: Read from `Accept-Language` or user preference stored in localStorage.

**Structure**:

```
packages/utils/src/locales/   # Shared translations (common, auth, errors)
    ├── en/
    │   ├── common.json
    │   ├── auth.json
    │   └── errors.json
    └── id/
        ├── common.json
        ├── auth.json
        └── errors.json

apps/finance/src/locales/     # App-specific translations
    ├── en/
    │   └── invoice.json
    └── id/
        └── invoice.json
```

Each app merges shared + app-specific locale messages in its `main.ts`.

**Usage in components**:

```vue
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
</script>

<template>
  <NButton>{{ t('common.save') }}</NButton>
</template>
```

**Error code mapping**: Centralized in `@haily/utils`:

```ts
// packages/utils/src/errorMessages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: 'error.emailAlreadyExists',
  USER_NOT_FOUND: 'error.userNotFound',
  UNAUTHORIZED: 'error.unauthorized',
}
```

---

## Error Handling

**Backend Error Format**:

```json
{ "error": "EMAIL_ALREADY_EXISTS" }
```

**Handling Pattern**:

1. Axios interceptor catches non-2xx responses
2. Extracts `error` field from response body
3. Maps error code to i18n message key
4. Surfaces error via Naive UI `useMessage()` or form validation state

**Global Error Handler** (in `packages/api/src/index.ts`):

```ts
// packages/api/src/index.ts
api.interceptors.response.use(
  (res) => res.data.data,
  (err) => {
    const code = err.response?.data?.error ?? 'INTERNAL_SERVER_ERROR'
    const messageKey = ERROR_MESSAGES[code] ?? 'error.unknown'
    // Bubble up for local handling, or show global notification
    return Promise.reject({ code, messageKey })
  },
)
```

**Form-level errors**: Catch in service call, set form item feedback via Naive UI `NFormItem` validation.

**Global errors**: Use Naive UI `useNotification()` for unexpected errors.

---

## Form Handling

Use Naive UI `NForm` with its built-in rule validation system:

```vue
<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { FormInst, FormRules } from 'naive-ui'

  const formRef = ref<FormInst | null>(null)
  const model = reactive({ email: '', password: '' })

  const rules: FormRules = {
    email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
    password: [{ required: true, min: 8, message: 'Min 8 characters', trigger: 'input' }],
  }

  async function handleSubmit() {
    await formRef.value?.validate()
    // call service...
  }
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules">
    <NFormItem path="email" label="Email">
      <NInput v-model:value="model.email" />
    </NFormItem>
    <NButton @click="handleSubmit">Submit</NButton>
  </NForm>
</template>
```

---

## SSO — Single Sign-On Architecture

`auth.haily.id` is the **central authentication app**. All login, register, and OTP verification happen here. Other apps never implement their own login pages.

### How It Works

```
User visits finance.haily.id
  │
  ├─ @haily/auth: readSSOCookie() → found valid JWT
  │    → hydrate useAuthStore → user is authenticated ✅
  │
  └─ no cookie / expired
       → redirect to auth.haily.id/login?redirect=https://finance.haily.id

User logs in at auth.haily.id
  → POST /api/v1/auth/login
  → success: writeSSOCookie(token)  ← Domain=.haily.id (shared across all subdomains)
  → redirect back to https://finance.haily.id
  → finance reads cookie → authenticated ✅

Logout (from any app)
  → clearSSOCookie()  ← removes .haily.id cookie
  → redirect to auth.haily.id/login
```

### `@haily/auth` Package Spec

**`packages/auth/src/cookie.ts`** — SSO cookie helpers:

```ts
const COOKIE_NAME = 'haily_token'
const COOKIE_DOMAIN = '.haily.id'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24h in seconds

export function writeSSOCookie(token: string): void {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${token}; Domain=${COOKIE_DOMAIN}; Path=/; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`
}

export function readSSOCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match ? match[1] : null
}

export function clearSSOCookie(): void {
  document.cookie = `${COOKIE_NAME}=; Domain=${COOKIE_DOMAIN}; Path=/; Max-Age=0`
}
```

**`packages/auth/src/store/auth.store.ts`** — shared auth store:

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { readSSOCookie, writeSSOCookie, clearSSOCookie } from '../cookie'
import type { UserDTO } from '@haily/types'

export const useAuthStore = defineStore('haily-auth', () => {
  const token = ref<string | null>(null)
  const user = ref<UserDTO | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  // Call this in main.ts of every app on startup
  function hydrate(): boolean {
    const cookieToken = readSSOCookie()
    if (cookieToken) {
      token.value = cookieToken
      return true
    }
    return false
  }

  function setSession(newToken: string, newUser: UserDTO): void {
    token.value = newToken
    user.value = newUser
    writeSSOCookie(newToken)
  }

  function logout(): void {
    token.value = null
    user.value = null
    clearSSOCookie()
  }

  return { token, user, isAuthenticated, hydrate, setSession, logout }
})
```

**`packages/auth/src/index.ts`** — public exports:

```ts
export { useAuthStore } from './store/auth.store'
export { readSSOCookie, writeSSOCookie, clearSSOCookie } from './cookie'
```

### SSO Hydration in `main.ts` (every app)

Every app (except `auth` itself) must call `hydrate()` before mounting:

```ts
// apps/finance/src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@haily/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Hydrate auth state from SSO cookie before router resolves
const authStore = useAuthStore()
authStore.hydrate()

app.mount('#app')
```

`apps/auth/src/main.ts` also hydrates (to skip login if already logged in):

```ts
// apps/auth/src/main.ts — same pattern
const authStore = useAuthStore()
authStore.hydrate() // used by router guard on /login to redirect away
app.mount('#app')
```

### On 401 Response — Auto Logout

In `packages/api/src/index.ts`, intercept 401 globally:

```ts
api.interceptors.response.use(
  (res) => res.data.data,
  (err) => {
    if (err.response?.status === 401) {
      const { logout } = useAuthStore()
      logout()
      const redirect = encodeURIComponent(window.location.href)
      window.location.href = `${import.meta.env.VITE_AUTH_APP_URL}/login?redirect=${redirect}`
      return new Promise(() => {}) // never resolve, let redirect happen
    }
    const code = err.response?.data?.error ?? 'INTERNAL_SERVER_ERROR'
    return Promise.reject({ code })
  },
)
```

### `apps/auth` — Login Flow

```ts
// apps/auth/src/modules/login/services/login.service.ts
import { api } from '@haily/api'
import type { LoginRequest, LoginResponse } from '@haily/types'

export const loginService = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return api.post('/auth/login', payload)
  },
}
```

```ts
// apps/auth/src/modules/login/composables/useLogin.ts
import { ref } from 'vue'
import { useAuthStore } from '@haily/auth'
import { loginService } from '../services/login.service'
import type { LoginRequest } from '@haily/types'

export function useLogin() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()

  async function login(payload: LoginRequest, redirectUrl?: string) {
    loading.value = true
    error.value = null
    try {
      const { token, user } = await loginService.login(payload)
      authStore.setSession(token, user)
      const target = redirectUrl ?? import.meta.env.VITE_DEFAULT_REDIRECT_URL
      window.location.href = target
    } catch (err: any) {
      error.value = err.code ?? 'INTERNAL_SERVER_ERROR'
    } finally {
      loading.value = false
    }
  }

  return { loading, error, login }
}
```

### `apps/auth` — Register → Verify Email Flow

```ts
// apps/auth/src/modules/register/services/register.service.ts
import { api } from '@haily/api'
import type { RegisterRequest, RegisterResponse } from '@haily/types'

export const registerService = {
  register(payload: RegisterRequest): Promise<RegisterResponse> {
    return api.post('/auth/register', payload)
  },
}
```

```ts
// apps/auth/src/modules/verify-email/services/verify-email.service.ts
import { api } from '@haily/api'
import type { VerifyEmailRequest, UserDTO, ResendOTPRequest } from '@haily/types'

export const verifyEmailService = {
  verify(payload: VerifyEmailRequest): Promise<UserDTO> {
    return api.post('/auth/verify-email', payload)
  },
  resendOTP(payload: ResendOTPRequest): Promise<{ message: string }> {
    return api.post('/auth/resend-otp', payload)
  },
}
```

After registration, redirect to `/verify-email` with `token` in query params:

```
router.push({ path: '/verify-email', query: { token: verificationToken, email } })
```

After successful `verify-email`, redirect to login:

```
router.push({ path: '/login' })
```

### Dev Configuration

```bash
# apps/auth/.env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Haily Auth
VITE_APP_ENV=development
VITE_DEFAULT_REDIRECT_URL=http://localhost:5173  # finance app in dev

# apps/finance/.env (and other apps)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Haily Finance
VITE_APP_ENV=development
VITE_AUTH_APP_URL=http://localhost:5172  # auth app in dev
```

> **Note on cookies in dev**: `Domain=.haily.id` does NOT work on localhost. In development, use `localhost` without the Domain attribute, or use a local domain like `*.haily.local` via `/etc/hosts`. The `writeSSOCookie` helper should omit `Domain` when `import.meta.env.VITE_APP_ENV === 'development'`.

---

## Configuration (Environment Variables)

All env variables are prefixed with `VITE_`. Each app has its own `.env` file.

**Common variables (all apps)**:

```bash
VITE_API_BASE_URL=        # Backend API base URL
VITE_APP_NAME=            # e.g. "Haily Finance"
VITE_APP_ENV=development  # development | staging | production
```

**Non-auth apps additionally need**:

```bash
VITE_AUTH_APP_URL=        # URL of auth.haily.id (or localhost:5172 in dev)
```

**`apps/auth` additionally needs**:

```bash
VITE_DEFAULT_REDIRECT_URL=  # Where to redirect after login (defaults to finance app)
```

**Per-app `.env.example`**:

```bash
# apps/auth/.env.example
VITE_API_BASE_URL=
VITE_APP_NAME=Haily Auth
VITE_APP_ENV=development
VITE_DEFAULT_REDIRECT_URL=

# apps/finance/.env.example
VITE_API_BASE_URL=
VITE_APP_NAME=Haily Finance
VITE_APP_ENV=development
VITE_AUTH_APP_URL=
```

**Access in code**: `import.meta.env.VITE_API_BASE_URL`

**Never commit `.env`**. Always update `.env.example` when adding new variables. Every app manages its own env independently.

---

## Testing

**Unit Tests** (Vitest + Vue Test Utils):

- Test composables in isolation (mock Pinia store)
- Test stores (mock service calls)
- Test utility functions

**Component Tests**:

- Render components with `mountComponent`
- Test user interactions
- Assert emitted events and rendered output

**Commands**:

```bash
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # With coverage report
```

---

## Development Workflow

**Setup**:

1. `cd frontend`
2. `pnpm install` (installs all apps + packages)
3. Copy env files: `for app in auth finance erp hr inventory; do cp apps/$app/.env.example apps/$app/.env; done`
4. Fill in env values (at minimum `VITE_API_BASE_URL` in each app, `VITE_AUTH_APP_URL` in non-auth apps)
5. `pnpm dev --filter auth` to start SSO app, then `pnpm dev --filter finance` (or `pnpm dev:all`)

**Root Scripts** (run from `frontend/`):

```bash
# Run specific app
pnpm dev --filter auth
pnpm dev --filter finance
pnpm dev --filter erp

# Run all apps concurrently (recommended for SSO testing)
pnpm dev:all

# Build specific app
pnpm build --filter finance

# Build all apps
pnpm build --filter './apps/*'

# Run tests for all packages and apps
pnpm test --recursive

# Lint and format everything
pnpm lint
pnpm format
```

**Per-app port mapping** (dev):

| App       | Port |
| --------- | ---- |
| auth      | 5172 |
| finance   | 5173 |
| erp       | 5174 |
| hr        | 5175 |
| inventory | 5176 |

---

## Git Workflow & Version Control

Same branch strategy and semantic commit format as the backend:

**Branches**: `feature/<desc>`, `bugfix/<desc>`, `hotfix/<desc>`, `refactor/<desc>`

**Semantic Commits**:

```bash
feat(auth): add OTP verification page
fix(user): resolve avatar upload error
refactor(table): extract pagination composable
style(theme): update primary color token
chore(deps): upgrade naive-ui to v2.x
```

**Scopes**: `auth`, `sso`, `user`, `finance`, `erp`, `hr`, `inventory`, `theme`, `router`, `api`, `ui`, `types`, `utils`

**PR Workflow**: Same 7-step PR process as backend. Never commit directly to `main` or `develop`.

---

## AI Agent Guidelines

### Core Principles

1. ✅ **Multi-app aware**: Know which app you are working in, never cross-import between apps
2. ✅ **Shared code in packages**: If logic is needed by 2+ apps, it belongs in `packages/`
3. ✅ **SSO via `@haily/auth`**: Never implement a login page in non-auth apps. Always redirect to `auth.haily.id`
4. ✅ **Always call `authStore.hydrate()` in `main.ts`**: Every app must hydrate SSO cookie on startup
5. ✅ **Use `@haily/types` for backend types**: Never redefine `UserDTO`, `LoginRequest`, etc. locally
6. ✅ **Naive UI First**: Always use Naive UI components before reaching for Tailwind or plain HTML
7. ✅ **Composition API Only**: Always `<script setup lang="ts">`, never Options API
8. ✅ **Strict TypeScript**: No `any`, define types in `types/` files
9. ✅ **Feature-based structure**: New files go in the correct module folder within the correct app
10. ✅ **Pinia for state**: No `ref`/`reactive` for shared state, use stores
11. ✅ **Service layer**: All API calls go through `services/`, never directly in components
12. ✅ **i18n all user-facing strings**: Never hardcode display text
13. ✅ **Semantic commits**: Conventional format with correct scope
14. ✅ **Feature branches**: Never commit to `main`/`develop`
15. ✅ **Always PR**: Human review required

### Common Scenarios

**New Page (within existing app)**:

1. Identify the target app (`apps/finance`, `apps/erp`, etc.) — never `apps/auth` for feature pages
2. Create page component in `apps/{app}/src/modules/{module}/pages/`
3. Add route in `apps/{app}/src/router/index.ts` (lazy import, add `meta: { requiresAuth: true }`)
4. Create composable if needed (`apps/{app}/src/modules/{module}/composables/`)
5. Add i18n keys to `apps/{app}/src/locales/`

**Modify auth flow** (login, register, OTP):

1. All auth UI changes go in `apps/auth/src/modules/{login|register|verify-email}/`
2. Auth service calls use types from `@haily/types`
3. After login success → call `authStore.setSession(token, user)` then redirect
4. Never store token in localStorage — only SSO cookie via `writeSSOCookie()`

**New Module (within existing app)**:

1. Create folder `apps/{app}/src/modules/{module}/` with all sub-folders
2. Define TypeScript types in `types/` (extend `@haily/types` if applicable)
3. Create service in `services/` (use `api` from `@haily/api`)
4. Create Pinia store in `store/`
5. Build composables in `composables/`
6. Build components in `components/`
7. Build pages in `pages/`
8. Register routes in the app router

**New App** (new subdomain):

1. Create `apps/{app}/` folder
2. Copy `vite.config.ts`, `tsconfig.json`, `index.html`, `package.json` from an existing app and adjust
3. Add `@haily/*` workspace dependencies in `package.json`
4. Create `.env` + `.env.example`
5. Build `src/main.ts`, `src/App.vue`, `src/router/index.ts`
6. Add modules following the module pattern above
7. Register in root `package.json` dev/build scripts

**New Shared Component**:

1. Place in `packages/ui/src/components/`
2. Must be generic (no app-specific logic)
3. Export from `packages/ui/src/index.ts`
4. Accept props with TypeScript types
5. Emit typed events
6. Use Naive UI internally when possible

**Promote app code to shared package**:

1. Move the code from `apps/{app}/src/` to `packages/{package}/src/`
2. Export from `packages/{package}/src/index.ts`
3. Add `@haily/{package}` as dependency in all apps that need it
4. Remove original file from the app

### Code Quality Rules

- ✅ No business/API logic in page components — delegate to composables/stores
- ✅ Keep components small and focused (< ~200 lines)
- ✅ Always define prop types with TypeScript (`defineProps<{...}>()`)
- ✅ Always define emit types (`defineEmits<{...}>()`)
- ✅ No `console.log` in committed code
- ✅ Prefer `computed` over methods for derived data
- ✅ Use `v-model` binding patterns properly for Naive UI components
- ✅ All layouts must be responsive — use Tailwind responsive prefixes and test at mobile width
- ✅ Every user-visible string must use `t('...')` from `vue-i18n` — no exceptions
- ✅ When adding a new translatable string, add the key to **all** locale files (`en/` and `id/`)
- ❌ No `Options API`
- ❌ No plain `fetch()`, always use Axios service
- ❌ No hardcoded display strings — every label, placeholder, tooltip, and message goes through i18n
- ❌ No pure CSS — no custom `<style>` classes, no raw `style=""` attributes
- ❌ No inline styles — use Naive UI component props/theming or Tailwind utilities instead
- ❌ No `any` type

### Tailwind vs Naive UI Decision Guide

| Need                             | Use                                                        |
| -------------------------------- | ---------------------------------------------------------- |
| Button, Input, Select, Checkbox  | `NButton`, `NInput`, `NSelect`, `NCheckbox`                |
| Table with pagination            | `NDataTable`                                               |
| Modal / Dialog                   | `NModal`                                                   |
| Notifications / Toasts           | `useMessage()`, `useNotification()`                        |
| Page layout (sidebar, header)    | `NLayout`, `NLayoutSider`                                  |
| Card/panel                       | `NCard`                                                    |
| Loading state                    | `NSpin`, `NSkeleton`                                       |
| Full-page flex centering         | Tailwind (`flex items-center justify-center min-h-screen`) |
| Custom grid / spacing / layout   | Tailwind (`grid grid-cols-3 gap-6`, `flex flex-col`, etc.) |
| Responsive breakpoints           | Tailwind (`sm:`, `md:`, `lg:`)                             |
| Custom animation / transition    | Tailwind (`transition-all duration-300`)                   |
| Spacing around NUI components    | Tailwind (`mt-2`, `mb-5`, `px-4`, etc.)                    |
| Primary colour on plain HTML/SVG | Tailwind (`text-primary-500`, `bg-primary-500`)            |

### Naive UI Theming

Brand colours and global design tokens live in **`packages/ui/src/theme/index.ts`** as a
`GlobalThemeOverrides` object. `AuthLayout` (and every future layout) passes it to
`<NConfigProvider :theme-overrides="themeOverrides">` so it cascades to all child components.

**Never override Naive UI colours via CSS or inline styles.** Always update `themeOverrides`.

```ts
// packages/ui/src/theme/index.ts — canonical example
import type { GlobalThemeOverrides } from 'naive-ui'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#51a2ff',
    primaryColorHover: '#74b6ff',
    primaryColorPressed: '#3a8fe8',
    primaryColorSuppl: '#dbeafe',
  },
  // Per-component overrides go here:
  // Input: { borderFocus: '1px solid #51a2ff' },
}
```

Key rules:

- `common.*` tokens cascade to **all** Naive UI components automatically
- Per-component keys (e.g. `Button: {}`, `Input: {}`) override only that component
- Import `themeOverrides` from `@haily/ui` in any new layout/app root that uses `NConfigProvider`
- Tailwind `primary-*` colours are kept in sync in each app's `tailwind.config.ts`
