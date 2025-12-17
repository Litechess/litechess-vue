<script setup lang="ts">
import type { PieceType, PlayerSide } from '@/types/ChessParty';
import { NIcon } from 'naive-ui';
import { BishopIcon, KingIcon, KnightIcon, PawnIcon, QueenIcon, RookIcon } from '.';
import type { Component } from 'vue';


const props = defineProps<{
  color: PlayerSide
  piece: string
  size?: number
}>();

const pieceMap: Record<PieceType, Component>= {
  p: PawnIcon,
  n: KnightIcon,
  b: BishopIcon,
  r: RookIcon,
  q: QueenIcon,
  k: KingIcon,
};

const styleColor = props.color == "white" ? "#0a0a0a" : "#d9dede"
</script>

<template>
  <n-icon :size="size ? size : 18">
    <component :is="pieceMap[props.piece as PieceType]"/>
  </n-icon>
</template>
