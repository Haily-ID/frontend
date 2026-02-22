import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CompanyMemberDTO } from '@haily/types'
import { companyService } from '../modules/company/services/company.service'

export const useCompanyStore = defineStore('haily-company', () => {
  /**
   * null  = not yet fetched
   * []    = fetched, user has no companies
   * [...] = fetched, user belongs to these companies
   */
  const memberships = ref<CompanyMemberDTO[] | null>(null)
  const loading = ref(false)

  /** True once the API call has resolved (success or error). */
  const isLoaded = computed(() => memberships.value !== null)

  /** True if the user belongs to at least one company. */
  const hasCompany = computed(
    () => memberships.value !== null && memberships.value.length > 0,
  )

  /**
   * Fetch the user's company memberships.
   * Idempotent — skips the request if already loaded.
   * On API error we treat memberships as unknown (null stays)
   * so we never wrongly block access due to a network blip.
   */
  async function fetchMyCompanies() {
    if (memberships.value !== null) return
    loading.value = true
    try {
      memberships.value = await companyService.getMyCompanies()
    } catch {
      // Leave memberships as null — router guard will not redirect on unknown state.
    } finally {
      loading.value = false
    }
  }

  return { memberships, loading, isLoaded, hasCompany, fetchMyCompanies }
})
