import { useStompSocketStore, type SubscriptionInfo } from "@/stores/useStompSocketStore"
import { readonly, ref, shallowReactive } from "vue"

const DUMMY_CREATE_REQUIEST = {
timeControl: {
  "initTime": 15000,
  "increment" : 0
  },
category: "CASUAL"
}

export function useMatchQueue() {

  const _stompStore = useStompSocketStore()
  let _findSubInfo: SubscriptionInfo | null = null

  const inQueue = ref(false)

  function enterInQueue(gameFindedCallback: (gameId: number) => void): void {
    if(inQueue.value) return
    _findSubInfo =  _stompStore.subscribe(`/matchmaking/queue`, (msg) => {
      console.log("GAME FINDED")
      const gameId = JSON.parse(msg.body).payload.gameId as number
      gameFindedCallback(gameId)
      inQueue.value = false

    }, true)
    if(_findSubInfo == null) return
    _stompStore.send("/matchmaking/queue", JSON.stringify(DUMMY_CREATE_REQUIEST))
    inQueue.value = true
  }

  function leaveFromQueue() {
    if(inQueue.value == false) return
    _findSubInfo?.unsubscribe()
    inQueue.value = false
  }

  return shallowReactive({
    enterInQueue,
    leaveFromQueue,
    inQueue: readonly(inQueue)
  })
}


