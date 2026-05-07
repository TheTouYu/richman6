export type TileType = 'start' | 'property' | 'reward' | 'event' | 'shop' | 'trap'

export type PropertyGroup =
  | 'core'
  | 'residential'
  | 'industrial'
  | 'commercial'
  | 'finance'
  | 'none'

export type CardCategory = 'movement' | 'property' | 'block' | 'defense'

export type CardWindow = 'before_roll' | 'after_roll' | 'after_land' | 'before_pay'

export interface PlayerState {
  id: bigint
  position: bigint
  cash: bigint
  coupons: bigint
  hand: string[]
  statuses: string[]
  isAlive: boolean
}

export interface TileConfig {
  index: bigint
  type: TileType
  propertyGroup: PropertyGroup
  price: bigint
  baseRent: bigint
  eventTag: string
}

export interface PropertyState {
  index: bigint
  ownerId: bigint
  level: bigint
  isSealed: boolean
}

export interface CardDef {
  id: string
  category: CardCategory
  window: CardWindow
  targetRule: string
  charges: bigint
  summary: string
}

export interface MatchState {
  currentPlayer: bigint
  currentRound: bigint
  currentDice: bigint
  mapLength: bigint
  gameOver: boolean
  winnerId: bigint
}
