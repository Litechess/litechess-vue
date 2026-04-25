import type { TimeControl } from './ChessParty'

export type PlayerColor = 'WHITE' | 'BLACK'
export type ChallengeStatus = 'WAITING' | 'ACCEPTED' | 'CREATED'

export type Challenge = {
  id: string
  initiator: string
  opponent: string | null
  initiatorSide: PlayerColor | null
  timeControl: TimeControl | null
  status?: ChallengeStatus
}

export type CreateChallengeRequest = {
  initiator: string
  opponent: string | null
  initiatorSide: PlayerColor | null
  timeControl: TimeControl
}

export type GameCreatedEvent = {
  gameId: string
}
