<script setup lang="ts">
import { ref } from "vue";
import { NFlex, NInput, NForm, NFormItem, NButton } from "naive-ui";
import type { FormInst, FormItemRule, FormRules } from "naive-ui";
import { useApi } from "@/composables/useApi";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import AvatarUpload from "@/components/AvatarUpload.vue";

const formRef = ref<FormInst | null>(null);

const model = ref({
  nickname: ""
});

const api = useApi();
const authStore = useAuthStore()
const router = useRouter();

const nicknameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9]+$/;
const isUserDownload = ref(true);

const rules: FormRules = {
  nickname: [
    {
      required: true,
      message: "Имя пользователя обязательно",
      trigger: ["input", "blur"]
    },
    {
      validator(rule: FormItemRule, value: string) {
        if (!nicknameRegex.test(value)) {
          return new Error(
            "Разрешены только буквы и цифры. Без пробелов и специальных символов."
          );
        }
        if (value.length > 20) {
          return new Error("Максимальная длина — 20 символов");
        }

        if(isUserDownload.value == false) {
          return new Error("Пользователь с таким никнеймом уже существует");
        }

        return true;
      },
      trigger: ["input", "blur"]
    }
  ]
};

const isDisabledButton = ref(false)

async function submitForm() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      isDisabledButton.value = true
      isUserDownload.value = false

      try {
        const userId = authStore.getId()!

        await api.registerUser({
          id: userId,
          nickname: model.value.nickname
        })

        if (avatarFile.value) {
          await api.uploadUserAvatar(userId, avatarFile.value)
        }

        await authStore.loadUser()
        router.replace('/user')
      } catch (e) {
        isDisabledButton.value = false
        formRef.value?.validate()
        isUserDownload.value = true
      }
    }
  })
}

const avatarFile = ref<File | null>(null)
</script>

<template>
  <div class="page">
    <div class="card">
      <AvatarUpload v-model="avatarFile" />

      <n-form ref="formRef" :model="model" :rules="rules" class="form">
        <n-form-item path="nickname">
          <template #label>
            <div class="nickname-label">
              <span>Имя пользователя</span>
              <span class="nickname-label__hint">Это имя будут видеть другие пользователи</span>
            </div>
          </template>
          <n-input
            v-model:value="model.nickname"
            :disabled="isDisabledButton"
            maxlength="20"
            show-count
            placeholder=" "
            @keydown.enter.prevent
          />
        </n-form-item>

        <n-button
          block
          type="primary"
          :disabled="isDisabledButton"
          @click="submitForm"
        >
          Зарегистрироваться
        </n-button>
      </n-form>
    </div>
  </div>
</template>

<style scoped>
.page {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* НЕ задаём фон — пусть берётся из темы */
}

.card {
  width: 340px;
  padding: 20px;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;

  /* используем токены Naive UI */
  background-color: var(--n-color);
  box-shadow: var(--n-box-shadow);
  border: 1px solid var(--n-border-color);
}

/* аватар растягивается на всю ширину карточки */
.card :deep(.avatar-upload) {
  width: 100%;
  aspect-ratio: 1 / 1; /* делает квадрат по ширине */
  height: auto;
}

/* форма под ним */
.form {
  width: 100%;
}

.nickname-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.2;
  font-size: 15px;
  font-weight: 600;
}

.nickname-label__hint {
  font-size: 12px;
  color: rgba(128, 128, 128, 0.9);
  font-weight: 400;
}

.form :deep(.n-form-item) {
  margin-bottom: 10px;
}

.card :deep(.n-upload) {
  width: 100%;
  display: block;
}

.card :deep(.n-upload-trigger) {
  width: 100%;
  display: block;
}


</style>
