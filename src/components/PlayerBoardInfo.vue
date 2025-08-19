<script setup lang="ts">
import { NFlex, NAvatar, NText } from 'naive-ui'
import type { PlayerColor } from '@/types/ChessParty'
import PieceIcon from './icon/PieceIcon.vue'

interface Props {
  name: string
  avatar: string
  pieces: string[]
  color: PlayerColor
}

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
        <span v-for="(piece, index) in props.pieces" :key="index">
          <piece-icon :color="props.color" :piece="piece"/>
        </span>
      </n-text>
    </n-flex>
  </n-flex>
</template>

<style scoped>

</style>
