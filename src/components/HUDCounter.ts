import { HUDTheme, type HUDVariant } from './HUDTheme'
import { StatChip } from './StatChip'

export interface HUDCounterConfig {
  scene: Phaser.Scene
  x: number
  y: number
  icon: string
  label: string
  value: number
  variant: HUDVariant
  width?: number
}

export class HUDCounter extends StatChip {
  private currentValue: number

  constructor(cfg: HUDCounterConfig) {
    super({
      scene: cfg.scene,
      x: cfg.x,
      y: cfg.y,
      icon: cfg.icon,
      label: cfg.label,
      value: `${cfg.value}`,
      variant: cfg.variant,
      width: cfg.width
    })
    this.currentValue = cfg.value
    this.setDepth(HUDTheme.depth.hud)
  }

  setNumber(value: number, cfg?: { prefix?: string; pulse?: boolean }): this {
    this.currentValue = value
    this.setValue(`${cfg?.prefix ?? ''}${this.currentValue}`, { pulse: cfg?.pulse })
    return this
  }

  get value(): number {
    return this.currentValue
  }
}

