import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Error from '../components/NotFoundError.vue';
import Download from '../views/Download.vue';

const router = createRouter({
  history: createWebHashHistory(), // Must use Hash mode for Electron
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        displaySidebar: true,
      },
    },
    {
      path: '/download',
      name: 'download',
      component: Download,
      meta: {
        displaySidebar: true,
      },
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        displaySidebar: true,
      },
    },
    {
      path: '/:catchAll(.*)',
      name: 'error',
      component: Error,
      meta: {
        displaySidebar: false,
      },
    },
  ],
});

export default router;
