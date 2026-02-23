<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import type { UploadFileInfo } from 'naive-ui'
import { NUpload } from 'naive-ui'

interface Props {
  modelValue?: File | null
  previewUrl?: string | null 
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void
}>()

const fileRef = ref<File | null>(props.modelValue ?? null)
const localPreview = ref<string | null>(props.previewUrl ?? null)

// освобождаем blob URL чтобы не текла память
function revokePreview() {
  if (localPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(localPreview.value)
  }
}

function handleChange(options: { file: UploadFileInfo }) {
  const rawFile = options.file.file

  if (!rawFile) return

  revokePreview()

  fileRef.value = rawFile
  localPreview.value = URL.createObjectURL(rawFile)

  emit('update:modelValue', rawFile)
}

watch(
  () => props.modelValue,
  (file) => {
    if (!file) return

    revokePreview()
    fileRef.value = file
    localPreview.value = URL.createObjectURL(file)
  }
)

onBeforeUnmount(() => revokePreview())
</script>

<template>
  <n-upload
    accept="image/*"
    :show-file-list="false"
    :default-upload="false"
    @change="handleChange"
  >
    <div class="avatar-upload">
      <template v-if="localPreview">
        <img :src="localPreview" class="avatar-image" />
      </template>

      <template v-else>
        <div class="avatar-placeholder">
          Click to upload avatar
        </div>
      </template>
    </div>
  </n-upload>
</template>

<style scoped>
.avatar-upload {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 2px solid #d9d9d9; /* обычная линия */
  cursor: pointer;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.2s;
}

.avatar-upload:hover {
  border-color: #409eff;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 12px;
  color: #999;
  text-align: center;
  padding: 8px;
}
</style>