import { defineStore } from 'pinia'
import { Client } from '@stomp/stompjs'
import { readonly, ref } from 'vue'
import type {
  IMessage,
  IPublishParams,
  StompHeaders,
  StompSubscription,
} from '@stomp/stompjs'
import { useAuthStore } from './useAuthStore'

export type SubscriptionCallback = (payload: IMessage) => void
export type SubscriptionInfo = {
  id: string
  unsubscribe: () => void
  callback: SubscriptionCallback
  destination: string
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
  const SUBSCRIBE_PREFIX = '/topic'
  const SEND_PREFIX = '/app'

  let _client: Client | null = null

  const _pendingSubscriptions = new Map<string, SubscriptionCallback>()
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
    console.log(headers)
    return headers
  }
  
  const connect = async (reconnectDelay: number = DEFAULT_RECONNECT_DELAY) => {
    if(isConnected.value === true) await disconnect()
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
          internalSubscribe(destination, info.callback)
        })

        _pendingSubscriptions.forEach((callback, destination) => {
          subscribe(destination, callback)
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
  ): StompSubscription => {
    return _client!.subscribe(`${SUBSCRIBE_PREFIX}${destination}`, (message: IMessage) =>
      callback(message),
    )
  }

  const subscribe = (
    destination: string,
    callback: SubscriptionCallback,
  ): SubscriptionInfo | null => {
    if (isConnected.value === false) {
      _pendingSubscriptions.set(destination, callback)
      return null
    }

    if (_activeSubscriptions.has(destination)) {
      _activeSubscriptions.get(destination)?.unsubscribe()
    }

    const info: StompSubscription = internalSubscribe(destination, callback)
    const fullInfo = {
      id: info.id,
      unsubscribe: info.unsubscribe,
      callback,
      destination,
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
      destination: `${SEND_PREFIX}${destination}`,
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
