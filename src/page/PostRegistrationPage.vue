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

const nicknameRegex = /^[a-zA-Z0-9]+$/;
const isUserDownload = ref(true);

const rules: FormRules = {
  nickname: [
    {
      required: true,
      message: "Nickname is required",
      trigger: ["input", "blur"]
    },
    {
      validator(rule: FormItemRule, value: string) {
        if (!nicknameRegex.test(value)) {
          return new Error(
            "Only letters, numbers are allowed. No spaces or special symbols."
          );
        }
        if (value.length > 20) {
          return new Error("Maximum length is 20 characters");
        }

        if(isUserDownload.value == false) {
          return new Error("User with this nickname already exists");
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
        <n-form-item path="nickname" label="Nickname">
          <n-input
            v-model:value="model.nickname"
            :disabled="isDisabledButton"
            maxlength="20"
            show-count
            @keydown.enter.prevent
          />
        </n-form-item>

        <n-button
          block
          type="primary"
          :disabled="isDisabledButton"
          @click="submitForm"
        >
          Submit
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

.card :deep(.n-upload) {
  width: 100%;
  display: block;
}

.card :deep(.n-upload-trigger) {
  width: 100%;
  display: block;
}


</style>