export type HUDVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'premium'

export const HUDTheme = {
  colors: {
    textPrimary: '#65382b',
    textSecondary: '#8c7352',
    textOnColor: '#ffffff',
    panelFill: 0xfff6e8,
    panelStroke: 0xffffff,
    shadow: 0x7a3e2c,
    track: 0xeadcc9,
    trackStroke: 0x9a775d,
    success: 0x67c65b,
    warning: 0xffcf5a,
    danger: 0xd95a4e,
    neutral: 0x6aa7d8,
    premium: 0xffc857,
    purple: 0xb779d9
  },
  typography: {
    primary: '24px',
    secondary: '15px',
    micro: '11px',
    fontFamily: 'Arial, sans-serif'
  },
  radius: {
    panel: 18,
    chip: 14,
    bar: 6
  },
  depth: {
    panel: 18,
    hud: 24,
    accent: 25
  }
} as const

export function getHUDVariantColor(variant: HUDVariant): number {
  return HUDTheme.colors[variant]
}

export function getDirtRiskVariant(ratio: number): HUDVariant {
  if (ratio >= 0.75) return 'danger'
  if (ratio >= 0.4) return 'warning'
  return 'success'
}

