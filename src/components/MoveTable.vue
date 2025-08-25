<script setup lang="ts">
import { NFlex, NTable, NText } from 'naive-ui'
import { computed, h, type VNode } from 'vue';
import ImageText from './ImageText.vue';
import PieceText from './PieceText.vue';

interface Props {
  moves: string[]
}

const props = defineProps<Props>();
const moveRows = computed(() => {
  const rows = []
  for (let i = 0; i < props.moves.length; i += 2) {
    rows.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: props.moves[i] || null,
      black: props.moves[i + 1] || null
    })
  }
  return rows
})

function getMoveView(move: string): VNode {
  if(move == null) return h(NText, { depth: 3 })
  const firstLetter = move.charAt(0)
  if(firstLetter == "O" || firstLetter.toUpperCase() != firstLetter) {
    return h(ImageText, { text: move })
  }
  return h(PieceText, { text: move.slice(1), piece: firstLetter.toLowerCase(), size: 12 })
}

</script>

<template>
  <n-flex style="max-width: 100%;">
    <n-table :striped="true" size="large" >
      <tbody>
        <tr v-for="(row) in moveRows" :key="row.moveNumber">
          <td style="width: 1.45em; line-height: 0.9">{{ row.moveNumber }}.</td>
          <td class="rowElement" style="width: 4em">
            <component :is="getMoveView(row.white)" />
          </td>
          <td class="rowElement">
            <component :is="getMoveView(row.black)" />
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-flex>
</template>

<style scoped>
.rowElement {
  font-weight: bold;
  line-height: 0.9;
}
</style>
