import type { GameStatus } from './ChessParty'
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

export type GameResult = {
  status: GameStatus
}
