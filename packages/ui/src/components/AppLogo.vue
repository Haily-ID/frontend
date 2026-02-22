<template>
  <div class="flex items-center gap-2.5">
    <img :src="appIcon" width="32" height="32" alt="Haily" />
    <span :class="['font-bold text-xl tracking-tight', inverted ? 'text-white' : 'text-gray-900']">
      Haily
    </span>
  </div>
</template>

<script setup lang="ts">
  import appIcon from '../assets/icon.png'

  withDefaults(
    defineProps<{
      size?: 'sm' | 'md' | 'lg'
      inverted?: boolean
    }>(),
    { inverted: false },
  )
</script>
