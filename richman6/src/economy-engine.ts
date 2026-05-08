import {
  EVENT_TILE_CASH,
  EVENT_TILE_COUPON,
  PASS_START_REWARD,
  PROPERTY_UPGRADE_COST_LEVEL_1,
  REWARD_TILE_CASH,
  SHOP_TILE_COUPON,
  STOPPED_START_BONUS,
  TRAP_PENALTY
} from './config'
import {
  gstsServerAddPlayerCash,
  gstsServerAddPlayerCoupons,
  gstsServerGetPlayerCash,
  gstsServerGetPlayerCoupons,
  gstsServerGetPlayerPosition,
  gstsServerGetPropertyLevel,
  gstsServerGetPropertyOwner,
  gstsServerSetPlayerPosition,
  gstsServerSetPropertyLevel,
  gstsServerSetPropertyOwner
} from './game-state'
import {
  gstsServerGetAdjustedRent,
  gstsServerGetAdjustedReward,
  gstsServerGetBuyDiscount,
  gstsServerGetUpgradeDiscount,
  gstsServerShouldWaiveRent,
  gstsServerTryBlockAttackWithShield
} from './card-engine'
import { MAP_LENGTH, TILE_EVENT, TILE_PROPERTY, TILE_REWARD, TILE_SHOP, TILE_START } from './config'
import { gstsServerGetPropertyBaseRent, gstsServerGetPropertyPrice, gstsServerGetTileType, gstsServerWrapTile } from './map'
import { gstsServerLogLanding, gstsServerLogLine, gstsServerLogSnapshot } from './ui-log'
import type { MatchFlow } from './game-state'

export function gstsServerGetUpgradeCost(_tileIndex: bigint) {
  return PROPERTY_UPGRADE_COST_LEVEL_1
}

export function gstsServerGetRentForProperty(tileIndex: bigint, level: bigint, payerId: bigint, f: MatchFlow) {
  let rent = gstsServerGetPropertyBaseRent(tileIndex)
  if (bool(level >= 2n)) {
    rent = f.multiplication(rent, 2n)
  }
  return gstsServerGetAdjustedRent(rent, payerId, f)
}

export function gstsServerPresentPlayerPosition(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  if (bool(tileIndex === 1n)) {
    f.teleportPlayer(player(playerIndex + 1n), [4, 0, 0], [0, 0, 0])
  } else if (bool(tileIndex === 2n)) {
    f.teleportPlayer(player(playerIndex + 1n), [8, 0, 0], [0, 0, 0])
  } else if (bool(tileIndex === 3n)) {
    f.teleportPlayer(player(playerIndex + 1n), [12, 0, 0], [0, 0, 0])
  } else if (bool(tileIndex === 4n)) {
    f.teleportPlayer(player(playerIndex + 1n), [16, 0, 0], [0, 0, 0])
  } else if (bool(tileIndex === 5n)) {
    f.teleportPlayer(player(playerIndex + 1n), [16, 0, 4], [0, 0, 0])
  } else if (bool(tileIndex === 6n)) {
    f.teleportPlayer(player(playerIndex + 1n), [16, 0, 8], [0, 0, 0])
  } else if (bool(tileIndex === 7n)) {
    f.teleportPlayer(player(playerIndex + 1n), [16, 0, 12], [0, 0, 0])
  } else if (bool(tileIndex === 8n)) {
    f.teleportPlayer(player(playerIndex + 1n), [16, 0, 16], [0, 0, 0])
  } else if (bool(tileIndex === 9n)) {
    f.teleportPlayer(player(playerIndex + 1n), [12, 0, 16], [0, 0, 0])
  } else if (bool(tileIndex === 10n)) {
    f.teleportPlayer(player(playerIndex + 1n), [8, 0, 16], [0, 0, 0])
  } else if (bool(tileIndex === 11n)) {
    f.teleportPlayer(player(playerIndex + 1n), [4, 0, 16], [0, 0, 0])
  } else if (bool(tileIndex === 12n)) {
    f.teleportPlayer(player(playerIndex + 1n), [0, 0, 16], [0, 0, 0])
  } else if (bool(tileIndex === 13n)) {
    f.teleportPlayer(player(playerIndex + 1n), [0, 0, 12], [0, 0, 0])
  } else if (bool(tileIndex === 14n)) {
    f.teleportPlayer(player(playerIndex + 1n), [0, 0, 8], [0, 0, 0])
  } else if (bool(tileIndex === 15n)) {
    f.teleportPlayer(player(playerIndex + 1n), [0, 0, 4], [0, 0, 0])
  } else {
    f.teleportPlayer(player(playerIndex + 1n), [0, 0, 0], [0, 0, 0])
  }
  return 0n
}

export function gstsServerMovePlayer(playerIndex: bigint, steps: bigint, f: MatchFlow) {
  const currentPosition = gstsServerGetPlayerPosition(playerIndex, f)
  const rawPosition = f.addition(currentPosition, steps)
  const nextPosition = gstsServerWrapTile(rawPosition, f)

  if (bool(f.greaterThanOrEqualTo(rawPosition, MAP_LENGTH))) {
    gstsServerAddPlayerCash(playerIndex, PASS_START_REWARD, f)
    gstsServerLogLine('[Richman6] 经过起点')
    gstsServerLogLine(str(playerIndex + 1n))
  } else if (bool(steps === 0n)) {
    gstsServerAddPlayerCash(playerIndex, STOPPED_START_BONUS, f)
  }

  gstsServerSetPlayerPosition(playerIndex, nextPosition, f)
  f.set('lastLandingTile', nextPosition)
  gstsServerPresentPlayerPosition(playerIndex, nextPosition, f)
  gstsServerLogLanding(nextPosition)
  return nextPosition
}

export function gstsServerTryBuyProperty(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  let price = gstsServerGetPropertyPrice(tileIndex)
  let bought = false
  price = f.subtraction(price, gstsServerGetBuyDiscount(playerIndex, f))
  if (bool(gstsServerGetPlayerCash(playerIndex, f) >= price)) {
    gstsServerAddPlayerCash(playerIndex, f.subtraction(0n, price), f)
    gstsServerSetPropertyOwner(tileIndex, playerIndex, f)
    gstsServerSetPropertyLevel(tileIndex, 1n, f)
    gstsServerLogLine('[Richman6] 购入地产')
    gstsServerLogLine(str(playerIndex + 1n))
    bought = true
  }
  return bought
}

export function gstsServerTryUpgradeProperty(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  const currentLevel = gstsServerGetPropertyLevel(tileIndex, f)
  let upgraded = false
  let cost = gstsServerGetUpgradeCost(tileIndex)
  if (bool(currentLevel < 2n)) {
    cost = f.subtraction(cost, gstsServerGetUpgradeDiscount(playerIndex, f))
    if (bool(gstsServerGetPlayerCash(playerIndex, f) >= cost)) {
      gstsServerAddPlayerCash(playerIndex, f.subtraction(0n, cost), f)
      gstsServerSetPropertyLevel(tileIndex, f.addition(currentLevel, 1n), f)
      gstsServerLogLine('[Richman6] 升级地产')
      gstsServerLogLine(str(playerIndex + 1n))
      upgraded = true
    }
  }
  return upgraded
}

export function gstsServerTryPayRent(playerIndex: bigint, ownerId: bigint, tileIndex: bigint, f: MatchFlow) {
  let shouldCollect = true
  if (bool(f.get('sealedPropertyIndex') === tileIndex) && bool(f.get('sealedRoundsLeft') > 0n)) {
    gstsServerLogLine('[Richman6] 该地产处于封盘状态，本次不收费')
    shouldCollect = false
  }
  if (bool(shouldCollect) && bool(gstsServerShouldWaiveRent(playerIndex, f))) {
    gstsServerLogLine('[Richman6] 差旅补贴免除了本次租金')
    shouldCollect = false
  }
  if (bool(shouldCollect)) {
    const level = gstsServerGetPropertyLevel(tileIndex, f)
    const rent = gstsServerGetRentForProperty(tileIndex, level, playerIndex, f)
    gstsServerAddPlayerCash(playerIndex, f.subtraction(0n, rent), f)
    gstsServerAddPlayerCash(ownerId, rent, f)
    gstsServerLogLine('[Richman6] 已完成租金结算')
  }
  return 0n
}

export function gstsServerResolveTrap(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  if (bool(tileIndex === f.get('trapTile'))) {
    if (bool(gstsServerTryBlockAttackWithShield(playerIndex, f) === false)) {
      gstsServerAddPlayerCash(playerIndex, f.subtraction(0n, TRAP_PENALTY), f)
      gstsServerLogLine('[Richman6] 触发延时陷阱')
    }
    f.set('trapTile', -1n)
    f.set('trapOwner', -1n)
  }
  return 0n
}

export function gstsServerResolveEconomyTile(playerIndex: bigint, tileType: bigint, f: MatchFlow) {
  if (bool(tileType === TILE_REWARD)) {
    gstsServerAddPlayerCash(playerIndex, gstsServerGetAdjustedReward(REWARD_TILE_CASH, playerIndex, f), f)
    gstsServerLogLine('[Richman6] 获得奖励格收益')
  } else if (bool(tileType === TILE_EVENT)) {
    gstsServerAddPlayerCash(playerIndex, gstsServerGetAdjustedReward(EVENT_TILE_CASH, playerIndex, f), f)
    gstsServerAddPlayerCoupons(playerIndex, EVENT_TILE_COUPON, f)
    gstsServerLogLine('[Richman6] 触发事件格收益')
  } else if (bool(tileType === TILE_SHOP)) {
    gstsServerAddPlayerCoupons(playerIndex, SHOP_TILE_COUPON, f)
    gstsServerLogLine('[Richman6] 商店格提供点券')
  } else if (bool(tileType === TILE_START)) {
    gstsServerAddPlayerCash(playerIndex, gstsServerGetAdjustedReward(80n, playerIndex, f), f)
    gstsServerLogLine('[Richman6] 停留起点获得收益')
  }
  return 0n
}

export function gstsServerResolveLanding(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  gstsServerResolveTrap(playerIndex, tileIndex, f)
  const tileType = gstsServerGetTileType(tileIndex)

  if (bool(tileType === TILE_PROPERTY)) {
    const ownerId = gstsServerGetPropertyOwner(tileIndex, f)
    if (bool(ownerId < 0n)) {
      gstsServerTryBuyProperty(playerIndex, tileIndex, f)
    } else if (bool(ownerId === playerIndex)) {
      gstsServerTryUpgradeProperty(playerIndex, tileIndex, f)
    } else {
      gstsServerTryPayRent(playerIndex, ownerId, tileIndex, f)
    }
  } else {
    gstsServerResolveEconomyTile(playerIndex, tileType, f)
  }

  const coupons = gstsServerGetPlayerCoupons(playerIndex, f)
  gstsServerLogSnapshot(
    playerIndex,
    gstsServerGetPlayerCash(playerIndex, f),
    coupons,
    tileIndex
  )
  return 0n
}

export function gstsServerGetTotalAssets(playerIndex: bigint, f: MatchFlow) {
  const coupons = gstsServerGetPlayerCoupons(playerIndex, f)
  let total = f.addition(
    gstsServerGetPlayerCash(playerIndex, f),
    f.multiplication(coupons, 100n)
  )
  let cursor = 0n
  while (bool(cursor < MAP_LENGTH)) {
    if (bool(gstsServerGetPropertyOwner(cursor, f) === playerIndex)) {
      total = f.addition(total, gstsServerGetPropertyPrice(cursor))
      if (bool(gstsServerGetPropertyLevel(cursor, f) >= 2n)) {
        total = f.addition(total, PROPERTY_UPGRADE_COST_LEVEL_1)
      }
    }
    cursor = cursor + 1n
  }
  return total
}
