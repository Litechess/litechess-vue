// src/auth/authService.ts
import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

const {
  VITE_OIDC_REALM,
  VITE_OIDC_CLIENT_ID,
} = import.meta.env

if (!VITE_OIDC_REALM || !VITE_OIDC_CLIENT_ID) {
  throw new Error('OIDC env variables are not defined')
}

const IDENTITY_URL: string = `/identity/realms/${VITE_OIDC_REALM}`

const APP_ORIGIN = window.location.origin

const settings = {

  authority: IDENTITY_URL,
  client_id: VITE_OIDC_CLIENT_ID,

  redirect_uri: `${APP_ORIGIN}/auth/login-callback`,
  post_logout_redirect_uri: `${APP_ORIGIN}`,
  silent_redirect_uri: `${APP_ORIGIN}/silent-renew`,

  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,

  userStore: new WebStorageStateStore({
    store: window.localStorage,
  }),
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
