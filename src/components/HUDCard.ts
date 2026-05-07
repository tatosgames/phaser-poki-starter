import { HUDTheme } from './HUDTheme'

export interface HUDCardConfig {
  scene: Phaser.Scene
  x: number
  y: number
  width: number
  height: number
  alpha?: number
}

export class HUDCard extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Graphics
  private readonly cardWidth: number
  private readonly cardHeight: number
  private readonly fillAlpha: number

  constructor(cfg: HUDCardConfig) {
    super(cfg.scene, cfg.x, cfg.y)
    this.cardWidth = cfg.width
    this.cardHeight = cfg.height
    this.fillAlpha = cfg.alpha ?? 0.68
    this.bg = cfg.scene.add.graphics()
    this.add(this.bg)
    this.draw()
    this.setDepth(HUDTheme.depth.panel)
    cfg.scene.add.existing(this)
  }

  private draw(): void {
    const x = -this.cardWidth / 2
    const y = -this.cardHeight / 2

    this.bg.clear()
    this.bg.fillStyle(HUDTheme.colors.shadow, 0.07)
    this.bg.fillRoundedRect(x + 2, y + 3, this.cardWidth, this.cardHeight, HUDTheme.radius.panel)
    this.bg.fillStyle(HUDTheme.colors.panelFill, this.fillAlpha)
    this.bg.fillRoundedRect(x, y, this.cardWidth, this.cardHeight, HUDTheme.radius.panel)
    this.bg.lineStyle(1, HUDTheme.colors.panelStroke, 0.45)
    this.bg.strokeRoundedRect(x, y, this.cardWidth, this.cardHeight, HUDTheme.radius.panel)
  }
}

