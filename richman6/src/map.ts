import {
  MAP_LENGTH,
  TILE_EVENT,
  TILE_PROPERTY,
  TILE_REWARD,
  TILE_SHOP,
  TILE_START,
  TILE_TRAP
} from './config'
import type { MatchFlow } from './game-state'

export function gstsServerWrapTile(tileIndex: bigint, f: MatchFlow) {
  let wrapped = tileIndex
  if (bool(f.greaterThanOrEqualTo(tileIndex, MAP_LENGTH))) {
    wrapped = f.subtraction(tileIndex, MAP_LENGTH)
  }
  if (bool(f.lessThan(wrapped, 0n))) {
    wrapped = f.addition(wrapped, MAP_LENGTH)
  }
  return wrapped
}

export function gstsServerGetTileType(tileIndex: bigint) {
  let typeCode = TILE_PROPERTY
  if (bool(tileIndex === 0n)) {
    typeCode = TILE_START
  } else if (bool(tileIndex === 2n) || bool(tileIndex === 10n)) {
    typeCode = TILE_REWARD
  } else if (bool(tileIndex === 4n) || bool(tileIndex === 12n)) {
    typeCode = TILE_EVENT
  } else if (bool(tileIndex === 6n) || bool(tileIndex === 14n)) {
    typeCode = TILE_SHOP
  } else if (bool(tileIndex === 8n)) {
    typeCode = TILE_TRAP
  }
  return typeCode
}

export function gstsServerGetPropertyPrice(tileIndex: bigint) {
  let price = 0n
  if (bool(tileIndex === 1n)) {
    price = 260n
  } else if (bool(tileIndex === 3n)) {
    price = 300n
  } else if (bool(tileIndex === 5n)) {
    price = 340n
  } else if (bool(tileIndex === 7n)) {
    price = 380n
  } else if (bool(tileIndex === 9n)) {
    price = 420n
  } else if (bool(tileIndex === 11n)) {
    price = 460n
  } else if (bool(tileIndex === 13n)) {
    price = 520n
  } else if (bool(tileIndex === 15n)) {
    price = 580n
  }
  return price
}

export function gstsServerGetPropertyBaseRent(tileIndex: bigint) {
  let rent = 0n
  if (bool(tileIndex === 1n)) {
    rent = 60n
  } else if (bool(tileIndex === 3n)) {
    rent = 80n
  } else if (bool(tileIndex === 5n)) {
    rent = 100n
  } else if (bool(tileIndex === 7n)) {
    rent = 120n
  } else if (bool(tileIndex === 9n)) {
    rent = 140n
  } else if (bool(tileIndex === 11n)) {
    rent = 160n
  } else if (bool(tileIndex === 13n)) {
    rent = 180n
  } else if (bool(tileIndex === 15n)) {
    rent = 200n
  }
  return rent
}

export function gstsServerGetTileLabel(tileIndex: bigint) {
  let label = '起点环'
  if (bool(tileIndex === 1n)) {
    label = '住区 A'
  } else if (bool(tileIndex === 2n)) {
    label = '补给格'
  } else if (bool(tileIndex === 3n)) {
    label = '住区 B'
  } else if (bool(tileIndex === 4n)) {
    label = '事件格'
  } else if (bool(tileIndex === 5n)) {
    label = '工坊 A'
  } else if (bool(tileIndex === 6n)) {
    label = '商店格'
  } else if (bool(tileIndex === 7n)) {
    label = '工坊 B'
  } else if (bool(tileIndex === 8n)) {
    label = '陷阱格'
  } else if (bool(tileIndex === 9n)) {
    label = '店铺 A'
  } else if (bool(tileIndex === 10n)) {
    label = '奖励格'
  } else if (bool(tileIndex === 11n)) {
    label = '店铺 B'
  } else if (bool(tileIndex === 12n)) {
    label = '事件格'
  } else if (bool(tileIndex === 13n)) {
    label = '金融 A'
  } else if (bool(tileIndex === 14n)) {
    label = '商店格'
  } else if (bool(tileIndex === 15n)) {
    label = '金融 B'
  }
  return label
}
