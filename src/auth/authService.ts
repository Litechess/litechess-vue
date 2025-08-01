// src/auth/authService.ts
import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

const IDENTITY_URL: string = 'http://localhost:8000/realms/vue-test'

const settings = {
  authority: IDENTITY_URL,
  client_id: 'vue-frontend',
  redirect_uri: `http://localhost:5173/auth/login-callback`,
  post_logout_redirect_uri: `http://localhost:5173`,
  response_type: 'code',
  scope: 'openid profile email',
  silent_redirect_uri: `http://localhost:5173/silent-renew`,
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
}

const userManager = new UserManager(settings)

export default {
  signinRedirect: () => userManager.signinRedirect(),
  signinCallback: () => userManager.signinRedirectCallback(),
  signoutRedirect: () => userManager.signoutRedirect(),
  signoutCallback: () => userManager.signoutRedirectCallback(),
  getUser: () => userManager.getUser(),
  removeUser: () => userManager.removeUser(),
  events: userManager.events,
}
