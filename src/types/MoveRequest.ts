import type { GameStatus } from "./ChessParty"

export type MoveRequest = {
  from: string,
  to: string
  promotion: string | null
  san: string
}

export type GameResult = {
  status: GameStatus
}
