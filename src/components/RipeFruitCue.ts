import { HUDTheme } from './HUDTheme'

export interface RipeFruitCueConfig {
  scene: Phaser.Scene
  animationEnabled?: boolean
}

export class RipeFruitCue extends Phaser.GameObjects.Container {
  private readonly halo: Phaser.GameObjects.Graphics
  private readonly ring: Phaser.GameObjects.Graphics
  private readonly tapLabel: Phaser.GameObjects.Text
  private readonly sparkle: Phaser.GameObjects.Text
  private readonly animationEnabled: boolean
  private visibleState = false
  private currentX = 0
  private currentY = 0
  private currentSize = 0

  constructor(cfg: RipeFruitCueConfig) {
    super(cfg.scene, 0, 0)
    this.animationEnabled = cfg.animationEnabled ?? true

    this.halo = cfg.scene.add.graphics()
    this.ring = cfg.scene.add.graphics()
    this.tapLabel = cfg.scene.add.text(0, -34, 'TAP!', {
      fontSize: '13px',
      fontFamily: HUDTheme.typography.fontFamily,
      color: '#7ccf5b',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 2,
      resolution: 2
    }).setOrigin(0.5)
    this.sparkle = cfg.scene.add.text(18, -18, '✦', {
      fontSize: '14px',
      fontFamily: HUDTheme.typography.fontFamily,
      color: '#fff6c7',
      resolution: 2
    }).setOrigin(0.5)

    this.add([this.halo, this.ring, this.tapLabel, this.sparkle])
    this.setDepth(14)
    this.setVisible(false)
    cfg.scene.add.existing(this)
  }

  show(x: number, y: number, baseSize: number): void {
    if (this.visibleState && this.currentX === x && this.currentY === y && this.currentSize === baseSize) {
      return
    }

    this.visibleState = true
    this.currentX = x
    this.currentY = y
    this.currentSize = baseSize
    this.setVisible(true)
    this.setPosition(x, y)
    this.draw(baseSize)
    this.refreshTweens()
  }

  hide(): void {
    if (!this.visibleState) {
      return
    }

    this.visibleState = false
    this.currentSize = 0
    this.scene.tweens.killTweensOf([this, this.tapLabel, this.sparkle, this.halo, this.ring])
    this.setVisible(false)
  }

  override destroy(fromScene?: boolean): void {
    this.scene.tweens.killTweensOf([this, this.tapLabel, this.sparkle, this.halo, this.ring])
    super.destroy(fromScene)
  }

  private draw(baseSize: number): void {
    const haloSize = baseSize * 0.7
    const ringSize = baseSize * 0.56

    this.halo.clear()
    this.halo.fillStyle(0xa9f16f, 0.14)
    this.halo.fillCircle(0, 0, haloSize)

    this.ring.clear()
    this.ring.lineStyle(2, 0x9de667, 0.9)
    this.ring.strokeCircle(0, 0, ringSize)
    this.ring.lineStyle(1, 0xe7ffcc, 0.65)
    this.ring.strokeCircle(0, 0, ringSize * 0.78)
  }

  private refreshTweens(): void {
    if (!this.animationEnabled) {
      return
    }

    this.scene.tweens.killTweensOf([this, this.tapLabel, this.sparkle, this.halo, this.ring])
    this.setScale(1)
    this.tapLabel.setAlpha(1)
    this.sparkle.setAlpha(0.9)
    this.halo.setAlpha(1)
    this.ring.setAlpha(1)

    this.scene.tweens.add({
      targets: this,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 420,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    this.scene.tweens.add({
      targets: this.tapLabel,
      y: -38,
      alpha: 0.75,
      duration: 420,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    this.scene.tweens.add({
      targets: this.sparkle,
      x: 20,
      y: -22,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }
}
