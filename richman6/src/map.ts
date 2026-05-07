import {
  MAP_LENGTH,
  TILE_EVENT,
  TILE_PROPERTY,
  TILE_REWARD,
  TILE_SHOP,
  TILE_START,
  TILE_TRAP
} from './config'

export function gstsServerGetTileType(tileIndex: bigint) {
  let typeCode = TILE_PROPERTY
  if (bool(tileIndex === 0n) || bool(tileIndex === 16n)) {
    typeCode = TILE_START
  } else if (
    bool(tileIndex === 2n) ||
    bool(tileIndex === 10n) ||
    bool(tileIndex === 18n) ||
    bool(tileIndex === 26n)
  ) {
    typeCode = TILE_REWARD
  } else if (
    bool(tileIndex === 4n) ||
    bool(tileIndex === 12n) ||
    bool(tileIndex === 20n) ||
    bool(tileIndex === 28n)
  ) {
    typeCode = TILE_EVENT
  } else if (
    bool(tileIndex === 6n) ||
    bool(tileIndex === 14n) ||
    bool(tileIndex === 22n) ||
    bool(tileIndex === 30n)
  ) {
    typeCode = TILE_SHOP
  } else if (bool(tileIndex === 8n) || bool(tileIndex === 24n)) {
    typeCode = TILE_TRAP
  }
  return typeCode
}

export function gstsServerGetPropertyPrice(tileIndex: bigint) {
  let price = 0n
  if (bool(tileIndex === 1n) || bool(tileIndex === 17n)) {
    price = 320n
  } else if (bool(tileIndex === 3n) || bool(tileIndex === 19n)) {
    price = 360n
  } else if (bool(tileIndex === 5n) || bool(tileIndex === 21n)) {
    price = 420n
  } else if (bool(tileIndex === 7n) || bool(tileIndex === 23n)) {
    price = 460n
  } else if (bool(tileIndex === 9n) || bool(tileIndex === 25n)) {
    price = 520n
  } else if (bool(tileIndex === 11n) || bool(tileIndex === 27n)) {
    price = 560n
  } else if (bool(tileIndex === 13n) || bool(tileIndex === 29n)) {
    price = 620n
  } else if (bool(tileIndex === 15n) || bool(tileIndex === 31n)) {
    price = 680n
  }
  return price
}

export function gstsServerGetPropertyBaseRent(tileIndex: bigint) {
  let rent = 0n
  if (bool(tileIndex === 1n) || bool(tileIndex === 17n)) {
    rent = 90n
  } else if (bool(tileIndex === 3n) || bool(tileIndex === 19n)) {
    rent = 110n
  } else if (bool(tileIndex === 5n) || bool(tileIndex === 21n)) {
    rent = 130n
  } else if (bool(tileIndex === 7n) || bool(tileIndex === 23n)) {
    rent = 150n
  } else if (bool(tileIndex === 9n) || bool(tileIndex === 25n)) {
    rent = 170n
  } else if (bool(tileIndex === 11n) || bool(tileIndex === 27n)) {
    rent = 190n
  } else if (bool(tileIndex === 13n) || bool(tileIndex === 29n)) {
    rent = 210n
  } else if (bool(tileIndex === 15n) || bool(tileIndex === 31n)) {
    rent = 230n
  }
  return rent
}

export function gstsServerWrapTile(tileIndex: bigint) {
  let wrapped = tileIndex
  if (bool(tileIndex >= MAP_LENGTH)) {
    wrapped = tileIndex - MAP_LENGTH
  }
  if (bool(wrapped < 0n)) {
    wrapped = wrapped + MAP_LENGTH
  }
  return wrapped
}
