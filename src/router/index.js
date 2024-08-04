import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GraficoView from '../views/GraficoView.vue'
import GraficoApiView from '@/views/GraficoApiView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/grafico',
      name: 'grafico',
      component: GraficoView
    },
    {
      path: '/graficoApi',
      name: 'graficoApi',
      component: GraficoApiView
    },
  ]
})

export default router
