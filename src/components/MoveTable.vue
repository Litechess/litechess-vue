<script setup lang="ts">
import { NFlex, NTable } from 'naive-ui'
import { computed } from 'vue';

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

</script>

<template>
  <n-flex style="max-width: 100%;">
    <n-table :striped="true" size="large" >
      <tbody>
        <tr v-for="(row) in moveRows" :key="row.moveNumber">
          <td style="width: 1.45em; line-height: 0.9">{{ row.moveNumber }}.</td>
          <td class="rowElement" style="width: 4em">{{ row.white }}</td>
          <td class="rowElement">{{ row.black }}</td>
        </tr>
      </tbody>
    </n-table>
  </n-flex>
</template>

<style scoped>
.rowElement {
  font-weight: bold;
  line-height: 0.9
}
</style>
