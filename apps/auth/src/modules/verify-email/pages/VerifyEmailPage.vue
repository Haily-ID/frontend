<template>
  <div>
    <!-- heading (centered) -->
    <div class="flex flex-col items-center text-center mb-7">
      <NH1 class="!m-0 !text-[1.6rem] !leading-tight !tracking-tight">
        {{ t('verifyEmail.title') }}
      </NH1>
      <NText depth="3" tag="p" class="!mt-1.5 !mb-0 text-sm">
        {{ t('verifyEmail.subtitle') }}
        <NText v-if="email" class="font-semibold">{{ email }}</NText>
      </NText>
    </div>

    <NForm ref="formRef" :model="form" :rules="rules" @submit.prevent="handleSubmit">
      <NFormItem path="otp" :show-label="false" :feedback-style="{ textAlign: 'center' }">
        <div class="flex justify-center w-full">
          <NInputOtp v-model:value="form.otp" :length="6" size="large" @finish="handleSubmit" />
        </div>
      </NFormItem>

      <NButton
        type="primary"
        attr-type="submit"
        block
        size="large"
        :loading="loading"
        class="!mt-2"
      >
        {{ t('verifyEmail.submit') }}
      </NButton>
    </NForm>

    <!-- resend block -->
    <div class="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-center">
      <NText depth="3" tag="p" class="!mb-2 !mt-0 text-xs">
        {{ t('verifyEmail.didntReceive') }}
      </NText>
      <NButton
        text
        :disabled="resendCooldown > 0"
        :loading="resendLoading"
        class="text-sm"
        @click="handleResend"
      >
        <NText v-if="resendCooldown > 0" depth="3">
          {{ t('verifyEmail.resendCooldown', { seconds: resendCooldown }) }}
        </NText>
        <NText v-else class="font-semibold text-primary-500">
          {{ t('verifyEmail.resend') }}
        </NText>
      </NButton>
    </div>

    <NText depth="3" tag="p" class="!mt-4 !mb-0 text-center text-xs">
      {{ t('verifyEmail.wrongEmail') }}
      <RouterLink
        to="/register"
        class="ml-1 font-semibold text-primary-500 visited:text-primary-500 hover:text-primary-400 active:text-primary-600 no-underline"
      >
        {{ t('verifyEmail.backToRegister') }}
      </RouterLink>
    </NText>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRoute, RouterLink } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import {
    NH1,
    NText,
    NForm,
    NFormItem,
    NInputOtp,
    NButton,
    useMessage,
    type FormInst,
    type FormRules,
  } from 'naive-ui'
  import { getErrorMessageKey } from '@haily/utils'
  import { useVerifyEmail } from '../composables/useVerifyEmail'

  const { t } = useI18n()
  const route = useRoute()
  const message = useMessage()
  const formRef = ref<FormInst | null>(null)

  const email = computed(() => route.query.email as string | undefined)

  const {
    form,
    loading,
    errorCode,
    resendCooldown,
    resendLoading,
    resendSuccess,
    verify,
    resendOTP,
  } = useVerifyEmail()

  watch(errorCode, (code) => {
    if (code) message.error(t(getErrorMessageKey(code)))
  })

  watch(resendSuccess, (val) => {
    if (val) message.success(t('verifyEmail.resendSuccess'))
  })

  const rules = computed<FormRules>(() => ({
    otp: [
      {
        validator: (_rule, value: string[]) => {
          const joined = Array.isArray(value) ? value.join('') : value
          if (!joined || joined.length === 0)
            return new Error(t('verifyEmail.validation.otpRequired'))
          if (joined.length < 6) return new Error(t('verifyEmail.validation.otpLength'))
          return true
        },
        trigger: ['change', 'submit'],
      },
    ],
  }))

  async function handleSubmit() {
    try {
      await formRef.value?.validate()
      verify()
    } catch {}
  }

  function handleResend() {
    resendOTP()
  }
</script>
