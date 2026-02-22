<template>
  <NConfigProvider
    :theme="isDark ? darkTheme : undefined"
    :theme-overrides="themeOverrides"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
  >
    <NMessageProvider :duration="MESSAGE_DURATION" placement="top-right">
      <NNotificationProvider>
        <div class="h-screen flex flex-col">
          <!-- ── Top header ── -->
          <NLayoutHeader bordered class="flex items-center justify-between px-2 py-2">
            <HailyLogo />

            <!-- Right controls -->
            <div class="flex gap-2 items-center">
              <!-- Dark / Light toggle -->
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

              <!-- Profile -->
              <NDropdown
                :options="userMenuOptions"
                trigger="click"
                placement="bottom-end"
                @select="handleUserMenuSelect"
              >
                <NButton text>
                  <NSpace align="center" :size="2">
                    <NAvatar>{{ userInitial }}</NAvatar>
                    <NText>{{ userName }}</NText>
                  </NSpace>
                </NButton>
              </NDropdown>
            </div>
          </NLayoutHeader>

          <!-- ── Body: sidebar + content ── -->
          <div class="flex-1 min-h-0 flex">
            <NLayout has-sider>
              <NLayoutSider
                bordered
                collapse-mode="width"
                :collapsed-width="56"
                :width="220"
                :collapsed="collapsed"
                show-trigger="bar"
                @collapse="collapsed = true"
                @expand="collapsed = false"
              >
                <NMenu
                  :options="menuOptions"
                  :collapsed="collapsed"
                  :collapsed-width="56"
                  :collapsed-icon-size="20"
                  :indent="18"
                />
              </NLayoutSider>

              <NLayoutContent>
                <RouterView />
              </NLayoutContent>
            </NLayout>
          </div>
        </div>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
  import { ref, computed, h } from 'vue'
  import { RouterView } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Icon } from '@iconify/vue'
  import { usePreferences } from '../composables/usePreferences'
  import {
    darkTheme,
    NConfigProvider,
    NMessageProvider,
    NNotificationProvider,
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NMenu,
    NDropdown,
    NButton,
    NSpace,
    NAvatar,
    NText,
    NIcon,
    NTooltip,
    type MenuOption,
    type DropdownOption,
  } from 'naive-ui'
  import { useAuthStore } from '@haily/auth'
  import HailyLogo from '../components/HailyLogo.vue'
  import { themeOverrides, MESSAGE_DURATION } from '../theme/index'

  const { t, locale: i18nLocale } = useI18n()
  const { isDark, currentLang, naiveLocale, naiveDateLocale, toggleTheme, setLang } =
    usePreferences(i18nLocale)

  // ── Sidebar ──────────────────────────────────────────────────
  const collapsed = ref(false)

  // ── Auth ─────────────────────────────────────────────────────
  const authStore = useAuthStore()
  const userName = computed(() => authStore.user?.name ?? authStore.user?.email ?? '')
  const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

  const menuOptions = computed<MenuOption[]>(() => [
    {
      label: t('layout.nav.home'),
      key: 'home',
      icon: () => h(NIcon, null, { default: () => h(Icon, { icon: 'fluent:home-24-regular' }) }),
      href: '/',
    },
  ])

  const userMenuOptions = computed<DropdownOption[]>(() => [
    {
      key: 'language',
      label: t('layout.lang.label'),
      children: [
        { key: 'lang-en', label: t('layout.lang.en') },
        { key: 'lang-id', label: t('layout.lang.id') },
      ],
    },
    { type: 'divider', key: 'd1' },
    {
      key: 'logout',
      label: t('layout.user.signOut'),
    },
  ])

  function handleUserMenuSelect(key: string) {
    if (key === 'lang-en' || key === 'lang-id') {
      setLang(key.replace('lang-', '') as 'en' | 'id')
    } else if (key === 'logout') {
      authStore.logout()
      const authUrl = import.meta.env.VITE_AUTH_APP_URL ?? '/'
      window.location.href = `${authUrl}/login`
    }
  }
</script>
