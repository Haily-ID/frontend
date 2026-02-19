<template>
  <div class="flex items-center gap-2.5">
    <div
      :class="[
        'w-10 h-10 rounded-xl flex items-center justify-center',
        inverted
          ? 'bg-white/20 backdrop-blur-md border border-white/35'
          : 'bg-gradient-to-br from-primary-500 to-violet-500 shadow-[0_2px_8px_rgba(81,162,255,.35)]',
      ]"
    >
      <span class="text-white font-bold text-base">H</span>
    </div>
    <span :class="['font-bold text-xl tracking-tight', inverted ? 'text-white' : 'text-gray-900']">
      Haily
    </span>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      size?: 'sm' | 'md' | 'lg'
      inverted?: boolean
    }>(),
    { inverted: false },
  )
</script>
