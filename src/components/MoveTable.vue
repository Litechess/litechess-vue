<script setup lang="ts">
import { NFlex, NTable, NText } from 'naive-ui'
import { computed, h, ref, type VNode } from 'vue'
import ImageText from './ImageText.vue'
import PieceText from './PieceText.vue'

interface Props {
  moves: string[]
  selectMovePly: number
}

const props = defineProps<Props>()
const emit = defineEmits<{(e: 'moveClick', ply: number): void}>()
const moveRows = computed(() => {
  const rows = []
  for (let i = 0; i < props.moves.length; i += 2) {
    rows.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: props.moves[i] || null,
      whiteIndex: i,
      black: props.moves[i + 1] || null,
      blackIndex: i + 1
    })
  }
  return rows
})

function onMoveClick(moveIndex: number) {
  emit('moveClick', moveIndex + 1)
}

function getMoveView(move: string): VNode {
  if (move == null) return h(NText, { depth: 3 })
  const firstLetter = move.charAt(0)
  if (firstLetter == 'O' || firstLetter.toUpperCase() != firstLetter) {
    return h(ImageText, { text: move })
  }
  return h(PieceText, { text: move.slice(1), piece: firstLetter.toLowerCase(), size: 12 })
}
</script>

<template>
  <n-flex>
    <n-table :striped="true" size="large">
      <tbody>
        <tr v-for="row in moveRows" :key="row.moveNumber">
          <td style="width: 1.45em; line-height: 0.9">{{ row.moveNumber }}.</td>
          <td class="rowElement" style="width: 4em">
            <n-flex
              :class="{ highlighted: row.whiteIndex == props.selectMovePly - 1 }"
              :size="2"
              style="padding: 2px 5px 2px 5px; cursor: pointer"
              @click="onMoveClick(row.whiteIndex)"
              inline
            >
              <component :is="getMoveView(row.white)" />
            </n-flex>
          </td>
          <td class="rowElement">
            <n-flex
              :size="2"
              inline
              style="padding: 2px 5px 2px 5px; cursor: pointer"
              @click="onMoveClick(row.blackIndex)"
              :class="{ highlighted: row.blackIndex == props.selectMovePly - 1 }"
            >
              <component :is="getMoveView(row.black)" />
            </n-flex>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-flex>
</template>

<style scoped>
.rowElement {
  font-weight: bold;
  line-height: 0.9em;
}

.highlighted {
  background: linear-gradient(
    to bottom,
    rgba(74, 75, 74, 0.05) 10%,
    /* Легкий зеленый фон */ rgba(187, 204, 187, 0.479) 40%,
    #24a062 90%,
    #24a062 100%,
    /* Сохраняем прозрачность */ transparent 100% /* Прозрачный низ */
  ) !important;
}
</style>
