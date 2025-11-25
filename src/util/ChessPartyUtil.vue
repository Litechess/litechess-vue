<script lang="ts">
import type { GameStatus } from '@/types/ChessParty';

const GAME_STATUSES: Record<GameStatus, GameStatus> = {
  WIN_WHITE: 'WIN_WHITE',
  WIN_BLACK: 'WIN_BLACK',
  DRAW: 'DRAW',
  NOT_FINISHED: 'NOT_FINISHED',
  TIMEOUT_WIN_BLACK: 'WIN_BLACK',
  TIMEOUT_WIN_WHITE: 'WIN_WHITE',
  SURRENDER_WIN_BLACK: 'WIN_BLACK',
  SURRENDER_WIN_WHITE: 'WIN_WHITE'
}

export function getSimpleStatus(status: GameStatus): GameStatus {
  if(status == 'NOT_FINISHED') return 'NOT_FINISHED'
  return GAME_STATUSES[status];
}

</script>
