<script setup lang="ts">
import { NFlex, NAvatar, NText } from 'naive-ui'
import { PawnIcon, KnightIcon, BishopIcon, RookIcon, KingIcon, QueenIcon } from './icon'
import type { PlayerColor } from '@/types/ChessParty'
interface Props {
  name: string
  avatar: string
  pieces: string[]
  color: PlayerColor
}

const pieceMap = {
  p: PawnIcon,
  n: KnightIcon,
  b: BishopIcon,
  r: RookIcon,
  q: QueenIcon,
  k: KingIcon,
};

const props = defineProps<Props>();
</script>

<template>
  <n-flex>
    <n-avatar :src='props.avatar' :size="40"/>
    <n-flex vertical :size="0">
      <n-text :strong="true" :depth="1" style="font-size: 1.1em">
       {{ props.name }}
      </n-text>
      <n-text style="height: 1.2em">
        <component v-for="(piece, index) in props.pieces" :key="index" :is="pieceMap[piece]" :color="props.color"/>
      </n-text>
    </n-flex>
  </n-flex>
</template>

<style scoped>

</style>
