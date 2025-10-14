import type { GameStatus, PlayerSide } from "@/types/ChessParty";
import type { Move } from "@/types/MoveRequest";
import { readonly, ref, type Ref } from "vue";
import type { BoardApi, CapturedPieces } from "vue3-chessboard"
import { type InjectionKey } from 'vue'

export const BoardKey: InjectionKey<ReturnType<typeof useBoard>> = Symbol('board')
export function useBoard() {

  let _boardApi: BoardApi | null = null;

  const takedPieceWhite: Ref<string[]> = ref([])
  const takedPieceBlack: Ref<string[]> = ref([])
  const moves: Ref<string[]> = ref([])
  const openingName = ref('Start position')
  const currentTurn: Ref<PlayerSide> = ref('white')
  const currentPly: Ref<number> = ref(1)
  const materialDiff: Ref<number> = ref(0)
  const gameStatus: Ref<GameStatus> = ref('NOT_FINISHED')

  function setBoardApi(api: BoardApi | null) {
    _boardApi = api
    updateState()
  }
  function updateState() {
    moves.value = _boardApi.getHistory()
    const pieces: CapturedPieces = _boardApi.getCapturedPieces()
    takedPieceBlack.value = pieces.black
    takedPieceWhite.value = pieces.white
    currentTurn.value = _boardApi!.getTurnColor()
    _boardApi.getOpeningName().then((name) => {
      if (name != null) openingName.value = name
      else openingName.value = 'Start position'
    })
    currentPly.value = _boardApi.getCurrentPlyNumber()
    materialDiff.value = _boardApi.getMaterialCount().materialDiff
    gameStatus.value = _getGameStatus(_boardApi)
  }

  function _getGameStatus(boardApi: BoardApi): GameStatus {
    if (boardApi.getIsGameOver() == false) return 'NOT_FINISHED'
    if (boardApi.getIsDraw()) return 'DRAW'
    if (boardApi.getTurnColor() == 'white') return 'WIN_BLACK'
    return 'WIN_WHITE'
  }

  function setPosition(moves: Move[]) {
    if(_boardApi == null) return
    _boardApi.loadPgn(moves.map(move => move.san).join(' '))
    updateState()
  }

  return {
    openingName: readonly(openingName),
    currentTurn: readonly(currentTurn),
    currentPly: readonly(currentPly),
    materialDiff: readonly(materialDiff),
    gameStatus: readonly(gameStatus),
    takedPieceBlack: readonly(takedPieceBlack),
    takedPieceWhite: readonly(takedPieceWhite),
    moves: readonly(moves),
    setPosition,
    setBoardApi,
    updateState
  }
}

export type BoardState = ReturnType<typeof useBoard>
