import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from '@/composables/useApi'
import type { ServerNowResponse } from '@/types/ServerNow'

export const useServerTimeSyncStore = defineStore('serverTimeSync', () => {
  /** Разница между временем сервера и клиента (serverNow - Date.now()) */
  const offset = ref<number>(0)

  /** Среднее время пинга до сервера (в мс) */
  const ping = ref<number>(0)

  /** Время последней синхронизации (локальное время клиента) */
  const lastSync = ref<Date | null>(null)

  /** Таймер для повторной синхронизации */
  let timer: ReturnType<typeof setInterval> | null = null

  const api = useApi()

  /**
   * Получить серверное время (в мс) через API
   */
  async function fetchServerNow(): Promise<number> {
    const res: ServerNowResponse = await api.getServerTime()
    return res.serverNow
  }

  /**
   * Синхронизировать локальное время с серверным
   */
  async function sync(): Promise<void> {
    try {
      const startPerf = performance.now()
      const serverNow = await fetchServerNow()
      const endPerf = performance.now()

      const measuredPing = (endPerf - startPerf) / 2
      const computedOffset = serverNow + measuredPing - Date.now()

      ping.value = measuredPing
      offset.value = computedOffset
      lastSync.value = new Date()
    } catch (e) {
      console.error('[ServerTimeSync] Ошибка синхронизации:', e)
    }
  }

  /**
   * Запустить автоматическую синхронизацию с заданным интервалом
   */
  function start(intervalMs = 100000): void {
    stop()
    sync()
    timer = setInterval(sync, intervalMs)
  }

  /**
   * Остановить синхронизацию
   */
  function stop(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  /**
   * Получить текущее серверное время (локально, с учётом offset)
   */
  function getServerNow(): number {
    console.log(offset.value + " OFFSET")
    return Date.now() + offset.value
  }

  // Автоматический запуск при монтировании
  onMounted(() => {
    if (!timer) start()
  })

  // Очистка при размонтировании
  onUnmounted(stop)

  return {
    offset,
    ping,
    lastSync,
    start,
    stop,
    sync,
    getServerNow,
  }
})
