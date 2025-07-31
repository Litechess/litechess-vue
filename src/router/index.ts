
import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import("@/components/HomePage.vue")
const PlayPage = () => import("@/components/PlayPage.vue")
const BoardPage = () => import("@/components/BoardPage.vue")
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/play',
      name: 'play',
      component: PlayPage
    },
    {
      path: '/board',
      name: 'board',
      component: BoardPage
    }
  ],
})

export default router
