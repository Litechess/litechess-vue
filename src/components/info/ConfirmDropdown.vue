<script setup lang="ts">
import { NButton } from 'naive-ui';

const props = defineProps<{
  title: string
  onAccept?: () => void
  onDecline?: () => void
}>();
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
    "
  >
    <div
      style="
        margin-bottom: 10px;
        text-align: center;
        font-size: 14px;
      "
    >
      {{ title }}
    </div>

    <div style="display: flex; gap: 8px;">
      <n-button type="primary" size="small" @click="props.onAccept?.()">Yes</n-button>
      <n-button type="error" size="small" @click="props.onDecline?.()">No</n-button>
    </div>
  </div>
</template>
