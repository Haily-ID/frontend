import api from '@haily/api'
import type { CompanyMemberDTO } from '@haily/types'

export const companyService = {
  /** Returns the list of companies the authenticated user belongs to. */
  getMyCompanies(): Promise<CompanyMemberDTO[]> {
    return api.get('/companies/my')
  },
}
