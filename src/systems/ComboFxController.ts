import type { ComboBreakEvent, ComboUpdate } from './ComboSystem'

interface SparkEntry {
  image: Phaser.GameObjects.Image
  active: boolean
}

export class ComboFxController {
  private readonly scene: Phaser.Scene
  private readonly sparks: SparkEntry[] = []
  private readonly maxSparks: number

  constructor(scene: Phaser.Scene, maxSparks = 36) {
    this.scene = scene
    this.maxSparks = Math.max(12, maxSparks)
    this.createPool()
  }

  onComboIncrease(update: ComboUpdate, worldX: number, worldY: number): void {
    const intensity = update.tier.fxIntensity
    const sparkCount = intensity === 1 ? 3 : intensity === 2 ? 5 : intensity === 3 ? 7 : 9

    for (let i = 0; i < sparkCount; i++) {
      this.spawnSpark(worldX, worldY, update.tier.color, intensity)
    }

    if (intensity >= 3) {
      const shake = intensity === 3 ? 0.001 : 0.0015
      this.scene.cameras.main.shake(80, shake, true)
    }
  }

  onComboBreak(event: ComboBreakEvent, worldX: number, worldY?: number): void {
    const x = worldX
    const y = worldY ?? 110
    const count = event.previousTier.fxIntensity === 1 ? 4 : event.previousTier.fxIntensity === 2 ? 6 : 8
    for (let i = 0; i < count; i++) {
      this.spawnSpark(x, y, 0x8c7352, 1)
    }
  }

  destroy(): void {
    for (const spark of this.sparks) {
      this.scene.tweens.killTweensOf(spark.image)
      spark.image.destroy()
    }
    this.sparks.length = 0
  }

  private createPool(): void {
    for (let i = 0; i < this.maxSparks; i++) {
      const image = this.scene.add.image(0, 0, 'particle')
      image.setVisible(false)
      image.setDepth(42)
      this.sparks.push({ image, active: false })
    }
  }

  private spawnSpark(x: number, y: number, tint: number, intensity: number): void {
    const spark = this.sparks.find((entry) => !entry.active)
    if (!spark) {
      return
    }

    spark.active = true
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
    const distance = Phaser.Math.FloatBetween(12, 34 + intensity * 6)
    const targetX = x + Math.cos(angle) * distance
    const targetY = y + Math.sin(angle) * distance - Phaser.Math.FloatBetween(6, 20)
    const scale = Phaser.Math.FloatBetween(0.45, 0.85)

    spark.image
      .setPosition(x + Phaser.Math.Between(-4, 4), y + Phaser.Math.Between(-4, 4))
      .setTint(tint)
      .setScale(scale)
      .setAlpha(0.9)
      .setVisible(true)

    this.scene.tweens.add({
      targets: spark.image,
      x: targetX,
      y: targetY,
      alpha: 0,
      scaleX: scale * 0.6,
      scaleY: scale * 0.6,
      duration: 240 + intensity * 40,
      ease: 'Quad.easeOut',
      onComplete: () => {
        spark.image.setVisible(false)
        spark.active = false
      }
    })
  }
}

