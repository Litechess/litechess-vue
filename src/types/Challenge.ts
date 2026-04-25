import type { TimeControl } from './ChessParty'

export type PlayerColor = 'WHITE' | 'BLACK'

export type Challenge = {
  id: string
  initiator: string
  opponent: string | null
  initiatorSide: PlayerColor | null
  control: TimeControl
}
