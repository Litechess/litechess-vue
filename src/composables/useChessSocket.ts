import { useStompSocketStore } from '@/stores/useStompSocketStore'
import type { GameResult, Move, MoveMessage } from '@/types/MoveRequest'
import type { SocketMessage, SocketMessageType } from '@/types/Socket'
import type { MoveEvent } from 'vue3-chessboard'

export function useChessSocket() {

  type MessageHandler = (message: SocketMessage) => void

  const _socketStore = useStompSocketStore()
  let currentGameId: string | null = null
  let movesUnsubFunction: (() => void) | null
  let eventsUnsubFunction: (() => void) | null

  const handlers: Record<SocketMessageType, MessageHandler> = {
    move: (message) => {
      const move: MoveMessage = message.payload as MoveMessage
      moveCallback(move)
    },

    gameFinish: (message) => {
      const resultMessage: GameResult = message.payload as GameResult
      console.log("GAME FINISH" + resultMessage.status)
      gameFinishCallback(resultMessage)
    },
  }

  let moveCallback: (move: MoveMessage) => void = () => {}
  let gameFinishCallback: (resultMessage: GameResult) => void = () => {}

  function setMoveCallback(callback: (move: MoveMessage) => void) {
    moveCallback = callback
  }

  function setGameFinishCallback(callback: (gameResult: GameResult) => void) {
    gameFinishCallback = callback
  }

  function subscribe(gameId: string) {
    if(currentGameId != null) {
      unsubscribe()
    }

    movesUnsubFunction =_socketStore.subscribe(`/${gameId}/moves`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      handlers["move"](message)
    })

    if(movesUnsubFunction == null) return

    eventsUnsubFunction = _socketStore.subscribe(`/${gameId}/events`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      handlers["gameFinish"](message)
    })

    if(eventsUnsubFunction == null) {
      movesUnsubFunction()
      return
    }

    currentGameId = gameId
  }

  function sendMove(move: MoveEvent) {
    if(currentGameId == null) return

    const moveRequest: Move = {
      from: move.from,
      to: move.to,
      promotion: move.promotion || null,
      san: move.san,
      plyNumber: 0 // TODO fix
     }


    _socketStore.send(`/${currentGameId}/moves`, JSON.stringify(moveRequest))
  }

  function surrender() {
    if(currentGameId == null) return

    const gameEventRequest = { event: 'SURRENDER' }
    _socketStore.send(`/${currentGameId}/events`, JSON.stringify(gameEventRequest))
  }

  function unsubscribe() {
    movesUnsubFunction!()
    eventsUnsubFunction!()
    currentGameId = null
  }

  return {
    setMoveCallback,
    setGameFinishCallback,
    subscribe,
    unsubscribe,
    surrender,
    sendMove
  }
}
