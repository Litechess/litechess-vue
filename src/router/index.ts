
import PostRegistrationPage from '@/page/PostRegistrationPage.vue'
import UserPage from '@/page/UserPage.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { createRouter, createWebHistory } from 'vue-router'

// const HomePage = () => import("@/page/HomePage.vue")
const BoardPage = () => import("@/page/BoardPage.vue")
const LoginCallbackAuthPage = () => import("@/page/LoginCallbackPage.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        return `/game`
      }
    },
    {
      path: '/auth/login-callback',
      name: 'loginCallback',
      component: LoginCallbackAuthPage
    },
    {
      path: '/game/:gameId?',
      name: 'play',
      component: BoardPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/user',
      redirect: () => {
        const auth = useAuthStore()
        return `/user/${auth.getId()}`
      }
    },
    {
      path: '/user/:userId',
      name: 'user',
      meta: { requiresAuth: true },
      component: UserPage
    },
    {
      path: '/registration',
      name: 'registration',
      meta: { requiresAuth: true },
      component: PostRegistrationPage
    },
    // {
    //   path: '/test/:gameId?',
    //   name: 'test',
    //   component: BoardTest
    // }
  ],
})

router.beforeEach(async (to, from, next) => {

  const auth = useAuthStore()
  if (to.name === 'loginCallback') {
    return next();
  }

  if (!auth.user) {
    await auth.loadUser();
  }

  if (to.meta.requiresAuth && !auth.user) {
    await auth.login();
    next()
    return;
  }

  if(auth.isRegistered === false && to.name !== 'registration') {
    next('/registration')
    return;
  }

  if(to.name === 'registration' && auth.isRegistered) {
    next('/user')
    return;
  }

  next()
})

export default router
