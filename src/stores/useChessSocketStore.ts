import { defineStore } from 'pinia'
import { useStompSocketStore, type SubscriptionInfo } from './useStompSocketStore'
import { BoardApi, type Promotion } from 'vue3-chessboard'
import type { MoveRequest } from '@/types/MoveRequest'
import type { GameInfoToSub, SocketMessage, SocketMessageType } from '@/types/Socket'
import type { ChessParty } from '@/types/ChessParty'
import type { Key } from 'chessground/types'

type MessageHandler = (message: SocketMessage, boardInfo: GameInfoToSub) => void

export const useChessSocketStore = defineStore('chessSocket', () => {
  const _stompStore = useStompSocketStore()

  const handlers: Record<SocketMessageType, MessageHandler> = {
    gameInfo: (message, boardInfo) => {
      const partyInfo: ChessParty = message.payload as ChessParty
      boardInfo.boardApi.loadPgn(partyInfo.moveSan)
    },

    move: (message, boardInfo) => {
      const move: MoveRequest = message.payload as MoveRequest
      const boardApi: BoardApi = boardInfo.boardApi
      if (boardApi.getLastMove() != undefined && boardApi.getLastMove()!.san == move.san) {
        return
      }

      boardInfo.boardApi.move({
        from: move.from as Key,
        to: move.to as Key,
        promotion: move.promotion as Promotion,
      })
    },
  }

  const subscribe = (gameInfo: GameInfoToSub): SubscriptionInfo | null => {
    return _stompStore.subscribe(`/game/${gameInfo.gameId}`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      const messageType: SocketMessageType = message.headers['type'] as SocketMessageType
      handlers[messageType](message, gameInfo)
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
