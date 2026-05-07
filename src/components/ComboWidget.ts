import type { ComboBreakEvent, ComboUpdate } from '../systems/ComboSystem'
import { HUDTheme } from './HUDTheme'

export interface ComboWidgetConfig {
  scene: Phaser.Scene
  x: number
  y: number
  width?: number
  showMeter?: boolean
  animationEnabled?: boolean
}

export class ComboWidget extends Phaser.GameObjects.Container {
  private readonly titleText: Phaser.GameObjects.Text
  private readonly countText: Phaser.GameObjects.Text
  private readonly labelText: Phaser.GameObjects.Text
  private readonly breakText: Phaser.GameObjects.Text
  private readonly meterTrack: Phaser.GameObjects.Graphics
  private readonly meterFill: Phaser.GameObjects.Graphics
  private readonly glow: Phaser.GameObjects.Graphics
  private readonly widgetWidth: number
  private readonly showMeter: boolean
  private readonly animationEnabled: boolean

  constructor(cfg: ComboWidgetConfig) {
    super(cfg.scene, cfg.x, cfg.y)
    this.widgetWidth = cfg.width ?? 200
    this.showMeter = cfg.showMeter ?? true
    this.animationEnabled = cfg.animationEnabled ?? true

    this.glow = cfg.scene.add.graphics()
    this.titleText = cfg.scene.add.text(0, -30, 'COMBO', {
      fontSize: '13px',
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textSecondary,
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0.5)

    this.countText = cfg.scene.add.text(0, -6, '', {
      fontSize: '44px',
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textOnColor,
      fontStyle: 'bold',
      stroke: HUDTheme.colors.textPrimary,
      strokeThickness: 6,
      resolution: 2
    }).setOrigin(0.5).setVisible(false)

    this.labelText = cfg.scene.add.text(0, 28, '', {
      fontSize: '18px',
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textOnColor,
      fontStyle: 'bold',
      stroke: HUDTheme.colors.textPrimary,
      strokeThickness: 4,
      resolution: 2
    }).setOrigin(0.5).setVisible(false)

    this.breakText = cfg.scene.add.text(0, 8, '', {
      fontSize: '18px',
      fontFamily: HUDTheme.typography.fontFamily,
      color: '#f4d5c1',
      fontStyle: 'bold',
      stroke: '#6d5740',
      strokeThickness: 3,
      resolution: 2
    }).setOrigin(0.5).setVisible(false)

    this.meterTrack = cfg.scene.add.graphics()
    this.meterFill = cfg.scene.add.graphics()

    this.add([
      this.glow,
      this.titleText,
      this.countText,
      this.labelText,
      this.breakText,
      this.meterTrack,
      this.meterFill
    ])

    cfg.scene.add.existing(this)
    this.setDepth(55)
    this.setVisible(false)
  }

  onIncrement(update: ComboUpdate): void {
    if (update.count < 2) {
      return
    }

    this.setVisible(true)
    this.breakText.setVisible(false)
    this.countText.setVisible(true).setText(`x${update.count}`).setColor(`#${update.tier.color.toString(16).padStart(6, '0')}`)
    this.labelText.setVisible(true).setText(update.tier.label)
    this.drawGlow(update.tier.color, update.tier.fxIntensity)
    this.drawMeter(update.timeRemainingRatio, update.tier.fxIntensity)
    this.spawnGhostNumber(update.count)

    if (this.animationEnabled) {
      this.scene.tweens.killTweensOf([this.countText, this.labelText])
      this.countText.setScale(0.84, 1.18)
      this.scene.tweens.add({
        targets: this.countText,
        scaleX: 1,
        scaleY: 1,
        duration: 220,
        ease: 'Back.easeOut'
      })
      this.labelText.setScale(0.86).setAlpha(0.35)
      this.scene.tweens.add({
        targets: this.labelText,
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        duration: 180,
        ease: 'Sine.easeOut'
      })
    }
  }

  onBreak(event: ComboBreakEvent): void {
    this.scene.tweens.killTweensOf([this.countText, this.labelText, this.breakText, this.glow])
    this.countText.setVisible(false)
    this.labelText.setVisible(false)
    this.glow.clear()
    this.drawMeter(0, 1)

    const msg = event.reason === 'timeout' ? 'So Close!' : 'Combo Broken'
    this.breakText.setText(msg).setVisible(true).setAlpha(1).setY(8).setScale(0.9)
    this.setVisible(true)
    this.scene.tweens.add({
      targets: this.breakText,
      y: -4,
      alpha: 0,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 520,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.breakText.setVisible(false)
        this.setVisible(false)
      }
    })
  }

  updateMeter(ratio: number, intensity: number): void {
    if (!this.visible || !this.showMeter) {
      return
    }
    this.drawMeter(ratio, intensity)
  }

  private drawGlow(color: number, intensity: number): void {
    this.glow.clear()
    const alpha = 0.08 + intensity * 0.05
    this.glow.fillStyle(color, alpha)
    this.glow.fillRoundedRect(-this.widgetWidth / 2, -44, this.widgetWidth, 92, 20)
  }

  private drawMeter(ratio: number, intensity: number): void {
    if (!this.showMeter) {
      this.meterTrack.clear()
      this.meterFill.clear()
      return
    }

    const width = this.widgetWidth * 0.86
    const height = 8
    const x = -width / 2
    const y = 48
    const fill = Math.max(0, Math.round(width * Phaser.Math.Clamp(ratio, 0, 1)))
    const color = ratio > 0.8 ? 0x7ccf5b : ratio > 0.5 ? 0xffcf5a : ratio > 0.25 ? 0xffa94d : ratio > 0.12 ? 0xf26b5d : 0xffe680

    this.meterTrack.clear()
    this.meterTrack.fillStyle(HUDTheme.colors.track, 0.88)
    this.meterTrack.fillRoundedRect(x, y, width, height, HUDTheme.radius.bar)
    this.meterTrack.lineStyle(1, HUDTheme.colors.trackStroke, 0.28)
    this.meterTrack.strokeRoundedRect(x, y, width, height, HUDTheme.radius.bar)

    this.meterFill.clear()
    if (fill > 0) {
      this.meterFill.fillStyle(color, 1)
      this.meterFill.fillRoundedRect(x, y, fill, height, HUDTheme.radius.bar)
    }

    if (ratio < 0.25 && intensity >= 2 && this.animationEnabled) {
      this.scene.tweens.killTweensOf(this.meterFill)
      this.scene.tweens.add({
        targets: this.meterFill,
        alpha: 0.55,
        yoyo: true,
        repeat: 1,
        duration: 120
      })
    }
  }

  private spawnGhostNumber(count: number): void {
    const ghost = this.scene.add.text(0, -6, `x${count}`, {
      fontSize: '44px',
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textOnColor,
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0.5).setAlpha(0.4)
    this.add(ghost)
    this.scene.tweens.add({
      targets: ghost,
      y: -22,
      alpha: 0,
      duration: 220,
      ease: 'Quad.easeOut',
      onComplete: () => ghost.destroy()
    })
  }
}
