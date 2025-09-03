import { useAuthStore } from '@/stores/useAuthStore'
import { useStompSocketStore, type SubscriptionInfo } from '@/stores/useStompSocketStore'
import type { ChessParty, GameStatus, PlayerSide } from '@/types/ChessParty'
import type { GameResult, MoveRequest } from '@/types/MoveRequest'
import type { SocketMessage, SocketMessageType } from '@/types/Socket'
import type { Key } from 'chessground/types'
import { readonly, ref, shallowReactive, type Ref } from 'vue'
import { BoardApi, type CapturedPieces, type MoveEvent, type Promotion } from 'vue3-chessboard'

type MessageHandler = (message: SocketMessage) => void

// 1. load game
// 2 set board api
export function useChessGame() {
  const _stompStore = useStompSocketStore()
  const _authStore = useAuthStore()
  let _boardApi: BoardApi | null
  let _chessParty: ChessParty | null
  let _currentSubscription: SubscriptionInfo | null = null

  const gameId = ref(0)
  const takedPieceWhite: Ref<string[]> = ref([])
  const takedPieceBlack: Ref<string[]> = ref([])
  const moves: Ref<string[]> = ref([])
  const openingName = ref("Start position")
  const playerSide: Ref<PlayerSide> = ref(undefined)
  const currentTurn: Ref<PlayerSide> = ref('white')
  const currentPly: Ref<number> = ref(1)
  const materialDiff: Ref<number> = ref(0)
  const gameStatus: Ref<GameStatus> = ref("NOT_FINISHED")

  const handlers: Record<SocketMessageType, MessageHandler> = {
    move: (message) => {
      const move: MoveRequest = message.payload as MoveRequest
      if (_boardApi!.getLastMove() != undefined && _boardApi!.getLastMove()!.san == move.san) {
        return
      }

      _boardApi!.move({
        from: move.from as Key,
        to: move.to as Key,
        promotion: move.promotion as Promotion,
      })

      _updateHistory()
    },

    gameFinish: (message) => {
      const resultMessage: GameResult = message.payload as GameResult
      console.log(resultMessage.status)
    },
  }

  function subscribe(): void {
    if(_currentSubscription != null) {
      _currentSubscription.unsubscribe()
    }

    _currentSubscription = _stompStore.subscribe(`/game/${gameId.value}`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      const messageType: SocketMessageType = message.headers['type'] as SocketMessageType
      handlers[messageType](message)
    })
  }

  function moveHandler(move: MoveEvent): void {
    _updateHistory()
    if (!_chessParty || _boardApi!.getTurnColor() == playerSide.value) return
    const moveRequest: MoveRequest = {
      from: move.from,
      to: move.to,
      promotion: move.promotion || null,
      san: move.san,
    }

    _stompStore.send(`/game/${gameId.value}`, JSON.stringify(moveRequest))
  }

  function setChessParty(chessParty: ChessParty | null) {
    _currentSubscription?.unsubscribe()
    if(chessParty == null) {
      _resetData()
      _chessParty = null
      return
    }
    if (chessParty.white.id == _authStore.getId()) playerSide.value = 'white'
    else if (chessParty.black.id == _authStore.getId()) playerSide.value = 'black'
    gameId.value = chessParty.id
    gameStatus.value = chessParty.status
    _chessParty = chessParty
    if (_boardApi) {
      setPositionWhenSet()
    }
  }

  function setBoardApi(api: BoardApi | null) {
    _boardApi = api
    if (_chessParty) {
      setPositionWhenSet()
    }
  }

  function setPositionWhenSet() {
    if(_boardApi == null || _chessParty == null) {
      return
    }
    _boardApi.loadPgn(_chessParty.moveUci.join(' '))
    _updateHistory()
  }

  function _updateHistory() {
    if(_boardApi == null) {
      return
    }

    moves.value = _boardApi.getHistory()
    const pieces: CapturedPieces = _boardApi.getCapturedPieces()
    takedPieceBlack.value = pieces.black
    takedPieceWhite.value = pieces.white
    currentTurn.value = _boardApi!.getTurnColor()
    _boardApi.getOpeningName().then((name) => {
      if (name != null) openingName.value = name
      else openingName.value = "Start position"
    })
    currentPly.value = _boardApi.getCurrentPlyNumber()
    materialDiff.value = _boardApi.getMaterialCount().materialDiff
    gameStatus.value = _getGameStatus(_boardApi)
  }

  function _getGameStatus(boardApi: BoardApi): GameStatus {
    if(boardApi.getIsGameOver() == false) return "NOT_FINISHED";
    if(boardApi.getIsDraw()) return "DRAW";
    if(boardApi.getTurnColor() == "white") return "WIN_BLACK";
    return "WIN_WHITE";
  }

  function _resetData() {
    openingName.value = "Start position"
    currentTurn.value = "white"
    currentPly.value = 1
    materialDiff.value = 0
    playerSide.value = undefined
    gameId.value = 0
  }

  return shallowReactive({
    openingName: readonly(openingName),
    currentTurn: readonly(currentTurn),
    currentPly: readonly(currentPly),
    materialDiff: readonly(materialDiff),
    playerSide: readonly(playerSide),
    gameId: readonly(gameId),
    gameStatus: readonly(gameStatus),
    moveHandler,
    subscribe,
    setBoardApi,
    takedPieceBlack,
    takedPieceWhite,
    moves,
    setChessParty,
  })
}
