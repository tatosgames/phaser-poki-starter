import { getHUDVariantColor, HUDTheme, type HUDVariant } from './HUDTheme'

export interface HUDToastConfig {
  scene: Phaser.Scene
  x: number
  y: number
  width?: number
}

export class HUDToast extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Graphics
  private readonly text: Phaser.GameObjects.Text
  private readonly toastWidth: number

  constructor(cfg: HUDToastConfig) {
    super(cfg.scene, cfg.x, cfg.y)
    this.toastWidth = cfg.width ?? 180
    this.bg = cfg.scene.add.graphics()
    this.text = cfg.scene.add.text(0, 0, '', {
      fontSize: HUDTheme.typography.secondary,
      fontFamily: HUDTheme.typography.fontFamily,
      color: HUDTheme.colors.textPrimary,
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0.5)

    this.add([this.bg, this.text])
    this.setDepth(HUDTheme.depth.accent)
    this.setVisible(false)
    cfg.scene.add.existing(this)
  }

  show(message: string, variant: HUDVariant = 'neutral'): this {
    const color = getHUDVariantColor(variant)
    this.scene.tweens.killTweensOf(this)
    this.text.setText(message)
    this.bg.clear()
    this.bg.fillStyle(0xffffff, 0.76)
    this.bg.fillRoundedRect(-this.toastWidth / 2, -18, this.toastWidth, 36, HUDTheme.radius.chip)
    this.bg.lineStyle(1, color, 0.45)
    this.bg.strokeRoundedRect(-this.toastWidth / 2, -18, this.toastWidth, 36, HUDTheme.radius.chip)
    this.setVisible(true).setAlpha(1).setScale(0.96)
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 120,
      ease: 'Back.easeOut'
    })
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      delay: 720,
      duration: 220,
      ease: 'Quad.easeOut',
      onComplete: () => this.setVisible(false)
    })
    return this
  }
}

