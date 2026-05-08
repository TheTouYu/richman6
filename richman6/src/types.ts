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

export type RoleTrack = 'economy' | 'disrupt' | 'control' | 'balance'

export type CompanionTrack = 'economy' | 'shield'

export interface TileConfig {
  index: bigint
  type: TileType
  propertyGroup: PropertyGroup
  price: bigint
  baseRent: bigint
  label: string
}

export interface CardDef {
  id: string
  category: CardCategory
  window: CardWindow
  targetRule: string
  summary: string
}

export interface RoleDef {
  id: string
  label: string
  track: RoleTrack
  summary: string
}

export interface CompanionDef {
  id: string
  label: string
  track: CompanionTrack
  summary: string
}
