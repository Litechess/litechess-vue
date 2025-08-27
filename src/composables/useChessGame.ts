import { useAuthStore } from "@/stores/useAuthStore";
import { useStompSocketStore, type SubscriptionInfo } from "@/stores/useStompSocketStore";
import type { ChessParty, PlayerSide } from "@/types/ChessParty";
import type { GameResult, MoveRequest } from "@/types/MoveRequest";
import type { SocketMessage, SocketMessageType } from "@/types/Socket";
import type { Key } from "chessground/types";
import { readonly, ref, shallowReactive, type Ref } from "vue";
import { BoardApi, type CapturedPieces, type MoveEvent, type Promotion } from "vue3-chessboard";

type MessageHandler = (message: SocketMessage) => void

// 1. load game
// 2 set board api
export function useChessGame() {

  const _stompStore = useStompSocketStore()
  const _authStore = useAuthStore()
  let _boardApi: BoardApi
  let _chessParty: ChessParty

  const gameId = ref(0)
  const takedPieceWhite: Ref<string[]> = ref([]);
  const takedPieceBlack: Ref<string[]> = ref([]);
  const moves: Ref<string[]> = ref([])
  const openingName = ref('ㅤ')
  const playerSide: Ref<PlayerSide> = ref("white")
  const currentTurn: Ref<PlayerSide> = ref("white")
  const currentPly: Ref<number> = ref(1)

  const handlers: Record<SocketMessageType, MessageHandler> = {
    "move": (message) => {
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

    "gameFinish": (message) => {
      const resultMessage: GameResult = message.payload as GameResult
      console.log(resultMessage.status)
    }

  }

  function subscribe(): SubscriptionInfo | null {
    return _stompStore.subscribe(`/game/${gameId.value}`, (msg) => {
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

  function setChessParty(chessParty: ChessParty) {
    if(chessParty.white == _authStore.getId()) playerSide.value = "white"
    else if(chessParty.black == _authStore.getId()) playerSide.value = "black"
    gameId.value = chessParty.id
    _chessParty = chessParty
    if(_boardApi) {
      setPositionWhenSet()
    }
  }

  function setBoardApi(api: BoardApi) {
    _boardApi = api
    if(_chessParty) {
      setPositionWhenSet()
    }
  }

  function setPositionWhenSet() {
    _boardApi.loadPgn(_chessParty.moveUci.join(" "))
    _updateHistory()
  }

  const viewNext = () => {
    _boardApi.viewNext()
  }

  const viewPrevious = () => {
    _boardApi.viewPrevious()
  }

  const stopView = () => {
    _boardApi.stopViewingHistory()
  }

  function _updateHistory() {
    moves.value = _boardApi.getHistory()
    const pieces: CapturedPieces = _boardApi.getCapturedPieces();
    takedPieceBlack.value = pieces.black;
    takedPieceWhite.value = pieces.white;
    currentTurn.value = _boardApi!.getTurnColor()
    _boardApi.getOpeningName().then((name) => {
      if (openingName.value != name) openingName.value = name!
    })
    currentPly.value = _boardApi.getCurrentPlyNumber()
  }

  return shallowReactive({
    openingName: readonly(openingName),
    currentTurn: readonly(currentTurn),
    currentPly: readonly(currentPly),
    moveHandler,
    subscribe,
    setBoardApi,
    playerSide: readonly(playerSide),
    gameId: readonly(gameId),
    takedPieceBlack,
    takedPieceWhite,
    moves,
    setChessParty,
    viewNext,
    viewPrevious,
    stopView,
  })
}

