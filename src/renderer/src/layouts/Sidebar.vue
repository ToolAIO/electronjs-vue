<template>
  <div class="h-screen w-screen flex">
    <!-- Sidebar -->
    <div class="md:flex flex-col w-64 h-full overflow-hidden text-gray-400 bg-[#0c070c] border-r border-[#424244]">
      <router-link class="flex items-center w-full px-3 mt-3" to="/">
        <img src="/favicon.ico" class="h-10" alt="" />
        <span class="ml-2 text-base font-bold">AIO Download</span>
      </router-link>
      <div class="mt-2 p-5">
        <router-link
          v-for="(tab, index) in tabs"
          :key="index"
          :to="tab.route"
          class="flex items-center w-full sidebar-button hover:text-white p-2 rounded-lg transition duration-150 ease-out cursor-pointer"
          :class="{ 'bg-[#615876] bg-opacity-20 text-white': isTabActive(tab.route) }"
          @click.native="changeTab(index)"
        >
          <i :class="[tab.icon, 'text-lg']"></i>
          <p class="text-sm ml-2">{{ tab.label }}</p>
        </router-link>
      </div>
    </div>

    <!-- Main content -->
    <div class="w-full h-full md:col-span-3 sm:overflow-auto relative z-0 text-white p-4">
      <slot />
      <!-- <div class="footer text-center text-xs text-gray-500 mt-8">2023 © manhict</div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Reactive state
const currentTab = ref(0);
const tabs = [
  { label: "Home", icon: 'bx bxs-home', route: '/' },
  // { label: "Download", icon: 'bx bxs-download', route: '/download' },
  // { label: "Edit", icon: 'bx bxs-edit', route: '/edit' },
  // { label: "Setting", icon: 'bx bx-cog', route: '/setting' },
  { label: "About", icon: 'bx bxs-info-circle', route: '/about' },
];

// Sử dụng `useRoute` để lấy thông tin route hiện tại
const route = useRoute();

// Hàm thay đổi tab
const changeTab = (index) => {
  currentTab.value = index;
};

// Kiểm tra tab hiện tại có đang hoạt động hay không
const isTabActive = (routePath) => {
  if (routePath === '/') {
    return route.path === routePath;
  } else {
    return route.path.startsWith(routePath);
  }
};

// Theo dõi thay đổi route để cập nhật currentTab
watch(route, (to) => {
  const currentRoute = to.path;
  currentTab.value = tabs.findIndex((tab) => currentRoute.startsWith(tab.route));
});
</script>
