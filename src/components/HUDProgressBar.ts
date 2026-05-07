import { getHUDVariantColor, HUDTheme, type HUDVariant } from './HUDTheme'

export interface HUDProgressBarConfig {
  scene: Phaser.Scene
  x: number
  y: number
  width: number
  height: number
  icon: string
  label: string
  valueLabel: string
  value: number
  variant: HUDVariant
  showShine?: boolean
  animationEnabled?: boolean
}

export class HUDProgressBar extends Phaser.GameObjects.Container {
  private readonly labelText: Phaser.GameObjects.Text
  private readonly valueText: Phaser.GameObjects.Text
  private readonly track: Phaser.GameObjects.Graphics
  private readonly fill: Phaser.GameObjects.Graphics
  private readonly shine: Phaser.GameObjects.Graphics
  private readonly barWidth: number
  private readonly barHeight: number
  private readonly showShine: boolean
  private readonly animationEnabled: boolean
  private display = { value: 0 }
  private variant: HUDVariant

  constructor(cfg: HUDProgressBarConfig) {
    super(cfg.scene, cfg.x, cfg.y)
    this.barWidth = cfg.width
    this.barHeight = cfg.height
    this.showShine = cfg.showShine ?? true
    this.animationEnabled = cfg.animationEnabled ?? true
    this.variant = cfg.variant
    this.display.value = Phaser.Math.Clamp(cfg.value, 0, 1)

    this.labelText = cfg.scene.add.text(-this.barWidth / 2, -16, `${cfg.icon} ${cfg.label}`, {
      fontSize: HUDTheme.typography.micro,
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textSecondary,
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0, 0.5)
    this.valueText = cfg.scene.add.text(this.barWidth / 2, -16, cfg.valueLabel, {
      fontSize: HUDTheme.typography.micro,
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textPrimary,
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(1, 0.5)
    this.track = cfg.scene.add.graphics()
    this.fill = cfg.scene.add.graphics()
    this.shine = cfg.scene.add.graphics()

    this.add([this.track, this.fill, this.shine, this.labelText, this.valueText])
    this.draw()
    this.setDepth(HUDTheme.depth.hud)
    cfg.scene.add.existing(this)
  }

  setValue(
    value: number,
    cfg?: { valueLabel?: string; variant?: HUDVariant; pulse?: boolean }
  ): this {
    const nextValue = Phaser.Math.Clamp(value, 0, 1)
    if (cfg?.valueLabel) {
      this.valueText.setText(cfg.valueLabel)
    }
    if (cfg?.variant) {
      this.variant = cfg.variant
    }

    this.scene.tweens.killTweensOf(this.display)
    if (this.animationEnabled) {
      this.scene.tweens.add({
        targets: this.display,
        value: nextValue,
        duration: 180,
        ease: 'Quad.easeOut',
        onUpdate: () => this.draw(),
        onComplete: () => this.draw()
      })
    } else {
      this.display.value = nextValue
      this.draw()
    }

    if (cfg?.pulse) {
      this.pulseValue()
    }
    return this
  }

  private draw(): void {
    const fillWidth = Math.max(0, Math.round(this.barWidth * this.display.value))
    const radius = HUDTheme.radius.bar
    const x = -this.barWidth / 2
    const y = 0
    const color = getHUDVariantColor(this.variant)

    this.track.clear()
    this.track.fillStyle(HUDTheme.colors.track, 0.88)
    this.track.fillRoundedRect(x, y, this.barWidth, this.barHeight, radius)
    this.track.lineStyle(1, HUDTheme.colors.trackStroke, 0.28)
    this.track.strokeRoundedRect(x, y, this.barWidth, this.barHeight, radius)

    this.fill.clear()
    if (fillWidth > 0) {
      this.fill.fillStyle(color, 1)
      this.fill.fillRoundedRect(x, y, fillWidth, this.barHeight, radius)
    }

    this.shine.clear()
    if (this.showShine && fillWidth > 10) {
      this.shine.fillStyle(0xffffff, 0.26)
      this.shine.fillRoundedRect(x + 4, y + 2, Math.max(0, fillWidth - 8), 2, 1)
    }
  }

  private pulseValue(): void {
    this.scene.tweens.killTweensOf(this.valueText)
    this.valueText.setScale(1.12)
    this.scene.tweens.add({
      targets: this.valueText,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: 'Back.easeOut'
    })
  }
}

