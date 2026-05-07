export type ComboBreakReason =
  | 'wrong_tap'
  | 'overripe_tap'
  | 'timeout'
  | 'round_end'
  | 'manual'

export interface ComboTierConfig {
  threshold: number
  label: string
  color: number
  fxIntensity: 1 | 2 | 3 | 4
}

export interface ComboTierState extends ComboTierConfig {
  index: number
}

export interface ComboUpdate {
  count: number
  tier: ComboTierState
  previousTier: ComboTierState
  isTierUp: boolean
  timeRemainingRatio: number
}

export interface ComboBreakEvent {
  previousCount: number
  previousTier: ComboTierState
  reason: ComboBreakReason
}

export interface ComboTimeoutEvent extends ComboBreakEvent {
  reason: 'timeout'
}

const DEFAULT_TIERS: readonly ComboTierConfig[] = [
  { threshold: 2, label: 'Nice', color: 0x7ccf5b, fxIntensity: 1 },
  { threshold: 3, label: 'Great', color: 0x8ad04f, fxIntensity: 1 },
  { threshold: 5, label: 'Smooth', color: 0xffcf5a, fxIntensity: 2 },
  { threshold: 7, label: 'Hot', color: 0xffa94d, fxIntensity: 2 },
  { threshold: 10, label: 'Amazing', color: 0xff8b47, fxIntensity: 3 },
  { threshold: 15, label: 'Fire', color: 0xf26b5d, fxIntensity: 3 },
  { threshold: 20, label: 'Insane', color: 0xef6bd3, fxIntensity: 4 },
  { threshold: 30, label: 'Legendary', color: 0xffc857, fxIntensity: 4 },
  { threshold: 50, label: 'Godlike', color: 0xffe680, fxIntensity: 4 }
] as const

const BASE_TIER: ComboTierState = {
  threshold: 0,
  label: 'Combo',
  color: 0x7a3e2c,
  fxIntensity: 1,
  index: -1
}

export class ComboSystem {
  private _count = 0
  private readonly _windowMs: number
  private _timeRemainingMs = 0
  private readonly _tiers: readonly ComboTierConfig[]

  constructor(windowMs: number, tiers: readonly ComboTierConfig[] = DEFAULT_TIERS) {
    this._windowMs = Math.max(300, Math.floor(windowMs))
    this._tiers = tiers.slice().sort((a, b) => a.threshold - b.threshold)
  }

  increment(): ComboUpdate {
    const previousTier = this.tier
    this._count += 1
    this._timeRemainingMs = this._windowMs
    const tier = this.tier

    return {
      count: this._count,
      tier,
      previousTier,
      isTierUp: tier.index > previousTier.index,
      timeRemainingRatio: this.timeRemainingRatio
    }
  }

  break(reason: ComboBreakReason): ComboBreakEvent | null {
    if (this._count <= 1) {
      this.reset()
      return null
    }

    const event: ComboBreakEvent = {
      previousCount: this._count,
      previousTier: this.tier,
      reason
    }
    this.reset()
    return event
  }

  update(deltaMs: number): ComboTimeoutEvent | null {
    if (this._count <= 1) {
      return null
    }

    this._timeRemainingMs = Math.max(0, this._timeRemainingMs - deltaMs)
    if (this._timeRemainingMs > 0) {
      return null
    }

    const event = this.break('timeout')
    if (!event) {
      return null
    }

    return {
      ...event,
      reason: 'timeout'
    }
  }

  reset(): void {
    this._count = 0
    this._timeRemainingMs = 0
  }

  get count(): number {
    return this._count
  }

  get tier(): ComboTierState {
    let tier: ComboTierState = BASE_TIER
    for (let i = 0; i < this._tiers.length; i++) {
      const candidate = this._tiers[i]
      if (this._count >= candidate.threshold) {
        tier = { ...candidate, index: i }
      }
    }
    return tier
  }

  get timeRemainingRatio(): number {
    if (this._count <= 1) {
      return 0
    }
    return Math.max(0, Math.min(1, this._timeRemainingMs / this._windowMs))
  }
}
