<template>
  <NConfigProvider
    :theme="isDark ? darkTheme : undefined"
    :theme-overrides="themeOverrides"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
  >
    <NGlobalStyle />
    <NMessageProvider :duration="MESSAGE_DURATION" placement="top-right">
      <div class="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div class="flex flex-col items-center text-center max-w-md w-full gap-6">
          <HailyLogo />

          <NIcon size="72" depth="3">
            <Icon icon="fluent:building-24-regular" />
          </NIcon>

          <div class="flex flex-col gap-2">
            <NText tag="h1" class="text-2xl font-bold">
              {{ t('noCompany.title') }}
            </NText>
            <NText depth="3" class="text-base leading-relaxed">
              {{ t('noCompany.message') }}
            </NText>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <NButton type="primary" size="large" @click="handleCreate">
              <template #icon>
                <NIcon><Icon icon="fluent:building-add-24-regular" /></NIcon>
              </template>
              {{ t('noCompany.createCompany') }}
            </NButton>
            <NButton size="large" @click="handleLogout">
              <template #icon>
                <NIcon><Icon icon="fluent:sign-out-24-regular" /></NIcon>
              </template>
              {{ t('noCompany.logout') }}
            </NButton>
          </div>
        </div>
      </div>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Icon } from '@iconify/vue'
  import {
    darkTheme,
    NConfigProvider,
    NGlobalStyle,
    NMessageProvider,
    NButton,
    NIcon,
    NText,
  } from 'naive-ui'
  import { HailyLogo, usePreferences, themeOverrides, MESSAGE_DURATION } from '@haily/ui'
  import { useAuthStore } from '@haily/auth'

  const { t, locale: i18nLocale } = useI18n()
  const { isDark, naiveLocale, naiveDateLocale } = usePreferences(i18nLocale)

  const authStore = useAuthStore()
  const AUTH_APP_URL = import.meta.env.VITE_AUTH_APP_URL

  function handleCreate() {
    // TODO: navigate to company creation once the route exists
    window.location.href = '/company/create'
  }

  function handleLogout() {
    authStore.logout()
    window.location.href = `${AUTH_APP_URL}/login`
  }
</script>
