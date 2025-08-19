<script setup lang="ts">
import type { PlayerColor } from '@/types/ChessParty';
import { NIcon } from 'naive-ui';
import { BishopIcon, KingIcon, KnightIcon, PawnIcon, QueenIcon, RookIcon } from '.';

const props = defineProps<{
  color: PlayerColor
  piece: string
}>();

const pieceMap = {
  p: PawnIcon,
  n: KnightIcon,
  b: BishopIcon,
  r: RookIcon,
  q: QueenIcon,
  k: KingIcon,
};

const styleColor = props.color == "w" ? "#0a0a0a" : "#d9dede"
</script>

<template>
  <n-icon size="18" :color="styleColor">
    <component :is="pieceMap[props.piece]"/>
  </n-icon>
</template>
