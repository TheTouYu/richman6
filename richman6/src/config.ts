export const MATCH_NODE_GRAPH_ID = 1073741825

export const PLAYER_COUNT = 2n
export const PLAYER_INDEXES = [0n, 1n] as const
export const MAP_LENGTH = 32n
export const MAX_ROUNDS = 12n

export const START_CASH = 2000n
export const START_COUPONS = 3n
export const PASS_START_REWARD = 300n
export const EVENT_CASH_REWARD = 180n
export const REWARD_TILE_CASH = 240n
export const SHOP_TILE_COUPON = 1n
export const TRAP_PENALTY = 160n

export const BUY_DISCOUNT_BY_CARD = 100n
export const UPGRADE_DISCOUNT_BY_CARD = 100n

export const PROPERTY_UPGRADE_COST_LEVEL_1 = 300n
export const PROPERTY_UPGRADE_COST_LEVEL_2 = 450n

export const TILE_START = 0n
export const TILE_PROPERTY = 1n
export const TILE_REWARD = 2n
export const TILE_EVENT = 3n
export const TILE_SHOP = 4n
export const TILE_TRAP = 5n

export const TILE_TYPE_CODES: bigint[] = [
  TILE_START,
  TILE_PROPERTY,
  TILE_REWARD,
  TILE_PROPERTY,
  TILE_EVENT,
  TILE_PROPERTY,
  TILE_SHOP,
  TILE_PROPERTY,
  TILE_TRAP,
  TILE_PROPERTY,
  TILE_REWARD,
  TILE_PROPERTY,
  TILE_EVENT,
  TILE_PROPERTY,
  TILE_SHOP,
  TILE_PROPERTY,
  TILE_START,
  TILE_PROPERTY,
  TILE_REWARD,
  TILE_PROPERTY,
  TILE_EVENT,
  TILE_PROPERTY,
  TILE_SHOP,
  TILE_PROPERTY,
  TILE_TRAP,
  TILE_PROPERTY,
  TILE_REWARD,
  TILE_PROPERTY,
  TILE_EVENT,
  TILE_PROPERTY,
  TILE_SHOP,
  TILE_PROPERTY
]

export const PROPERTY_PRICES = [
  0n,
  320n,
  0n,
  360n,
  0n,
  420n,
  0n,
  460n,
  0n,
  520n,
  0n,
  560n,
  0n,
  620n,
  0n,
  680n,
  0n,
  320n,
  0n,
  360n,
  0n,
  420n,
  0n,
  460n,
  0n,
  520n,
  0n,
  560n,
  0n,
  620n,
  0n,
  680n
] as const

export const PROPERTY_BASE_RENTS = [
  0n,
  90n,
  0n,
  110n,
  0n,
  130n,
  0n,
  150n,
  0n,
  170n,
  0n,
  190n,
  0n,
  210n,
  0n,
  230n,
  0n,
  90n,
  0n,
  110n,
  0n,
  130n,
  0n,
  150n,
  0n,
  170n,
  0n,
  190n,
  0n,
  210n,
  0n,
  230n
] as const

export const PROPERTY_GROUPS = [
  'core',
  'residential',
  'none',
  'residential',
  'none',
  'industrial',
  'none',
  'industrial',
  'none',
  'commercial',
  'none',
  'commercial',
  'none',
  'finance',
  'none',
  'finance',
  'core',
  'residential',
  'none',
  'residential',
  'none',
  'industrial',
  'none',
  'industrial',
  'none',
  'commercial',
  'none',
  'commercial',
  'none',
  'finance',
  'none',
  'finance'
] as const

function createFilledBigintArray(length: number, value: bigint): bigint[] {
  return Array.from({ length }, () => value)
}

export const EMPTY_PROPERTY_OWNERS: bigint[] = createFilledBigintArray(32, -1n)
export const EMPTY_PROPERTY_LEVELS: bigint[] = createFilledBigintArray(32, 0n)

export const INITIAL_PLAYER_CASH: bigint[] = [START_CASH, START_CASH]
export const INITIAL_PLAYER_COUPONS: bigint[] = [START_COUPONS, START_COUPONS]
export const INITIAL_PLAYER_POSITIONS: bigint[] = [0n, 0n]
export const INITIAL_PLAYER_ALIVE: boolean[] = [true, true]

export const INITIAL_PLAYER_0_HAND: string[] = ['MV-03', 'PR-01', 'PR-03', 'ST-01', 'BL-01']

export const INITIAL_PLAYER_1_HAND: string[] = [
  'MV-01',
  'MV-05',
  'PR-01',
  'PR-03',
  'ST-02',
  'PR-06'
]
