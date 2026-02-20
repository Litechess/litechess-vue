/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_OIDC_REALM: string
  readonly VITE_OIDC_CLIENT_ID: string
  readonly API_DOMAIN: string
  readonly IDENTITY_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
