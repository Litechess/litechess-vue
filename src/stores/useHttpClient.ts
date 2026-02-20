import { defineStore } from "pinia"
import { useAuthStore } from "./useAuthStore"

export const useHttpClient = defineStore('httpClient', () => {

  const {
    VITE_API_DOMAIN
  } = import.meta.env

  if (!VITE_API_DOMAIN) {
    throw new Error('API_DOMAIN env variable is not defined')
  }

  const BASE_URL = `https://${VITE_API_DOMAIN}`
  const authStore = useAuthStore()

  const getHeaders = () => {
    const headers: Record<string, string> = {}
    if (authStore.user) {
      headers['Authorization'] = `Bearer ${authStore.user.access_token}`
    }

    return headers
  }

  const get = async (endpoint: string) => {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw {
        status: response.status,
        message: response.statusText,
        body: errorBody,
      }
    }

    return response.json()
  }


  const post = async (endpoint: string, body: string) => {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: body,
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw {
        status: response.status,
        message: response.statusText,
        body: errorBody,
      }
    }

    return response.json()
  }

  const getBlob = async (endpoint: string): Promise<Blob> => {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => null)
      throw {
        status: response.status,
        message: response.statusText,
        body: errorBody,
      }
    }

    return response.blob()
  }

  return {
    get,
    post,
    getBlob
  }
})
