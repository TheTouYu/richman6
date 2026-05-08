import type { CompanionDef, RoleDef, TileConfig } from './types'

export const MATCH_NODE_GRAPH_ID = 1073741825

export const PLAYER_COUNT = 2n
export const HAND_SIZE = 6n
export const MAP_LENGTH = 16n
export const MAX_ROUNDS = 10n
export const TURN_INTERVAL_MS = 800

export const START_CASH = 1800n
export const START_COUPONS = 2n
export const PASS_START_REWARD = 220n
export const STOPPED_START_BONUS = 60n
export const REWARD_TILE_CASH = 180n
export const EVENT_TILE_CASH = 120n
export const EVENT_TILE_COUPON = 1n
export const SHOP_TILE_COUPON = 1n
export const TRAP_PENALTY = 160n
export const WEAKEN_REWARD_PENALTY = 40n
export const WEAKEN_RENT_PENALTY = 60n

export const BUY_DISCOUNT_BY_CARD = 80n
export const UPGRADE_DISCOUNT_BY_CARD = 100n
export const PROPERTY_UPGRADE_COST_LEVEL_1 = 260n
export const ROLE_ECONOMY_BONUS = 220n
export const ROLE_DISRUPT_SEAL_ROUNDS = 1n
export const COMPANION_TRIGGER_ENERGY = 3n
export const COMPANION_ECONOMY_CASH = 120n
export const COMPANION_SHIELD_TURNS = 1n

export const TILE_START = 0n
export const TILE_PROPERTY = 1n
export const TILE_REWARD = 2n
export const TILE_EVENT = 3n
export const TILE_SHOP = 4n
export const TILE_TRAP = 5n

function createFilledBigintArray(length: number, value: bigint): bigint[] {
  return Array.from({ length }, () => value)
}

export const EMPTY_PROPERTY_OWNERS = createFilledBigintArray(16, -1n)
export const EMPTY_PROPERTY_LEVELS = createFilledBigintArray(16, 0n)

export const INITIAL_PLAYER_0_HAND = ['MV-03', 'PR-01', 'PR-03', 'ST-01', 'BL-01', '']
export const INITIAL_PLAYER_1_HAND = ['MV-01', 'MV-02', 'PR-06', 'ST-02', 'BL-04', '']

export const MINI_BOARD: TileConfig[] = [
  { index: 0n, type: 'start', propertyGroup: 'core', price: 0n, baseRent: 0n, label: '起点环' },
  { index: 1n, type: 'property', propertyGroup: 'residential', price: 260n, baseRent: 60n, label: '住区 A' },
  { index: 2n, type: 'reward', propertyGroup: 'none', price: 0n, baseRent: 0n, label: '补给格' },
  { index: 3n, type: 'property', propertyGroup: 'residential', price: 300n, baseRent: 80n, label: '住区 B' },
  { index: 4n, type: 'event', propertyGroup: 'none', price: 0n, baseRent: 0n, label: '事件格' },
  { index: 5n, type: 'property', propertyGroup: 'industrial', price: 340n, baseRent: 100n, label: '工坊 A' },
  { index: 6n, type: 'shop', propertyGroup: 'none', price: 0n, baseRent: 0n, label: '商店格' },
  { index: 7n, type: 'property', propertyGroup: 'industrial', price: 380n, baseRent: 120n, label: '工坊 B' },
  { index: 8n, type: 'trap', propertyGroup: 'none', price: 0n, baseRent: 0n, label: '陷阱格' },
  { index: 9n, type: 'property', propertyGroup: 'commercial', price: 420n, baseRent: 140n, label: '店铺 A' },
  { index: 10n, type: 'reward', propertyGroup: 'none', price: 0n, baseRent: 0n, label: '奖励格' },
  { index: 11n, type: 'property', propertyGroup: 'commercial', price: 460n, baseRent: 160n, label: '店铺 B' },
  { index: 12n, type: 'event', propertyGroup: 'none', price: 0n, baseRent: 0n, label: '事件格' },
  { index: 13n, type: 'property', propertyGroup: 'finance', price: 520n, baseRent: 180n, label: '金融 A' },
  { index: 14n, type: 'shop', propertyGroup: 'none', price: 0n, baseRent: 0n, label: '商店格' },
  { index: 15n, type: 'property', propertyGroup: 'finance', price: 580n, baseRent: 200n, label: '金融 B' }
]

export const PROTOTYPE_ROLES: RoleDef[] = [
  {
    id: 'ROLE-ECO',
    label: '试验经济型',
    track: 'economy',
    summary: '现金低于阈值时自动触发一次补给'
  },
  {
    id: 'ROLE-DIS',
    label: '试验干扰型',
    track: 'disrupt',
    summary: '满足条件时自动封住对手的一块地产'
  }
]

export const PROTOTYPE_COMPANIONS: CompanionDef[] = [
  {
    id: 'COMP-ECO',
    label: '试验补给机',
    track: 'economy',
    summary: '每积满 3 点能量获得现金与点券'
  },
  {
    id: 'COMP-SHIELD',
    label: '试验护盾机',
    track: 'shield',
    summary: '每积满 3 点能量获得 1 回合免疫'
  }
]
