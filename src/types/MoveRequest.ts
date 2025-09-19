import type { GameStatus } from './ChessParty'

export type Move = {
  from: string
  to: string
  promotion: string | null
  san: string
}

export type GameResult = {
  status: GameStatus
}
