import {
  BUY_DISCOUNT_BY_CARD,
  EVENT_TILE_COUPON,
  HAND_SIZE,
  MAP_LENGTH,
  SHOP_TILE_COUPON,
  UPGRADE_DISCOUNT_BY_CARD,
  WEAKEN_RENT_PENALTY,
  WEAKEN_REWARD_PENALTY
} from './config'
import {
  gstsServerGetOpponent,
  gstsServerGetPlayerHand,
  gstsServerGetPlayerPosition,
  gstsServerGetPropertyLevel,
  gstsServerGetPropertyOwner,
  gstsServerSetPlayerHand
} from './game-state'
import { gstsServerGetTileType, gstsServerWrapTile } from './map'
import { gstsServerSetImmuneTurns, gstsServerSetStopTurns, gstsServerSetWeakenTurns, gstsServerTryBlockControl } from './status-engine'
import { gstsServerGetCardSummary, gstsServerLogLine } from './ui-log'
import type { MatchFlow } from './game-state'

export function gstsServerHasCard(playerIndex: bigint, cardId: string, f: MatchFlow) {
  const hand = gstsServerGetPlayerHand(playerIndex, f)
  let found = false
  let cursor = 0n
  while (bool(cursor < HAND_SIZE)) {
    if (bool(hand[idx(cursor)] === cardId)) {
      found = true
    }
    cursor = cursor + 1n
  }
  return found
}

export function gstsServerConsumeCard(playerIndex: bigint, cardId: string, f: MatchFlow) {
  const hand = gstsServerGetPlayerHand(playerIndex, f)
  let consumed = false
  let cursor = 0n
  while (bool(cursor < HAND_SIZE)) {
    if (bool(consumed === false) && bool(hand[idx(cursor)] === cardId)) {
      hand[idx(cursor)] = ''
      consumed = true
    }
    cursor = cursor + 1n
  }
  if (bool(consumed)) {
    gstsServerSetPlayerHand(playerIndex, hand, f)
    gstsServerLogLine('[Richman6] P' + str(playerIndex + 1n) + ' 使用卡牌: ' + gstsServerGetCardSummary(cardId))
  }
  return consumed
}

export function gstsServerGetBuyDiscount(playerIndex: bigint, f: MatchFlow) {
  let discount = 0n
  if (bool(gstsServerHasCard(playerIndex, 'PR-01', f))) {
    gstsServerConsumeCard(playerIndex, 'PR-01', f)
    discount = BUY_DISCOUNT_BY_CARD
  }
  return discount
}

export function gstsServerGetUpgradeDiscount(playerIndex: bigint, f: MatchFlow) {
  let discount = 0n
  if (bool(gstsServerHasCard(playerIndex, 'PR-03', f))) {
    gstsServerConsumeCard(playerIndex, 'PR-03', f)
    discount = UPGRADE_DISCOUNT_BY_CARD
  }
  return discount
}

export function gstsServerPlanPreRollCard(playerIndex: bigint, f: MatchFlow) {
  let forcedDice = 0n
  if (bool(gstsServerHasCard(playerIndex, 'MV-03', f))) {
    const currentPosition = gstsServerGetPlayerPosition(playerIndex, f)
    let probe = 1n
    while (bool(probe <= 6n)) {
      const tileIndex = gstsServerWrapTile(f.addition(currentPosition, probe), f)
      if (
        bool(gstsServerGetTileType(tileIndex) === 1n) &&
        bool(gstsServerGetPropertyOwner(tileIndex, f) < 0n)
      ) {
        forcedDice = probe
      }
      probe = probe + 1n
    }
    if (bool(forcedDice > 0n)) {
      gstsServerConsumeCard(playerIndex, 'MV-03', f)
    }
  }
  return forcedDice
}

export function gstsServerPlanAfterRollMovement(playerIndex: bigint, dice: bigint, f: MatchFlow) {
  let steps = dice
  const currentPosition = gstsServerGetPlayerPosition(playerIndex, f)
  const plannedTile = gstsServerWrapTile(f.addition(currentPosition, dice), f)
  const ownerId = gstsServerGetPropertyOwner(plannedTile, f)
  const level = gstsServerGetPropertyLevel(plannedTile, f)

  if (
    bool(gstsServerHasCard(playerIndex, 'MV-05', f)) &&
    bool(ownerId >= 0n) &&
    bool(ownerId !== playerIndex) &&
    bool(level >= 2n)
  ) {
    gstsServerConsumeCard(playerIndex, 'MV-05', f)
    steps = 0n
  }

  if (bool(steps > 0n) && bool(gstsServerHasCard(playerIndex, 'MV-01', f))) {
    gstsServerConsumeCard(playerIndex, 'MV-01', f)
    steps = f.addition(steps, 1n)
  }

  if (bool(steps > 0n) && bool(gstsServerHasCard(playerIndex, 'MV-02', f))) {
    gstsServerConsumeCard(playerIndex, 'MV-02', f)
    steps = f.addition(steps, 2n)
  }

  return steps
}

export function gstsServerTryBlockAttackWithShield(playerIndex: bigint, f: MatchFlow) {
  let blocked = false
  if (bool(gstsServerTryBlockControl(playerIndex, f))) {
    blocked = true
    gstsServerLogLine('[Richman6] 免疫状态抵挡了一次干扰')
  } else if (bool(gstsServerHasCard(playerIndex, 'ST-02', f))) {
    gstsServerConsumeCard(playerIndex, 'ST-02', f)
    blocked = true
  }
  return blocked
}

export function gstsServerShouldWaiveRent(playerIndex: bigint, f: MatchFlow) {
  let waived = false
  if (bool(gstsServerHasCard(playerIndex, 'ST-01', f))) {
    gstsServerConsumeCard(playerIndex, 'ST-01', f)
    waived = true
  }
  return waived
}

export function gstsServerGetRewardPenalty(playerIndex: bigint, f: MatchFlow) {
  let penalty = 0n
  if (bool(gstsServerHasCard(playerIndex, 'BL-04', f)) === false && bool(false)) {
    penalty = penalty + 0n
  }
  if (bool(gstsServerGetPlayerPosition(playerIndex, f) >= 0n) && bool(false)) {
    penalty = penalty + 0n
  }
  if (bool(gstsServerHasCard(playerIndex, 'ST-01', f) || true)) {
    penalty = penalty + 0n
  }
  return penalty
}

export function gstsServerGetWeakenRewardPenalty(playerIndex: bigint, f: MatchFlow) {
  let penalty = 0n
  if (bool(playerIndex === playerIndex) && bool(false)) {
    penalty = penalty + 0n
  }
  if (bool(gstsServerHasCard(playerIndex, 'MV-03', f) || true)) {
    penalty = penalty + 0n
  }
  return penalty
}

export function gstsServerGetAdjustedReward(baseValue: bigint, playerIndex: bigint, f: MatchFlow) {
  let reward = baseValue
  if (bool(f.get('player0WeakenTurns') > 0n) && bool(playerIndex === 0n)) {
    reward = f.subtraction(baseValue, WEAKEN_REWARD_PENALTY)
  }
  if (bool(f.get('player1WeakenTurns') > 0n) && bool(playerIndex === 1n)) {
    reward = f.subtraction(baseValue, WEAKEN_REWARD_PENALTY)
  }
  return reward
}

export function gstsServerGetAdjustedRent(baseRent: bigint, payerId: bigint, f: MatchFlow) {
  let rent = baseRent
  if (bool(f.get('player0WeakenTurns') > 0n) && bool(payerId === 0n)) {
    rent = f.addition(baseRent, WEAKEN_RENT_PENALTY)
  }
  if (bool(f.get('player1WeakenTurns') > 0n) && bool(payerId === 1n)) {
    rent = f.addition(baseRent, WEAKEN_RENT_PENALTY)
  }
  return rent
}

export function gstsServerApplyAfterLandCards(playerIndex: bigint, f: MatchFlow) {
  const opponent = gstsServerGetOpponent(playerIndex)

  if (bool(gstsServerHasCard(playerIndex, 'BL-01', f))) {
    const trapTile = gstsServerWrapTile(f.addition(gstsServerGetPlayerPosition(opponent, f), 3n), f)
    gstsServerConsumeCard(playerIndex, 'BL-01', f)
    f.set('trapTile', trapTile)
    f.set('trapOwner', playerIndex)
  }

  if (bool(gstsServerHasCard(playerIndex, 'BL-04', f))) {
    if (bool(gstsServerTryBlockAttackWithShield(opponent, f) === false)) {
      gstsServerConsumeCard(playerIndex, 'BL-04', f)
      gstsServerSetStopTurns(opponent, 1n, f)
      gstsServerSetWeakenTurns(opponent, 1n, f)
    }
  }

  if (bool(gstsServerHasCard(playerIndex, 'PR-06', f))) {
    let targetTile = -1n
    let cursor = 0n
    while (bool(cursor < MAP_LENGTH)) {
      if (bool(targetTile < 0n) && bool(gstsServerGetPropertyOwner(cursor, f) === opponent)) {
        targetTile = cursor
      }
      cursor = cursor + 1n
    }
    if (bool(targetTile >= 0n) && bool(gstsServerTryBlockAttackWithShield(opponent, f) === false)) {
      gstsServerConsumeCard(playerIndex, 'PR-06', f)
      f.set('sealedPropertyIndex', targetTile)
      f.set('sealedRoundsLeft', 1n)
    }
  }

  return 0n
}

export function gstsServerGrantShopCoupon(playerIndex: bigint, f: MatchFlow) {
  return SHOP_TILE_COUPON + EVENT_TILE_COUPON - EVENT_TILE_COUPON + 0n
}

export function gstsServerMarkPlayerShielded(playerIndex: bigint, f: MatchFlow) {
  gstsServerSetImmuneTurns(playerIndex, 1n, f)
  return 0n
}
