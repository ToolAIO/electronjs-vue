<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import Sidebar from '../layouts/Sidebar.vue'
import TitleBase from '../components/titles/TitleBase.vue';

// State
const message = ref('');

// Methods
const sendMessage = () => {
  if (message.value.trim()) {
    console.log(window);
    window.electronAPI.messageToElectron(message.value); // window.electronAPI is defined in preload.js

    toast.info("Message was successfully sent!", {
      theme: "dark",
      autoClose: 2000,
      position: toast.POSITION.TOP_RIGHT,
    });
  } else {
    toast.warn("Please enter a message before sending.", {
      theme: "dark",
      autoClose: 2000,
      position: toast.POSITION.TOP_RIGHT,
    });
  }
};
</script>


<template>
  <Sidebar>
    <TitleBase title="Home" boxIcon="bx bxs-home" />

    <div class="mt-0">
      <label for="token" class="text-lg text-white mb-2">Message to Electron:</label>
      <div class="relative">
        <textarea v-model="message" id="token"
          class="w-[650px] bg-[#302b3b] border border-gray-600 rounded-lg px-3 py-2 text-white" rows="2"
          placeholder="Enter your message..."></textarea>
      </div>
    </div>


  </Sidebar>
</template>
