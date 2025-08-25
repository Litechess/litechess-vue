<script setup lang="ts">
import { h,  type VNode } from 'vue';
import ImageText from './ImageText.vue';
import { PieceIcon } from './icon';


const props = defineProps<{
  text: string
  piece: string
  size?: number
}>();

const piece: VNode = h(PieceIcon, {
  color: "white",
  piece: props.piece,
  size: props.size
})

</script>

<template>
  <image-text :icon="piece" :text="props.text"></image-text>
</template>
