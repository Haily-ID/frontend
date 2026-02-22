import { ref, computed, watch, type Ref } from 'vue'
import { enUS, idID, dateEnUS, dateIdID } from 'naive-ui'

type Lang = 'en' | 'id'

// ── Cookie helpers ───────────────────────────────────────────
const COOKIE_DOMAIN = '.haily.id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

function isLocalDev() {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost'
}

function getPrefCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? match[1] : null
}

function setPrefCookie(name: string, value: string) {
  const domain = isLocalDev() ? '' : `; Domain=${COOKIE_DOMAIN}`
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${value}; Path=/; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${domain}${secure}`
}

// ── Module-level singletons ──────────────────────────────────
// Shared within the same app instance; cookies share state across all *.haily.id apps.
const isDark = ref(getPrefCookie('haily-theme') === 'dark')
const currentLang = ref<Lang>((getPrefCookie('haily-lang') as Lang) ?? 'en')

watch(isDark, (val) => setPrefCookie('haily-theme', val ? 'dark' : 'light'))
watch(currentLang, (val) => setPrefCookie('haily-lang', val))

const naiveLocale = computed(() => (currentLang.value === 'id' ? idID : enUS))
const naiveDateLocale = computed(() => (currentLang.value === 'id' ? dateIdID : dateEnUS))

/**
 * Shared theme + language preferences.
 *
 * Preferences are stored as cookies with Domain=.haily.id so they are
 * automatically shared across all sub-apps (auth, ekeuangan, hr, …).
 *
 * Pass the `locale` ref from `useI18n()` to keep Vue I18n in sync automatically.
 *
 * @example
 * const { locale: i18nLocale } = useI18n()
 * const { isDark, currentLang, naiveLocale, naiveDateLocale, toggleTheme, setLang } =
 *   usePreferences(i18nLocale)
 */
export function usePreferences(i18nLocale?: Ref<string>) {
  if (i18nLocale) {
    // Sync immediately on mount, then keep in sync on change.
    i18nLocale.value = currentLang.value
    watch(currentLang, (val) => {
      i18nLocale.value = val
    })
  }

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setLang(lang: Lang) {
    currentLang.value = lang
  }

  return {
    isDark,
    currentLang,
    naiveLocale,
    naiveDateLocale,
    toggleTheme,
    setLang,
  }
}
