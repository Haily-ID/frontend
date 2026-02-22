export interface HailyApp {
  key: string
  /** Iconify icon identifier, e.g. 'fluent-color:money-24' */
  icon: string
  url: string
}

export function useDashboard() {
  const apps: HailyApp[] = [
    {
      key: 'finance',
      icon: 'fluent-color:money-24',
      url: import.meta.env.VITE_FINANCE_APP_URL ?? '#',
    },
    {
      key: 'erp',
      icon: 'fluent-color:building-24',
      url: import.meta.env.VITE_ERP_APP_URL ?? '#',
    },
    {
      key: 'hr',
      icon: 'fluent-color:people-24',
      url: import.meta.env.VITE_HR_APP_URL ?? '#',
    },
    {
      key: 'inventory',
      icon: 'fluent-color:box-24',
      url: import.meta.env.VITE_INVENTORY_APP_URL ?? '#',
    },
  ]

  function openApp(url: string) {
    window.location.href = url
  }

  return { apps, openApp }
}
