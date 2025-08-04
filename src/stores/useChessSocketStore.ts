import { defineStore } from 'pinia'
import { useStompSocketStore, type SubscriptionInfo } from './useStompSocketStore'
import type { BoardApi, MoveEvent } from 'vue3-chessboard'

export type PlayerColor = 'w' | 'b' | 's'
export type ChessGameInfo = {
  gameId: number
  playerColor: PlayerColor
  boardApi: BoardApi
}

export const useChessSocketStore = defineStore('chessSocket', () => {
  const _stompStore = useStompSocketStore()

  const subscribe = (gameInfo: ChessGameInfo): SubscriptionInfo | null => {
    console.log(gameInfo.gameId)
    return _stompStore.subscribe(`/game/${gameInfo.gameId}`, (msg) => {
      const move: MoveEvent = JSON.parse(msg.body)
      if (move.color === gameInfo.playerColor || gameInfo.boardApi.getFen() === move.after) {
        return
      }

      gameInfo.boardApi.move(move.san)
    })
  }

  const sendMove = (gameId: number, move: MoveEvent): void => {
    _stompStore.send(`/game/${gameId}`, JSON.stringify(move))
  }

  return {
    sendMove,
    subscribe,
  }
})
