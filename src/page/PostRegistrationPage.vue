<script setup lang="ts">
import { ref } from "vue";
import { NFlex, NInput, NForm, NFormItem, NButton } from "naive-ui";
import type { FormInst, FormItemRule, FormRules } from "naive-ui";
import { useApi } from "@/composables/useApi";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

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
      await api.registerUser({ id: authStore.getId()!, nickname: model.value.nickname }).then(() => {
        authStore.loadUser().then(() => {
          router.replace('/user')
        })
      }).catch(() => {
        isDisabledButton.value = false
        formRef.value?.validate()
        isUserDownload.value = true
      });
    }
  });

}
</script>

<template>
  <n-flex justify="center" align=center style="height: calc(100dvh - 2rem)">
      <n-form ref="formRef" :model="model" :rules="rules" style="width: 50%">
        <n-flex vertical justify="center">
          <n-form-item path="nickname" label="Nickname">
            <n-input
              style="width: 100%"
              :disabled="isDisabledButton"
              v-model:value="model.nickname"
              maxlength="20"
              show-count
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-button :disabled="isDisabledButton" type="primary" round @click="submitForm">
            Submit
          </n-button>
        </n-flex>
      </n-form>
  </n-flex>
</template>

