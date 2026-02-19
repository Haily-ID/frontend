/**
 * Haily global Naive UI theme override.
 * Primary brand colour: #51a2ff
 *
 * How Naive UI theming works:
 *  - Pass a `themeOverrides` object to <NConfigProvider :theme-overrides="themeOverrides">
 *  - Keys mirror the component token names documented at https://www.naiveui.com/en-US/os-theme/docs/customize-theme
 *  - `common` tokens cascade to ALL components; per-component keys override specific ones.
 *  - No CSS variables or custom classes needed — the design-token approach keeps everything
 *    within Naive UI's rendering pipeline.
 */
import type { GlobalThemeOverrides } from 'naive-ui'

const PRIMARY = '#51a2ff'
const PRIMARY_HOVER = '#74b6ff'
const PRIMARY_PRESSED = '#3a8fe8'
const PRIMARY_SUPPL = '#dbeafe' // light fill / supplementary tint

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: PRIMARY,
    primaryColorHover: PRIMARY_HOVER,
    primaryColorPressed: PRIMARY_PRESSED,
    primaryColorSuppl: PRIMARY_SUPPL,
  },
  Input: {
    borderFocus: `1px solid ${PRIMARY}`,
    boxShadowFocus: `0 0 0 2px rgba(81, 162, 255, 0.2)`,
  },
  Form: {
    feedbackFontSizeSmall: '12px',
    feedbackFontSizeMedium: '12px',
    feedbackFontSizeLarge: '12px',
  },
}
