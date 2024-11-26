import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import Antd from 'ant-design-vue';

const app = createApp(App)

app.use(VueSidebarMenu)
app.use(Antd)
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 1500,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
});

app.mount('#app')
