import { useStompSocketStore } from "@/stores/useStompSocketStore"
import type { TimeControl } from "@/types/ChessParty"
import { readonly, ref, shallowReactive } from "vue"

export function useMatchQueue() {

  const _stompStore = useStompSocketStore()
  let _findSubInfo: (() => void) | null

  const inQueue = ref(false)

  function enterInQueue(gameFindedCallback: (gameId: string) => void, timeControl: TimeControl): void {
    if(inQueue.value) return
    _findSubInfo =  _stompStore.subscribe(`/matchmaking/queue`, (msg) => {
      console.log("GAME FINDED")
      const gameId = JSON.parse(msg.body).payload.gameId
      gameFindedCallback(gameId)
      leaveFromQueue()

    }, true)
    if(_findSubInfo == null) return
    _stompStore.send("/matchmaking/queue", JSON.stringify({
      timeControl: timeControl,
      category: "CASUAL"
    }))
    inQueue.value = true
  }

  function leaveFromQueue() {
    if(inQueue.value == false) return
    console.log('unsubqueue')
    _findSubInfo!()
    inQueue.value = false
  }

  return shallowReactive({
    enterInQueue,
    leaveFromQueue,
    inQueue: readonly(inQueue)
  })
}


