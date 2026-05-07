import { formatTime } from '../utils/helpers'
import { HUDTheme } from './HUDTheme'

export interface HUDTimerConfig {
  scene: Phaser.Scene
  x: number
  y: number
  initialMs: number
  warningMs: number
  dangerMs: number
  align?: 'left' | 'center' | 'right'
}

export class HUDTimer extends Phaser.GameObjects.Container {
  private readonly labelText: Phaser.GameObjects.Text
  private readonly valueText: Phaser.GameObjects.Text
  private readonly warningMs: number
  private readonly dangerMs: number
  private lastShownSecond = -1

  constructor(cfg: HUDTimerConfig) {
    super(cfg.scene, cfg.x, cfg.y)
    this.warningMs = cfg.warningMs
    this.dangerMs = cfg.dangerMs

    this.labelText = cfg.scene.add.text(0, -14, 'Time', {
      fontSize: HUDTheme.typography.micro,
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textSecondary,
      fontStyle: 'bold',
      resolution: 2
    })
    this.valueText = cfg.scene.add.text(0, 8, `⏱ ${formatTime(cfg.initialMs)}`, {
      fontSize: HUDTheme.typography.primary,
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textPrimary,
      fontStyle: 'bold',
      resolution: 2
    })

    this.applyAlign(cfg.align ?? 'right')
    this.add([this.labelText, this.valueText])
    this.setTime(cfg.initialMs, true)
    this.setDepth(HUDTheme.depth.hud)
    cfg.scene.add.existing(this)
  }

  setTime(ms: number, force = false): void {
    const shownSecond = Math.ceil(ms / 1000)
    if (!force && shownSecond === this.lastShownSecond) {
      return
    }

    this.lastShownSecond = shownSecond
    this.valueText.setText(`⏱ ${formatTime(ms)}`)
    this.valueText.setColor(this.getColor(ms))
    this.scene.tweens.killTweensOf(this.valueText)
    this.valueText.setScale(1)
  }

  updatePulse(now: number, ms: number): void {
    if (ms <= this.dangerMs) {
      const pulse = 1 + Math.sin(now * 0.02) * 0.08
      this.valueText.setScale(pulse)
      return
    }

    if (ms <= this.warningMs) {
      const pulse = 1 + Math.sin(now * 0.012) * 0.03
      this.valueText.setScale(pulse)
      return
    }

    this.valueText.setScale(1)
  }

  private getColor(ms: number): string {
    if (ms <= this.dangerMs) return '#b0362f'
    if (ms <= this.warningMs) return '#d95a4e'
    return HUDTheme.colors.textPrimary
  }

  private applyAlign(align: 'left' | 'center' | 'right'): void {
    const originX = align === 'left' ? 0 : align === 'right' ? 1 : 0.5
    this.labelText.setOrigin(originX, 0.5)
    this.valueText.setOrigin(originX, 0.5)
  }
}

