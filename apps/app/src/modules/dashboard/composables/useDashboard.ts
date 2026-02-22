export interface HailyApp {
  key: string
  /** Iconify icon identifier, e.g. 'fluent:money-24-regular' */
  icon: string
  url: string
  color: string
}

export function useDashboard() {
  const apps: HailyApp[] = [
    {
      key: 'finance',
      icon: 'fluent:money-24-regular',
      url: import.meta.env.VITE_FINANCE_APP_URL ?? '#',
      color: '#10b981',
    },
    {
      key: 'erp',
      icon: 'fluent:building-24-regular',
      url: import.meta.env.VITE_ERP_APP_URL ?? '#',
      color: '#6366f1',
    },
    {
      key: 'hr',
      icon: 'fluent:people-24-regular',
      url: import.meta.env.VITE_HR_APP_URL ?? '#',
      color: '#f59e0b',
    },
    {
      key: 'inventory',
      icon: 'fluent:box-24-regular',
      url: import.meta.env.VITE_INVENTORY_APP_URL ?? '#',
      color: '#ef4444',
    },
  ]

  function openApp(url: string) {
    window.location.href = url
  }

  return { apps, openApp }
}
