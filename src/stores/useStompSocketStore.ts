import { defineStore } from 'pinia'
import { Client } from '@stomp/stompjs'
import { readonly, ref } from 'vue'
import type { IMessage, IPublishParams, StompHeaders, StompSubscription } from '@stomp/stompjs'
import { useAuthStore } from './useAuthStore'

export type SubscriptionCallback = (payload: IMessage) => void
export type SubscriptionInfo = {
  id: string
  unsubscribe: () => void
  callbacks: Set<SubscriptionCallback>
  destination: string
  personal: boolean
}
type PendingSubscriptionInfo = {
  destination: string
  callback: SubscriptionCallback
  personal: boolean
}
export type PendingMessage = {
  destination: string
  payload: string
}

export const useStompSocketStore = defineStore('stompWebSocket', () => {

  const {
    VITE_API_DOMAIN
  } = import.meta.env

  if (!VITE_API_DOMAIN) {
    throw new Error('VITE_API_DOMAIN env variable is not defined')
  }

  const BROKER_URL = `https://${VITE_API_DOMAIN}/ws`
  const DEFAULT_RECONNECT_DELAY = 2000
  const TOPIC_PREFIX = '/topic'
  const APP_PREFIX = '/app'
  const USER_PREFIX = '/user'

  let _client: Client | null = null

  const _pendingSubscriptions = new Map<string, PendingSubscriptionInfo>()
  const _activeSubscriptions = new Map<string, SubscriptionInfo>()
  const _pendingMessages: PendingMessage[] = []
  const _pendingUnsubscriptions = new Set<string>()
  const _connectListeners = new Set<() => void>()

  const isConnected = ref(false)
  const isPendingMessages = ref(false)

  const authStore = useAuthStore()
  const authHeaders = (): StompHeaders => {
    const headers: StompHeaders = {}
    if (authStore.user) {
      headers['Authorization'] = `Bearer ${authStore.user.access_token}`
    }
    return headers
  }

  const connect = async (reconnectDelay = DEFAULT_RECONNECT_DELAY) => {
    if (isConnected.value) await disconnect()

    _client = new Client({
      brokerURL: BROKER_URL,
      reconnectDelay,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 0,
      connectHeaders: authHeaders(),

      onConnect: () => {
        console.log('✅ STOMP connected')
        isConnected.value = true

        // Обработка отложенных действий
        _pendingUnsubscriptions.forEach(internalUnsubscribe)
        _pendingUnsubscriptions.clear()

        _activeSubscriptions.forEach((info) => {
          if (!info.id) {
            internalSubscribe(info.destination, info.personal)
          }
        })

        _pendingSubscriptions.forEach((info) => {
          subscribe(info.destination, info.callback, info.personal)
        })
        _pendingSubscriptions.clear()

        _connectListeners.forEach(cb => cb())

        if (isPendingMessages.value) sendPendingMessages()
      },

      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message'], frame.body)
      },
    })

    _client.activate()
  }

  const disconnect = async () => {
    isConnected.value = false
    _activeSubscriptions.clear()
    _pendingMessages.length = 0
    _pendingUnsubscriptions.clear()
    _pendingSubscriptions.clear()
    await _client?.deactivate()
  }

  const onConnect = (callback: () => void) => {
    _connectListeners.add(callback)
    return () => _connectListeners.delete(callback)
  }

  const reconnect = () => _client?.activate()

  const sendPendingMessages = () => {
    _pendingMessages.forEach((element) => {
      internalSend(element.destination, element.payload)
    })
    _pendingMessages.length = 0
  }

  const setPendingMessages = (value: boolean) => {
    isPendingMessages.value = value
    if (!value) _pendingMessages.length = 0
  }

  // --- 🔹 Подписка на тему внутри STOMP ---
  const internalSubscribe = (destination: string, personal: boolean): StompSubscription => {
    const prefix = personal ? USER_PREFIX : ''
    const topic = `${prefix}${TOPIC_PREFIX}${destination}`

    const sub = _client!.subscribe(topic, (message: IMessage) => {
      const info = _activeSubscriptions.get(destination)
      if (info) {
        info.callbacks.forEach((cb) => {
          try {
            cb(message)
          } catch (err) {
            console.error('STOMP callback error:', err)
          }
        })
      }
    })

    return sub
  }

  // --- 🔹 Публичный subscribe ---
  const subscribe = (
    destination: string,
    callback: SubscriptionCallback,
    personal = false,
  ): (() => void) | null => {
    if (!isConnected.value) {
      _pendingSubscriptions.set(destination, { destination, callback, personal })
      return null
    }

    let info = _activeSubscriptions.get(destination)

    if (!info) {
      // Первая подписка на этот destination
      const stompSub = internalSubscribe(destination, personal)
      info = {
        id: stompSub.id,
        unsubscribe: stompSub.unsubscribe,
        callbacks: new Set([callback]),
        destination,
        personal,
      }
      _activeSubscriptions.set(destination, info)
    } else {
      // Уже есть подписка → просто добавляем новый колбэк
      info.callbacks.add(callback)
    }

    console.log(_activeSubscriptions)

    // Возвращаем функцию отписки конкретного обработчика
    console.log(_activeSubscriptions)
    return () => unsubscribe(destination, callback)
  }

  // --- 🔹 Внутреннее удаление подписки ---
  const internalUnsubscribe = (destination: string) => {
    const info = _activeSubscriptions.get(destination)
    if (!info) return

    // Передаём destination вручную, чтобы сервер его получил в UNSUBSCRIBE
    _client?.unsubscribe(info.id, { destination: info.destination })

    _activeSubscriptions.delete(destination)
  }

  // --- 🔹 Отписка обработчика / всего топика ---
  const unsubscribe = (destination: string, callback?: SubscriptionCallback) => {
    console.log('START UNSUB')
    const info = _activeSubscriptions.get(destination)

    if (!isConnected.value) {
      _pendingUnsubscriptions.add(destination)
      return
    }

    if (!info) return

    if (callback) {
      info.callbacks.delete(callback)
      // если нет обработчиков — полностью отписываемся
      if (info.callbacks.size === 0) {
        internalUnsubscribe(destination)
      }
    } else {
      // если callback не указан — снимаем подписку целиком
      internalUnsubscribe(destination)
    }

    console.log(_activeSubscriptions)
  }

  const internalSend = (destination: string, payload: string) => {
    const message: IPublishParams = {
      destination: `${APP_PREFIX}${destination}`,
      body: payload,
    }
    _client?.publish(message)
  }

  const send = (destination: string, payload: string) => {
    if (!isConnected.value) {
      if (isPendingMessages.value) _pendingMessages.push({ destination, payload })
      return
    }
    internalSend(destination, payload )
  }

  return {
    isConnected: readonly(isConnected),
    isPendingMessages: readonly(isPendingMessages),
    setPendingMessages,
    onConnect,
    connect,
    disconnect,
    reconnect,
    subscribe,
    unsubscribe,
    send,
  }
})
