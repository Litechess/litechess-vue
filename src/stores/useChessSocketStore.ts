import { defineStore } from 'pinia'
import { useStompSocketStore, type SubscriptionInfo } from './useStompSocketStore'
import type { BoardApi, MoveEvent } from 'vue3-chessboard'

export type PlayerColor = 'w' | 'b' | 's'
export type ChessGameInfo = {
  gameId: string
  playerColor: PlayerColor
  boardApi: BoardApi
}

export const useChessSocketStore = defineStore('chessSocket', () => {
  const _stompStore = useStompSocketStore()

  const subscribe = (gameInfo: ChessGameInfo): SubscriptionInfo | null => {
    console.log(gameInfo.gameId)
    return _stompStore.subscribe(`/${gameInfo.gameId}/move`, (msg) => {
      const move: MoveEvent = JSON.parse(msg.body)
      if (move.color === gameInfo.playerColor || gameInfo.boardApi.getFen() === move.after) {
        return
      }
  
      gameInfo.boardApi.move(move.san)
    })
  }

  const sendMove = (gameId: string, move: MoveEvent): void => {
    _stompStore.send(`/${gameId}/move`, JSON.stringify(move))
  }

  return {
    sendMove,
    subscribe,
  }
})
