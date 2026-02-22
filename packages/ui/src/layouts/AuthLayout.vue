<template>
  <NConfigProvider
    :theme="isDark ? darkTheme : undefined"
    :theme-overrides="themeOverrides"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
  >
    <NGlobalStyle />
    <NMessageProvider :duration="MESSAGE_DURATION" placement="top-right">
      <NNotificationProvider>
        <div class="flex min-h-screen">
          <!-- ── Left: image panel ── -->
          <div class="relative hidden md:flex flex-[0_0_55%] flex-col justify-end overflow-hidden">
            <img :src="authBg" alt="" class="absolute inset-0 w-full h-full object-cover" />
            <div
              class="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-blue-900/40 to-blue-950/80"
            />
            <div class="relative p-10">
              <HailyLogo :inverted="true" />
              <p class="mt-5 text-white/75 text-[0.95rem] leading-relaxed max-w-[26rem]">
                One account. Every product in the Haily suite — HR, Finance, ERP, Inventory and
                more.
              </p>
            </div>
          </div>

          <!-- ── Right: form panel ── -->
          <div class="flex flex-1 flex-col overflow-y-auto">
            <!-- Controls row -->
            <div class="flex justify-end gap-2 p-4">
              <NTooltip trigger="hover" placement="bottom">
                <template #trigger>
                  <NButton @click="toggleTheme">
                    <template #icon>
                      <NIcon>
                        <Icon
                          :icon="
                            isDark
                              ? 'fluent:weather-sunny-24-regular'
                              : 'fluent:weather-moon-24-regular'
                          "
                        />
                      </NIcon>
                    </template>
                  </NButton>
                </template>
                {{ isDark ? t('layout.theme.light') : t('layout.theme.dark') }}
              </NTooltip>

              <NDropdown
                :options="langOptions"
                trigger="click"
                placement="bottom-end"
                @select="handleLangSelect"
              >
                <NButton>
                  {{ currentLang === 'en' ? 'EN' : 'ID' }}
                </NButton>
              </NDropdown>
            </div>

            <!-- Centered form -->
            <div class="flex flex-1 flex-col items-center justify-center px-6 py-4 md:px-8">
              <div class="w-full max-w-[22rem]">
                <div class="md:hidden mb-8">
                  <HailyLogo />
                </div>
                <RouterView />
              </div>
              <p class="mt-10 text-xs text-gray-400">
                &copy; {{ new Date().getFullYear() }} Haily. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Icon } from '@iconify/vue'
  import { usePreferences } from '../composables/usePreferences'
  import {
    darkTheme,
    NConfigProvider,
    NGlobalStyle,
    NMessageProvider,
    NNotificationProvider,
    NButton,
    NIcon,
    NTooltip,
    NDropdown,
    type DropdownOption,
  } from 'naive-ui'
  import HailyLogo from '../components/HailyLogo.vue'
  import { themeOverrides, MESSAGE_DURATION } from '../theme/index'
  import authBg from '../assets/auth.jpeg'

  const { t, locale: i18nLocale } = useI18n()
  const { isDark, currentLang, naiveLocale, naiveDateLocale, toggleTheme, setLang } =
    usePreferences(i18nLocale)

  const langOptions: DropdownOption[] = [
    { key: 'en', label: 'English' },
    { key: 'id', label: 'Indonesia' },
  ]

  function handleLangSelect(key: string) {
    setLang(key as 'en' | 'id')
  }
</script>
