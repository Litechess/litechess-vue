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
  const currentViewPly: Ref<number> = ref(1)
  const materialDiff: Ref<number> = ref(0)
  const gameStatus: Ref<GameStatus> = ref('NOT_FINISHED')

  function setBoardApi(api: BoardApi | null) {
    _boardApi = api
    updateState()
  }
  function updateState() {
    if(_boardApi == null) return
    moves.value = _boardApi.getHistory()
    const pieces: CapturedPieces = _boardApi.getCapturedPieces()
    takedPieceBlack.value = pieces.black
    takedPieceWhite.value = pieces.white
    currentTurn.value = _boardApi!.getTurnColor()

    currentPly.value = _boardApi.getCurrentPlyNumber()

    if(currentPly.value < 10 || openingName.value === 'Start position') {
      _boardApi.getOpeningName().then((name) => {
        if (name != null) openingName.value = name
        else openingName.value = 'Start position'
      })
    }

    stopView()
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

  function viewNext() {
    if(currentViewPly.value == currentPly.value) return
    currentViewPly.value = currentViewPly.value + 1
    _boardApi?.viewNext()
  }

  function stopView() {
    currentViewPly.value = currentPly.value
    _boardApi?.stopViewingHistory()
  }

  function viewPrevious() {
    if(currentViewPly.value == 1) return
    currentViewPly.value = currentViewPly.value - 1
    _boardApi?.viewPrevious()
  }

  function viewPly(ply: number) {
    console.log(ply)
    if(ply <= currentPly.value && ply >= 1) {
      currentViewPly.value = ply
      _boardApi?.viewHistory(ply)
    }
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
    currentViewPly: readonly(currentViewPly),
    stopView,
    viewNext,
    viewPly,
    viewPrevious,
    setPosition,
    setBoardApi,
    updateState
  }
}

export type BoardState = ReturnType<typeof useBoard>
