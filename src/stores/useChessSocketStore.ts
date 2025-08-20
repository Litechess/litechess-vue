import { defineStore } from 'pinia'
import { useStompSocketStore, type SubscriptionInfo } from './useStompSocketStore'
import { BoardApi, type Promotion } from 'vue3-chessboard'
import type { GameResult, MoveRequest } from '@/types/MoveRequest'
import type { GameInfoToSub, SocketMessage, SocketMessageType } from '@/types/Socket'
import type { Key } from 'chessground/types'
import { useRouter } from 'vue-router'

type MessageHandler = (message: SocketMessage, boardInfo: GameInfoToSub, callback?: () => void) => void

export const useChessSocketStore = defineStore('chessSocket', () => {

  const DUMMY_CREATE_REQUIEST = {
    variant: "STANDART",
    timeControl: "REALTIME",
    category: "CASUAL",
    secondPerSide: 0,
    increment: 0
  }

  const _stompStore = useStompSocketStore()
  const router = useRouter()

  const handlers: Record<SocketMessageType, MessageHandler> = {
    "move": (message, boardInfo, callback?: () => void) => {
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

      callback?.()
    },

    "gameFinish": (message: SocketMessage) => {
      const resultMessage: GameResult = message.payload as GameResult
      console.log(resultMessage.status)
    }

  }

  const subscribeToGame = (gameInfo: GameInfoToSub, callback?: () => void): SubscriptionInfo | null => {
    return _stompStore.subscribe(`/game/${gameInfo.gameId}`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      const messageType: SocketMessageType = message.headers['type'] as SocketMessageType
      handlers[messageType](message, gameInfo, callback)
      callback?.();
    })
  }

  const enterInQueue = () => {
    const subInfo: SubscriptionInfo | null =  _stompStore.subscribe(`/matchmaking/queue`, (msg) => {
      console.log("GAME FINDED")
      const gameId = JSON.parse(msg.body).payload.gameId as number
      router.push(`/${gameId}`)
    }, true)
    _stompStore.send("/matchmaking/queue", JSON.stringify(DUMMY_CREATE_REQUIEST))
    return subInfo;
  }

  const sendMove = (gameId: number, move: MoveRequest): void => {
    _stompStore.send(`/game/${gameId}`, JSON.stringify(move))
  }

  return {
    sendMove,
    subscribe: subscribeToGame,
    enterInQueue
  }
})
