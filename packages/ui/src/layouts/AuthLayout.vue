<template>
  <NConfigProvider :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
    <NMessageProvider :duration="MESSAGE_DURATION">
      <NNotificationProvider>
        <div class="flex min-h-screen">
          <!-- ── Left: image panel ── -->
          <div class="relative hidden md:flex flex-[0_0_55%] flex-col justify-end overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1400&auto=format&fit=crop&q=80"
              alt=""
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-blue-900/40 to-blue-950/80"
            />
            <!-- brand copy -->
            <div class="relative p-10">
              <AppLogo :inverted="true" />
              <p class="mt-5 text-white/75 text-[0.95rem] leading-relaxed max-w-[26rem]">
                One account. Every product in the Haily suite — HR, Finance, ERP, Inventory and
                more.
              </p>
            </div>
          </div>

          <!-- ── Right: form panel ── -->
          <div
            class="flex flex-1 flex-col items-center justify-center px-6 py-10 md:px-8 md:py-12 bg-white overflow-y-auto"
          >
            <div class="w-full max-w-[22rem]">
              <!-- Logo visible only on mobile (left panel is hidden) -->
              <div class="md:hidden mb-8">
                <AppLogo />
              </div>
              <RouterView />
            </div>
            <p class="mt-10 text-xs text-gray-400">
              &copy; {{ new Date().getFullYear() }} Haily. All rights reserved.
            </p>
          </div>
        </div>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
  import { NConfigProvider, NMessageProvider, NNotificationProvider } from 'naive-ui'
  import { enUS, dateEnUS } from 'naive-ui'
  import AppLogo from '../components/AppLogo.vue'
  import { themeOverrides, MESSAGE_DURATION } from '../theme/index'

  const locale = enUS
  const dateLocale = dateEnUS
</script>
