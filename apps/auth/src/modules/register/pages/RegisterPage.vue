<template>
  <div>
    <div class="mb-7">
      <NH1 class="!m-0 !text-[1.6rem] !leading-tight !tracking-tight">
        {{ t('register.title') }}
      </NH1>
      <NText depth="3" tag="p" class="!mt-1.5 !mb-0 text-sm">
        {{ t('register.subtitle') }}
      </NText>
    </div>

    <NAlert v-if="errorCode" type="error" class="!mb-5">
      {{ t(getErrorMessageKey(errorCode)) }}
    </NAlert>

    <NForm ref="formRef" :model="form" :rules="rules" @submit.prevent="handleSubmit">
      <NFormItem path="name" :label="t('register.name')">
        <NInput
          v-model:value="form.name"
          size="large"
          :placeholder="t('register.namePlaceholder')"
          :input-props="{ autocomplete: 'name' }"
        />
      </NFormItem>

      <NFormItem path="email" :label="t('register.email')">
        <NInput
          v-model:value="form.email"
          type="text"
          size="large"
          :placeholder="t('register.emailPlaceholder')"
          :input-props="{ autocomplete: 'email' }"
        />
      </NFormItem>

      <NFormItem path="password" :label="t('register.password')">
        <NInput
          v-model:value="form.password"
          type="password"
          size="large"
          show-password-on="click"
          :placeholder="t('register.passwordPlaceholder')"
          :input-props="{ autocomplete: 'new-password' }"
        />
      </NFormItem>

      <NButton
        type="primary"
        attr-type="submit"
        block
        size="large"
        :loading="loading"
        class="!mt-2"
      >
        {{ t('register.submit') }}
      </NButton>
    </NForm>

    <NDivider class="!my-3">
      <NText depth="3" class="text-xs">or</NText>
    </NDivider>

    <NText depth="3" tag="p" class="!m-0 text-center text-sm">
      {{ t('register.hasAccount') }}
      <RouterLink
        to="/login"
        class="ml-1 font-semibold text-primary-500 visited:text-primary-500 hover:text-primary-400 active:text-primary-600 no-underline"
      >
        {{ t('register.login') }}
      </RouterLink>
    </NText>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import {
    NH1,
    NText,
    NDivider,
    NForm,
    NFormItem,
    NInput,
    NButton,
    NAlert,
    type FormInst,
    type FormRules,
  } from 'naive-ui'
  import { getErrorMessageKey } from '@haily/utils'
  import { useRegister } from '../composables/useRegister'

  const { t } = useI18n()
  const formRef = ref<FormInst | null>(null)
  const { form, loading, errorCode, register } = useRegister()

  const rules = computed<FormRules>(() => ({
    name: [
      { required: true, message: t('register.validation.nameRequired'), trigger: 'blur' },
      { min: 2, message: t('register.validation.nameMin'), trigger: 'blur' },
    ],
    email: [{ required: true, message: t('register.validation.emailRequired'), trigger: 'blur' }],
    password: [
      { required: true, message: t('register.validation.passwordRequired'), trigger: 'blur' },
      { min: 8, message: t('register.validation.passwordMin'), trigger: 'input' },
    ],
  }))

  async function handleSubmit() {
    try {
      await formRef.value?.validate()
      register()
    } catch {}
  }
</script>
