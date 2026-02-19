<template>
  <div>
    <div class="mb-7">
      <NH1 class="!m-0 !text-[1.6rem] !leading-tight !tracking-tight">
        {{ t('login.title') }}
      </NH1>
      <NText depth="3" tag="p" class="!mt-1.5 !mb-0 text-sm">
        {{ t('login.subtitle') }}
      </NText>
    </div>

    <NAlert v-if="errorCode" type="error" :bordered="false" class="!mb-5">
      {{ t(getErrorMessageKey(errorCode)) }}
    </NAlert>

    <NForm ref="formRef" :model="form" :rules="rules" @submit.prevent="handleSubmit">
      <NFormItem path="email" :label="t('login.email')">
        <NInput
          v-model:value="form.email"
          type="text"
          size="large"
          :placeholder="t('login.emailPlaceholder')"
          :input-props="{ autocomplete: 'email' }"
        />
      </NFormItem>

      <NFormItem path="password" :label="t('login.password')">
        <NInput
          v-model:value="form.password"
          type="password"
          size="large"
          show-password-on="click"
          :placeholder="t('login.passwordPlaceholder')"
          :input-props="{ autocomplete: 'current-password' }"
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
        {{ t('login.submit') }}
      </NButton>
    </NForm>

    <NDivider class="!my-3">
      <NText depth="3" class="text-xs">or</NText>
    </NDivider>

    <NText depth="3" tag="p" class="!m-0 text-center text-sm">
      {{ t('login.noAccount') }}
      <RouterLink
        to="/register"
        class="ml-1 font-semibold text-primary-500 visited:text-primary-500 hover:text-primary-400 active:text-primary-600 no-underline"
      >
        {{ t('login.register') }}
      </RouterLink>
    </NText>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, RouterLink } from 'vue-router'
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
  import { useLogin } from '../composables/useLogin'

  const { t } = useI18n()
  const route = useRoute()

  const formRef = ref<FormInst | null>(null)
  const { form, loading, errorCode, login } = useLogin()

  const rules = computed<FormRules>(() => ({
    email: [{ required: true, message: t('login.validation.emailRequired'), trigger: 'blur' }],
    password: [
      { required: true, message: t('login.validation.passwordRequired'), trigger: 'blur' },
    ],
  }))

  async function handleSubmit() {
    try {
      await formRef.value?.validate()
      const redirect = route.query.redirect as string | undefined
      login(redirect)
    } catch {}
  }
</script>
