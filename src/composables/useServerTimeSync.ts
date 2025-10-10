// composables/useServerTimeSync.js
import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from './useApi'
import type { ServerNowResponse } from '@/types/ServerNow'

export function useServerTimeSync(intervalMs = 10000) {
  const offset = ref(0) // serverNow - Date.now()
  const ping = ref(0)
  const lastSync = ref(null)
  let timer = null
  const api = useApi()

  async function sync() {
    const start = Date.now()
    const serverNow = await fetchServerNow() // функция, возвращающая serverNow в мс
    const end = Date.now()

    const measuredPing = (end - start) / 2
    const computedOffset = serverNow + measuredPing - end

    ping.value = measuredPing
    offset.value = computedOffset
    lastSync.value = new Date()
  }

  onMounted(() => {
    sync()
    timer = setInterval(sync, intervalMs)
  })

  async function fetchServerNow() {
    const res: ServerNowResponse = await api.getServerTime()
    return res.serverNow // должен быть миллисекундами (Instant.toEpochMilli)
  }

  onUnmounted(() => clearInterval(timer))

  // вычисление текущего серверного времени
  const getServerNow = () => Date.now() + offset.value

  return {
    offset,
    ping,
    lastSync,
    getServerNow,
    resync: sync
  }
}
