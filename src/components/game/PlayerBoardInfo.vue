<script setup lang="ts">
import { NFlex, NAvatar, NText } from 'naive-ui'
import type { PlayerSide } from '@/types/ChessParty'
import PieceIcon from './icon/PieceIcon.vue'
import { computed } from 'vue'

interface Props {
  name: string
  avatar: string
  pieces: readonly string[]
  materialDiff: number
  color: PlayerSide
}

const props = defineProps<Props>();
const sideMaterialCount = computed( () => {
  return props.color == "white" ? props.materialDiff : -props.materialDiff
})


</script>

<template>
  <n-flex>
    <n-avatar :src='props.avatar' :size="40"/>
    <n-flex vertical :size="0" justify="center" align="start">
      <n-text :strong="true" :depth="1" style="font-size: 1.1em">
       {{ props.name }}
      </n-text>
      <n-flex :size="5" justify="center" style="height: 1.5em">
        <n-flex :size="0">
          <span inline v-for="(piece, index) in props.pieces" :key="index">
            <piece-icon :color="props.color" :piece="piece"/>
          </span>
        </n-flex>
        <span v-if="sideMaterialCount > 0"> +{{ sideMaterialCount }}</span>
      </n-flex>
    </n-flex>
  </n-flex>
</template>

<style scoped>

</style>
