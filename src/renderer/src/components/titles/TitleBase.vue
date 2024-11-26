<template>
  <div class="w-full flex justify-between mb-8">
    <div class="flex items-center space-x-4">
      <div class="bg-violet-800 rounded flex items-center justify-center w-11 h-11">
        <i :class="`${boxIcon} text-3xl text-violet-500`"></i>
      </div>
      <h1 class="font-bold text-2xl">{{ title }}</h1>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  boxIcon: {
    type: String,
    required: true,
  },
});
</script>
