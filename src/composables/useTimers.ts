import { type PlayerSide, type Timer } from "@/types/ChessParty";
import { ref, type InjectionKey } from "vue";

export const TimerKey: InjectionKey<ReturnType<typeof useTimers>> = Symbol('timers')
export function useTimers() {

  const timerWhite = ref<Timer>({
    active: false,
    duration: 0
  })

  const timerBlack = ref<Timer>({
    active: false,
    duration: 0
  })

  function startTimers(side: PlayerSide) {
    if(side == 'white') {
      timerWhite.value.active = true
    } else {
      timerBlack.value.active = true
    }
  }

  function swapTimers() {
    const temp = timerWhite.value.active
    timerWhite.value.active = timerBlack.value.active
    timerBlack.value.active = temp
  }

  function resetTimers() {
    timerWhite.value.active = false
    timerBlack.value.active = false
    timerWhite.value.duration = 0
    timerBlack.value.duration = 0
  }

  function setDuration(side: PlayerSide, duration: number) {
    if(side == "white") timerWhite.value.duration = duration
    else timerBlack.value.duration = duration
  }

  return {
    timerWhite,
    timerBlack,
    resetTimers,
    setDuration,
    swapTimers,
    startTimers
  }
}
