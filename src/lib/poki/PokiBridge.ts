import type { PokiPlugin } from '@poki/phaser-3'
import { config } from '../../core/Config'

class PokiBridge {
  private plugin: PokiPlugin | null = null
  private loadingFinishedFired = false
  private gameplayActive = false

  init(scene: Phaser.Scene): void {
    const plugin = scene.plugins.get('poki')
    this.plugin = plugin ? (plugin as PokiPlugin) : null
  }

  gameLoadingFinished(reason: string): void {
    if (this.loadingFinishedFired) {
      return
    }

    this.loadingFinishedFired = true
    this.log('gameLoadingFinished', reason)
    this.plugin?.gameLoadingFinished()
  }

  gameplayStart(reason: string): void {
    if (this.gameplayActive) {
      return
    }

    this.gameplayActive = true
    this.log('gameplayStart', reason)
    this.plugin?.gameplayStart()
  }

  gameplayStop(reason: string): void {
    if (!this.gameplayActive) {
      return
    }

    this.gameplayActive = false
    this.log('gameplayStop', reason)
    this.plugin?.gameplayStop()
  }

  commercialBreak(reason: string): Promise<void> {
    this.log('commercialBreak', reason)
    if (!this.plugin) {
      return Promise.resolve()
    }

    return this.plugin.commercialBreak()
  }

  rewardedBreak(reason: string): Promise<boolean> {
    this.log('rewardedBreak', reason)
    if (!this.plugin) {
      return Promise.resolve(false)
    }

    return this.plugin.rewardedBreak()
  }

  private log(eventName: string, reason: string): void {
    if (config.isDev || config.game.debug) {
      console.info('[PokiSDK]', eventName, reason, Date.now())
    }
  }
}

export const pokiBridge = new PokiBridge()
