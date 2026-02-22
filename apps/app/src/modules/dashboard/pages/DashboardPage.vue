<template>
  <NLayout>
    <NLayoutContent>
      <div class="p-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <NCard
            v-for="hailyApp in apps"
            :key="hailyApp.key"
            hoverable
            @click="openApp(hailyApp.url)"
          >
            <NSpace vertical>
              <Icon :icon="hailyApp.icon" width="32" height="32" />
              <NText strong>{{ t(`dashboard.apps.${hailyApp.key}.name`) }}</NText>
              <NText depth="3">{{ t(`dashboard.apps.${hailyApp.key}.description`) }}</NText>
            </NSpace>
          </NCard>
        </div>
      </div>
    </NLayoutContent>
  </NLayout>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Icon } from '@iconify/vue'
  import { NLayout, NLayoutContent, NText, NCard, NSpace } from 'naive-ui'
  import { useDashboard } from '../composables/useDashboard'

  const { t } = useI18n()
  const { apps, openApp } = useDashboard()
</script>
