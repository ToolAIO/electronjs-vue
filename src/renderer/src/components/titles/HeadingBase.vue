<script setup>
import { toRefs } from 'vue';

// Nhận props trong setup
const props = {
  title: {
    type: String,
    required: true,
  },
  boxIcon: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    required: true,
  },
  textColor: {
    type: String,
    required: true,
  },
};

// Sử dụng `toRefs` để có thể thao tác với các biến props trong template
const { title, boxIcon, backgroundColor, textColor } = toRefs(props);
</script>


<template>
  <div class="w-full flex justify-between">
    <div class="flex items-center space-x-4">
      <div :class="`${backgroundColor} rounded flex items-center justify-center w-[33px] h-[33px]`">
        <i :class="`${boxIcon} text-2xl ${textColor}`"></i>
      </div>
      <h1 class="font-bold text-xl">{{ title }}</h1>
    </div>
  </div>
</template>
