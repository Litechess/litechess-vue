import type { PlayerSide } from "./ChessParty";
import type { Move } from "./MoveRequest";

export type LiveGame = {
  id: number;
  moves: Move[];
  playerSides: Record<PlayerSide, string>;
  timerHistory: number[];
  currentTimers: {
    WHITE: number
    BLACK: number
  }
};
