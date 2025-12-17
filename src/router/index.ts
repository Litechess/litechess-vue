
import { useAuthStore } from '@/stores/useAuthStore'
import { usePageParamStore } from '@/stores/usePageParamStore'
import { createRouter, createWebHistory } from 'vue-router'

const BoardPage = () => import("@/page/BoardPage.vue")
const LoginCallbackAuthPage = () => import("@/page/LoginCallbackPage.vue")
const UserPage = () => import("@/page/UserPage.vue")
const PostRegistrationPage = () => import("@/page/PostRegistrationPage.vue")

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
    }
  ],
})

router.beforeEach(async (to, from, next) => {

  const auth = useAuthStore()
  const pageParamStore = usePageParamStore()

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

  if (to.name === 'play' && to.params.gameId) {
    console.log("set last game id: " + to.params.gameId)
    pageParamStore.setLastGameId(to.params.gameId as string)
  }

  next()
})

export default router
