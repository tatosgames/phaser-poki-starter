import { getHUDVariantColor, HUDTheme, type HUDVariant } from './HUDTheme'

export interface HUDBadgeConfig {
  scene: Phaser.Scene
  x: number
  y: number
  label: string
  variant: HUDVariant
  width?: number
}

export class HUDBadge extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Graphics
  private readonly labelText: Phaser.GameObjects.Text
  private readonly badgeWidth: number
  private variant: HUDVariant

  constructor(cfg: HUDBadgeConfig) {
    super(cfg.scene, cfg.x, cfg.y)
    this.badgeWidth = cfg.width ?? 92
    this.variant = cfg.variant
    this.bg = cfg.scene.add.graphics()
    this.labelText = cfg.scene.add.text(0, 0, cfg.label, {
      fontSize: HUDTheme.typography.micro,
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textPrimary,
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0.5)

    this.add([this.bg, this.labelText])
    this.draw()
    this.setDepth(HUDTheme.depth.hud)
    cfg.scene.add.existing(this)
  }

  setLabel(label: string): this {
    this.labelText.setText(label)
    return this
  }

  setVariant(variant: HUDVariant): this {
    this.variant = variant
    this.draw()
    return this
  }

  private draw(): void {
    const color = getHUDVariantColor(this.variant)
    this.bg.clear()
    this.bg.fillStyle(color, 0.16)
    this.bg.fillRoundedRect(-this.badgeWidth / 2, -12, this.badgeWidth, 24, 12)
    this.bg.lineStyle(1, color, 0.42)
    this.bg.strokeRoundedRect(-this.badgeWidth / 2, -12, this.badgeWidth, 24, 12)
  }
}

