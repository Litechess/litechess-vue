import { type PlayerSide, type Timer } from '@/types/ChessParty'
import { readonly, ref, type InjectionKey } from 'vue'

export const TimerKey: InjectionKey<ReturnType<typeof useTimers>> = Symbol('timers')
export function useTimers() {
  const isActive = ref(false)

  const white = ref<Timer>({
    active: false,
    duration: 0,
  })

  const black = ref<Timer>({
    active: false,
    duration: 0,
  })

  function start(side: PlayerSide) {
    if (side == 'white') {
      white.value.active = true
    } else {
      black.value.active = true
    }
    isActive.value = true
  }

  function stop() {
    white.value.active = false
    black.value.active = false
    isActive.value = false
  }

  function swap() {
    const temp = white.value.active
    white.value.active = black.value.active
    black.value.active = temp
  }

  function reset() {
    white.value.active = false
    black.value.active = false
    white.value.duration = 0
    black.value.duration = 0
    isActive.value = false
  }

  function setDuration(side: PlayerSide, duration: number) {
    if (side == 'white') white.value.duration = duration
    else black.value.duration = duration
  }

  return {
    white: white,
    black: black,
    reset: reset,
    setDuration,
    stop,
    swap: swap,
    isActive: readonly(isActive),
    start: start,
  }
}
