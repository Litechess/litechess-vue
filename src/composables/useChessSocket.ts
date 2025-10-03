import { useStompSocketStore } from '@/stores/useStompSocketStore'
import type { GameResult, Move } from '@/types/MoveRequest'
import type { SocketMessage, SocketMessageType } from '@/types/Socket'
import type { MoveEvent } from 'vue3-chessboard'

export function useChessSocket() {

  type MessageHandler = (message: SocketMessage) => void

  const _socketStore = useStompSocketStore()
  let currentGameId: string | null = null

  const handlers: Record<SocketMessageType, MessageHandler> = {
    move: (message) => {
      const move: Move = message.payload as Move
      moveCallback(move)
    },

    gameFinish: (message) => {
      const resultMessage: GameResult = message.payload as GameResult
      gameFinishCallback(resultMessage)
    },
  }

  let moveCallback: (move: Move) => void = () => {}
  let gameFinishCallback: (resultMessage: GameResult) => void = () => {}

  function setMoveCallback(callback: (move: Move) => void) {
    moveCallback = callback
  }

  function setGameFinishCallback(callback: (gameResult: GameResult) => void) {
    gameFinishCallback = callback
  }

  function subscribe(gameId: string) {
    if(currentGameId != null) {
      unsubscribe()
    }

    _socketStore.subscribe(`/game/${gameId}`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      const messageType: SocketMessageType = message.headers['type'] as SocketMessageType
      handlers[messageType](message)
    })

    currentGameId = gameId
  }

  function sendMove(move: MoveEvent) {
    if(currentGameId == null) return

    const moveRequest: Move = {
      from: move.from,
      to: move.to,
      promotion: move.promotion || null,
      san: move.san,
      plyNumber: 0 // TODO change
     }

    _socketStore.send(`/game/${currentGameId}`, JSON.stringify(moveRequest))
  }

  function unsubscribe() {
    _socketStore.unsubscribe(`/game/${currentGameId}`)
    currentGameId = null
  }

  return {
    setMoveCallback,
    setGameFinishCallback,
    subscribe,
    unsubscribe,
    sendMove
  }
}
