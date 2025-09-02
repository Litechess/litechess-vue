import { defineStore } from 'pinia'
import { Client } from '@stomp/stompjs'
import { readonly, ref } from 'vue'
import type { IMessage, IPublishParams, StompHeaders, StompSubscription } from '@stomp/stompjs'
import { useAuthStore } from './useAuthStore'

export type SubscriptionCallback = (payload: IMessage) => void
export type SubscriptionInfo = {
  id: string
  unsubscribe: () => void
  callback: SubscriptionCallback
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

// suport 1 sub on one dist
// TODO refactor on many sub on one dist if neccessary
// TODO reconnect a couple of hours for revalidate access token
export const useStompSocketStore = defineStore('stompWebSocket', () => {
  const BROKER_URL: string = 'http://localhost:8080/ws'
  const DEFAULT_RECONNECT_DELAY: number = 2000
  const TOPIC_PREFIX = '/topic'
  const APP_PREFIX = '/app'
  const USER_PREFIX = '/user'

  let _client: Client | null = null

  const _pendingSubscriptions = new Map<string, PendingSubscriptionInfo>()
  const _activeSubscriptions = new Map<string, SubscriptionInfo>()
  const _pendingMessages: PendingMessage[] = []
  const _pendingUnsubscriptions = new Set<string>()

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

  const connect = async (reconnectDelay: number = DEFAULT_RECONNECT_DELAY) => {
    if (isConnected.value === true) await disconnect()
    _client = new Client({
      brokerURL: BROKER_URL,
      reconnectDelay,
      connectHeaders: authHeaders(),

      onConnect: () => {
        console.log('connected')
        isConnected.value = true

        _pendingUnsubscriptions.forEach(internalUnsubscribe)
        _pendingUnsubscriptions.clear()

        _activeSubscriptions.forEach((info, destination) => {
          internalSubscribe(destination, info.callback, info.personal)
        })

        _pendingSubscriptions.forEach((info, destination) => {
          subscribe(destination, info.callback, info.personal)
        })
        _pendingSubscriptions.clear()

        if (isPendingMessages.value) sendPendingMessages()
      },

      onStompError: (frame) => {
        console.error('Ошибка STOMP:', frame.headers['message'], frame.body)
      },
    })

    _client.activate()
  }

  const sendPendingMessages = () => {
    _pendingMessages.forEach((element) => {
      internalSend(element.destination, element.payload)
    })
    _pendingMessages.length = 0
  }

  const setPendingMessages = (value: boolean): void => {
    isPendingMessages.value = value
    if (!isPendingMessages.value) _pendingMessages.length = 0
  }

  const disconnect = async () => {
    isConnected.value = false
    _activeSubscriptions.clear()
    _pendingMessages.length = 0
    _pendingUnsubscriptions.clear()
    _pendingSubscriptions.clear()
    await _client?.deactivate()
  }

  const reconnect = () => {
    _client?.activate()
  }

  const internalSubscribe = (
    destination: string,
    callback: SubscriptionCallback,
    personal: boolean,
  ): StompSubscription => {
    const PERSONAL_PREFIX = personal ? USER_PREFIX : ""
    return _client!.subscribe(`${PERSONAL_PREFIX}${TOPIC_PREFIX}${destination}`, (message: IMessage) =>
      callback(message),
    )
  }

  const subscribe = (
    destination: string,
    callback: SubscriptionCallback,
    personal: boolean = false,
  ): SubscriptionInfo | null => {
    if (isConnected.value === false) {
      _pendingSubscriptions.set(destination, { destination, callback, personal })
      return null
    }

    if (_activeSubscriptions.has(destination)) {
      const subInfo: SubscriptionInfo = _activeSubscriptions.get(destination)!
      if (subInfo.personal == personal) {
        _activeSubscriptions.get(destination)!.unsubscribe()
      }
    }

    const info: StompSubscription = internalSubscribe(destination, callback, personal)
    const fullInfo = {
      id: info.id,
      unsubscribe: info.unsubscribe,
      callback,
      destination,
      personal,
    }

    _activeSubscriptions.set(destination, fullInfo)
    return fullInfo
  }

  const internalUnsubscribe = (destination: string) => {
    if (!_activeSubscriptions.has(destination)) return
    _activeSubscriptions.get(destination)!.unsubscribe()
    _activeSubscriptions.delete(destination)
  }

  const unsubscribe = (destination: string) => {
    if (isConnected.value === false) {
      _pendingUnsubscriptions.add(destination)
      return
    }

    internalUnsubscribe(destination)
  }

  const internalSend = (destination: string, payload: string): void => {
    const message: IPublishParams = {
      destination: `${APP_PREFIX}${destination}`,
      body: payload,
    }

    _client?.publish(message)
  }

  const send = (destination: string, payload: string): void => {
    if (isConnected.value === false) {
      if (isPendingMessages.value) _pendingMessages.push({ destination, payload })
      return
    }

    internalSend(destination, payload)
  }

  return {
    isConnected: readonly(isConnected),
    isPendingMessages: readonly(isPendingMessages),
    setPendingMessages,
    connect,
    disconnect,
    reconnect,
    subscribe,
    unsubscribe,
    send,
  }
})
