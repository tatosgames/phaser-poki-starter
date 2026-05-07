import { getHUDVariantColor, HUDTheme, type HUDVariant } from './HUDTheme'

export interface StatChipConfig {
  scene: Phaser.Scene
  x: number
  y: number
  icon: string
  label: string
  value: string
  variant: HUDVariant
  align?: 'left' | 'center' | 'right'
  width?: number
}

export class StatChip extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Graphics
  private readonly iconText: Phaser.GameObjects.Text
  private readonly labelText: Phaser.GameObjects.Text
  private readonly valueText: Phaser.GameObjects.Text
  private readonly chipWidth: number
  private readonly variant: HUDVariant

  constructor(cfg: StatChipConfig) {
    super(cfg.scene, cfg.x, cfg.y)
    this.chipWidth = cfg.width ?? 132
    this.variant = cfg.variant
    this.bg = cfg.scene.add.graphics()
    this.iconText = cfg.scene.add.text(-this.chipWidth / 2 + 12, 0, cfg.icon, {
      fontSize: '15px',
      fontFamily: HUDTheme.typography.fontFamily,
      resolution: 2
    }).setOrigin(0, 0.5)
    this.labelText = cfg.scene.add.text(-this.chipWidth / 2 + 34, -8, cfg.label, {
      fontSize: HUDTheme.typography.micro,
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textSecondary,
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0, 0.5)
    this.valueText = cfg.scene.add.text(-this.chipWidth / 2 + 34, 10, cfg.value, {
      fontSize: HUDTheme.typography.secondary,
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textPrimary,
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0, 0.5)

    this.add([this.bg, this.iconText, this.labelText, this.valueText])
    this.drawBg()
    this.applyAlign(cfg.align ?? 'center')
    this.setDepth(HUDTheme.depth.hud)
    cfg.scene.add.existing(this)
  }

  setValue(value: string, cfg?: { pulse?: boolean }): this {
    if (this.valueText.text === value) {
      return this
    }

    this.valueText.setText(value)
    if (cfg?.pulse) {
      this.scene.tweens.killTweensOf(this)
      this.setScale(1.08)
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 180,
        ease: 'Back.easeOut'
      })
    }
    return this
  }

  private drawBg(): void {
    const color = getHUDVariantColor(this.variant)
    this.bg.clear()
    this.bg.fillStyle(0xffffff, 0.45)
    this.bg.fillRoundedRect(-this.chipWidth / 2, -21, this.chipWidth, 42, HUDTheme.radius.chip)
    this.bg.lineStyle(1, color, 0.34)
    this.bg.strokeRoundedRect(-this.chipWidth / 2, -21, this.chipWidth, 42, HUDTheme.radius.chip)
    this.bg.fillStyle(color, 0.14)
    this.bg.fillCircle(-this.chipWidth / 2 + 18, 0, 14)
  }

  private applyAlign(align: 'left' | 'center' | 'right'): void {
    if (align === 'left') {
      this.setOriginOffset(this.chipWidth / 2)
    } else if (align === 'right') {
      this.setOriginOffset(-this.chipWidth / 2)
    }
  }

  private setOriginOffset(offsetX: number): void {
    for (const child of this.list) {
      const gameObject = child as Phaser.GameObjects.GameObject & { x: number }
      gameObject.x += offsetX
    }
  }
}

