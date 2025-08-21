import { useStompSocketStore, type SubscriptionInfo } from "@/stores/useStompSocketStore"
import { useRouter } from "vue-router"

const DUMMY_CREATE_REQUIEST = {
variant: "STANDART",
timeControl: "REALTIME",
category: "CASUAL",
secondPerSide: 0,
increment: 0
}
export function useMatchQueue() {

  const _stompStore = useStompSocketStore()
  const _router = useRouter()

  function enterInQueue(): SubscriptionInfo | null {
    const subInfo: SubscriptionInfo | null =  _stompStore.subscribe(`/matchmaking/queue`, (msg) => {
      console.log("GAME FINDED")
      const gameId = JSON.parse(msg.body).payload.gameId as number
      _router.push(`/${gameId}`)
    }, true)
    _stompStore.send("/matchmaking/queue", JSON.stringify(DUMMY_CREATE_REQUIEST))
    return subInfo;
  }

  return {
    enterInQueue
  }

}


