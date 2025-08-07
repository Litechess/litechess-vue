import { defineStore } from 'pinia'
import { useStompSocketStore, type SubscriptionInfo } from './useStompSocketStore'
import { BoardApi, type Promotion } from 'vue3-chessboard'
import type { MoveRequest } from '@/types/MoveRequest'
import type { SocketMessage } from '@/types/SocketMessage'
import type { ChessParty } from '@/types/ChessParty'
import type { Key } from 'chessground/types';

export type PlayerColor = 'w' | 'b' | 's'
export type ChessGameInfo = {
  gameId: number
  playerColor: PlayerColor
  boardApi: BoardApi
}

export const useChessSocketStore = defineStore('chessSocket', () => {
  const _stompStore = useStompSocketStore()

  const subscribe = (gameInfo: ChessGameInfo): SubscriptionInfo | null => {
    let lastSan: string | null = null
    return _stompStore.subscribe(`/game/${gameInfo.gameId}`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      if (message.headers['type'] == 'gameInfo') {
        const partyInfo: ChessParty = message.payload as ChessParty
        gameInfo.boardApi.loadPgn(partyInfo.moveSan)
        return
      }

      const move: MoveRequest = message.payload as MoveRequest
      if (lastSan != null && lastSan == move.san) {
        return
      }
      lastSan = move.san
      gameInfo.boardApi.move({
        from: move.from as Key,
        to: move.to as Key,
        promotion: move.promotion as Promotion
      })
    })
  }

  const sendMove = (gameId: number, move: MoveRequest): void => {
    _stompStore.send(`/game/${gameId}`, JSON.stringify(move))
  }

  return {
    sendMove,
    subscribe,
  }
})
