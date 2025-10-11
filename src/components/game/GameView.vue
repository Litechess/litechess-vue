<script setup lang="ts">
import ChessBoard from '../ChessBoard.vue';
import { type ChessParty, type PlayerSide } from '@/types/ChessParty';
import { computed, reactive, ref, watch } from 'vue';
import { type BoardConfig } from 'vue3-chessboard';

const DUMMY_ID = '0'
const DUMMY_WHITE_ID = 'w1'
const DUMMY_BLACK_ID = 'b1'
const INIT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const DEFAULT_STATUS = 'NOT_FINISHED'

const props = defineProps<{
  chessParty?: ChessParty
  playerId?: string
  viewOnly?: boolean
}>();

const chessParty = computed(() => props.chessParty ?? {
  id: DUMMY_ID,
  white: { id: DUMMY_WHITE_ID, name: 'White' },
  black: { id: DUMMY_BLACK_ID, name: 'Black' },
  moves: [],
  timerHistory: [],
  timeControl: null,
  initFen: INIT_FEN,
  status: DEFAULT_STATUS
})

const boardKey = ref(DUMMY_ID)
const playerSide = computed<PlayerSide | undefined>(() => {
  if(chessParty.value.white.id === props.playerId) {
    return 'white'
  }

  else if(chessParty.value.black.id === props.playerId) {
    return 'black'
  }

  return undefined
})

const orientation = computed<PlayerSide>(() => { return playerSide.value ?? 'white' })
const isViewOnly = computed(() => {
  if(props.playerId === undefined && props.viewOnly !== true) return false;
  return playerSide.value === undefined || chessParty.value.status != "NOT_FINISHED" || (props.viewOnly ?? false)
})

const boardConfig = reactive<BoardConfig>({
  get orientation() {
    return orientation.value
  },

  get viewOnly() {
    return isViewOnly.value
  }
})

watch(chessParty, (oldParty, newParty) => {
  const newId = newParty ? newParty.id : oldParty.id
  if(oldParty.id !== newId) {
    boardKey.value = newId
  }
}, { immediate: true })
</script>

<template>
  <chess-board
    :player-color="playerSide"
    :board-config="boardConfig"
    :key="boardKey" />
</template>
