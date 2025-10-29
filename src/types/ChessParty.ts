import type { Move } from './MoveRequest'

export type ChessParty = {
  id: string
  white: PlayerInfo
  black: PlayerInfo
  moves: Move[]
  timerHistory: number[],
  timeControl: TimeControl | null
  initFen: string
  status: GameStatus
}

export type PlayerInfo = {
  id: string
  name: string
}

export type Timer = {
  active: boolean
  duration: number
}

export type TimeControl = {
  initTime: number,
  increment: number
}

export type TimeControls = {
  Bullet: TimeControl[];
  Blitz: TimeControl[];
  Rapid: TimeControl[];
};
export type PlayerSide = 'white' | 'black'
export type GameStatus =
'DRAW' |'WIN_WHITE'| 'WIN_BLACK' | 'NOT_FINISHED'
| 'TIMEOUT_WIN_WHITE' | 'TIMEOUT_WIN_BLACK' | 'SURRENDER_WIN_WHITE' | 'SURRENDER_WIN_BLACK'

export type GameEventType = 'SURRENDER' | 'DRAW'
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

export const TIME_CONTROLS: TimeControls = {
  "Bullet": [
    {
      "initTime": 60000,
      "increment": 0
    },
    {
      "initTime": 60000,
      "increment": 1000
    },
    {
      "initTime": 120000,
      "increment": 1000
    }
  ],

  "Blitz": [
    {
      "initTime": 180000,
      "increment": 0
    },
    {
      "initTime": 180000,
      "increment": 2000
    },
    {
      "initTime": 300000,
      "increment": 0
    }
  ],

  "Rapid": [
    {
      "initTime": 600000,
      "increment": 10000
    },
    {
      "initTime": 900000,
      "increment": 10000
    },
    {
      "initTime": 1800000,
      "increment": 0
    }
  ]
}

export const NO_TIME_CONTROL: TimeControl = {
  "initTime": 0,
  "increment": 0
}
