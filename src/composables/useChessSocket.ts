import { useStompSocketStore } from '@/stores/useStompSocketStore'
import type { DrawDecline, DrawProposition, GameEventResponse, GameResult, Move, MoveMessage } from '@/types/MoveRequest'
import type { SocketMessage } from '@/types/Socket'
import type { MoveEvent } from 'vue3-chessboard'

export function useChessSocket() {

  type MessageHandler = (message: SocketMessage) => void

  const _socketStore = useStompSocketStore()
  let currentGameId: string | null = null
  let movesUnsubFunction: (() => void) | null
  let eventsUnsubFunction: (() => void) | null

  const handlers: Record<string, MessageHandler> = {
    MOVE: (message) => {
      const move: MoveMessage = message.payload as MoveMessage
      moveCallback?.(move)
    },

    GAME_FINISH: (message) => {
      const resultMessage: GameResult = message.payload as GameResult
      console.log("GAME FINISH" + resultMessage.status)
      gameFinishCallback?.(resultMessage)
    },

    DRAW_PROPOSITION: (message) => {
      const resultMessage: DrawProposition = message.payload as DrawProposition
      console.log('draw proposition')
      drawPropositionCallback?.(resultMessage)
    },

    DRAW_DECLINE: (message) => {
      const resultMessage: DrawDecline = message.payload as DrawDecline
      console.log('draw decline')
      drawDeclineCallback?.(resultMessage)
    }
  }

  let moveCallback: (move: MoveMessage) => void = () => {}
  let gameFinishCallback: (resultMessage: GameResult) => void = () => {}
  let drawPropositionCallback: (resultMessage: DrawProposition) => void = () => {}
  let drawDeclineCallback: (resultMessage: DrawDecline) => void = () => {}
  let unsubConnectCallback: () => void = () => {}

  function setMoveCallback(callback: (move: MoveMessage) => void) {
    moveCallback = callback
  }

  function setGameFinishCallback(callback: (gameResult: GameResult) => void) {
    gameFinishCallback = callback
  }

  function setDrawPropositionCallback(callback: (drawProposition: DrawProposition) => void) {
    drawPropositionCallback = callback
  }

  function setDrawDeclineCallback(callback: (drawDecline: DrawDecline) => void) {
    drawDeclineCallback = callback
  }

  function subscribe(gameId: string) {
    if(currentGameId != null) {
      unsubscribe()
    }

    movesUnsubFunction =_socketStore.subscribe(`/${gameId}/moves`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      handlers["MOVE"](message)
    })

    if(movesUnsubFunction == null) return

    eventsUnsubFunction = _socketStore.subscribe(`/${gameId}/events`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      const eventType: string = (message.payload as GameEventResponse).type
      handlers[eventType](message)
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


  function sendDrawProposition() {
    if(currentGameId == null) return

    const drawPropositionRequest = { event: 'DRAW_PROPOSITION' }
    _socketStore.send(`/${currentGameId}/events`, JSON.stringify(drawPropositionRequest))
  }

  function setConnectCallback(callback: () => void) {
    unsubConnectCallback()
    unsubConnectCallback = _socketStore.onConnect(() => {
      callback()
    })
  }

  function unsubscribe() {
    movesUnsubFunction!()
    eventsUnsubFunction!()
    unsubConnectCallback()
    currentGameId = null
  }

  return {
    setMoveCallback,
    setConnectCallback,
    setGameFinishCallback,
    setDrawDeclineCallback,
    sendDrawProposition,
    setDrawPropositionCallback,
    subscribe,
    unsubscribe,
    surrender,
    sendMove
  }
}
