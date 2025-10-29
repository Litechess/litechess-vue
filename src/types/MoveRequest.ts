import type { GameEventType, GameStatus } from './ChessParty'
export type Move = {
  from: string
  to: string
  promotion: string | null
  san: string
  plyNumber: number
}

export type MoveMessage = {
  move: Move
  timers: {
    WHITE: number
    BLACK: number
  }
  serverNow: number
}

export type GameEventResponse = {
  type: GameEventType

}

export type GameEventRequest = {
  event: GameEventType
}

export type GameResult = {
  status: GameStatus
}

export type DrawProposition = {
  gameId: string
  playerId: string
}

export type DrawDecline = {
  gameId: string
  playerId: string
}
