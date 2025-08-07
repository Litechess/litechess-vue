import { defineStore } from "pinia"
import { useAuthStore } from "./useAuthStore"

export const useHttpClient = defineStore('httpClient', () => {
  const BASE_URL = 'http://localhost:8080/'

  const authStore = useAuthStore()

  const getHeaders = () => {
    const headers: Record<string, string> = {}
    if (authStore.user) {
      headers['Authorization'] = `Bearer ${authStore.user.access_token}`
    }
    return headers
  }

  const get = async (endpoint: string) => {
    console.log('perform http')
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return response.json()
  }

  // const post = async (endpoint: string, body: any) => {
  //   const response = await fetch(`${BASE_URL}${endpoint}`, {
  //     method: 'POST',
  //     headers: {
  //       ...getHeaders(),
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(body),
  //   })
  //   return response.json()
  // }

  return {
    get
  }
})
