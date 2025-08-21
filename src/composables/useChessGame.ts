import { useAuthStore } from "@/stores/useAuthStore";
import { useHttpClient } from "@/stores/useHttpClient";
import { useStompSocketStore, type SubscriptionInfo } from "@/stores/useStompSocketStore";
import type { ChessParty, PlayerSide } from "@/types/ChessParty";
import type { GameResult, MoveRequest } from "@/types/MoveRequest";
import type { SocketMessage, SocketMessageType } from "@/types/Socket";
import type { Key } from "chessground/types";
import { readonly, ref, type Ref } from "vue";
import type { BoardApi, MoveEvent, Promotion } from "vue3-chessboard";

type MessageHandler = (message: SocketMessage) => void

// 1. load game
// 2 set board api
export function useChessGame(gameId: number) {

  const _stompStore = useStompSocketStore()
  const _httpClient = useHttpClient()
  const _authStore = useAuthStore()
  let _boardApi: BoardApi
  let _chessParty: ChessParty

  const takedPieceWhite = ref([]);
  const takedPieceBlack = ref([]);
  const moves = ref([])
  const isLoaded = ref(false)
  const playerSide: Ref<PlayerSide> = ref(undefined)

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
    return _stompStore.subscribe(`/game/${gameId}`, (msg) => {
      const message: SocketMessage = JSON.parse(msg.body)
      const messageType: SocketMessageType = message.headers['type'] as SocketMessageType
      handlers[messageType](message)
    })
  }

  function sendMove(move: MoveEvent): void {
  if (_boardApi!.getTurnColor() == playerSide.value) return
  const moveRequest: MoveRequest = {
    from: move.from,
    to: move.to,
    promotion: move.promotion || null,
    san: move.san,
  }

  _updateHistory()
    _stompStore.send(`/game/${gameId}`, JSON.stringify(moveRequest))
  }

  async function loadGame(): Promise<void> {
    _chessParty = await _httpClient.get(`api/v1/games/${gameId}`)
    if(_chessParty.white == _authStore.getId()) playerSide.value = "white"
    else if(_chessParty.black == _authStore.getId()) playerSide.value = "black"
    isLoaded.value = true
  }

  function setBoardApi(api: BoardApi) {
    _boardApi = api
    _boardApi.loadPgn(_chessParty.moveUci.join(" "))
    _updateHistory()
  }

  function _updateHistory() {
    moves.value = _boardApi.getHistory()
    const pieces: CapturedPieces = _boardApi.getCapturedPieces();
    takedPieceBlack.value = pieces.black;
    takedPieceWhite.value = pieces.white;
  }

  return {
    sendMove,
    subscribe,
    loadGame,
    isLoaded: readonly(isLoaded),
    playerSide: readonly(playerSide),
    takedPieceBlack,
    takedPieceWhite,
    moves,
    setBoardApi
  }
}

