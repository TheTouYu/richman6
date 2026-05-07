import type { ServerExecutionFlowFunctionsWithVars } from 'genshin-ts/runtime/core'

import {
  BUY_DISCOUNT_BY_CARD,
  EVENT_CASH_REWARD,
  MAP_LENGTH,
  MAX_ROUNDS,
  PASS_START_REWARD,
  PROPERTY_UPGRADE_COST_LEVEL_1,
  PROPERTY_UPGRADE_COST_LEVEL_2,
  REWARD_TILE_CASH,
  SHOP_TILE_COUPON,
  TILE_EVENT,
  TILE_PROPERTY,
  TILE_REWARD,
  TILE_SHOP,
  TILE_START,
  TRAP_PENALTY,
  UPGRADE_DISCOUNT_BY_CARD
} from './config'
import {
  gstsServerGetPropertyBaseRent,
  gstsServerGetPropertyPrice,
  gstsServerGetTileType
} from './map'

export const MATCH_VARIABLES = {
  gameStarted: false,
  gameOver: false,
  currentPlayer: 0n,
  currentRound: 1n,
  currentDice: 0n,
  winnerId: -1n,
  player0Cash: 2000n,
  player1Cash: 2000n,
  player0Coupons: 3n,
  player1Coupons: 3n,
  player0Position: 0n,
  player1Position: 0n,
  playerAlive: [true, true],
  propertyOwners: list('int', new Array(32)),
  propertyLevels: list('int', new Array(32)),
  player0Hand: ['MV-03', 'PR-01', 'PR-03', 'ST-01', 'BL-01'],
  player1Hand: ['MV-01', 'MV-05', 'PR-01', 'PR-03', 'ST-02', 'PR-06'],
  trapTile: -1n,
  trapOwner: -1n,
  sealedPropertyIndex: -1n,
  sealedRoundsLeft: 0n
}

export type MatchFlow = ServerExecutionFlowFunctionsWithVars<typeof MATCH_VARIABLES, 'beyond'>

export function gstsServerLogLine(message: string) {
  print(str(message))
  return 0n
}

export function gstsServerGetOpponent(playerIndex: bigint) {
  let opponent = 0n
  if (bool(playerIndex === 0n)) {
    opponent = 1n
  }
  return opponent
}

export function gstsServerGetPlayerCash(playerIndex: bigint, f: MatchFlow) {
  let value = f.get('player1Cash')
  if (bool(playerIndex === 0n)) {
    value = f.get('player0Cash')
  }
  return value
}

export function gstsServerSetPlayerCash(playerIndex: bigint, nextValue: bigint, f: MatchFlow) {
  if (bool(playerIndex === 0n)) {
    f.set('player0Cash', nextValue)
  } else {
    f.set('player1Cash', nextValue)
  }
  return 0n
}

export function gstsServerAddPlayerCash(playerIndex: bigint, delta: bigint, f: MatchFlow) {
  const currentValue = gstsServerGetPlayerCash(playerIndex, f)
  const nextValue = f.addition(currentValue, delta)
  gstsServerSetPlayerCash(playerIndex, nextValue, f)
  return nextValue
}

export function gstsServerGetPlayerCoupons(playerIndex: bigint, f: MatchFlow) {
  let value = f.get('player1Coupons')
  if (bool(playerIndex === 0n)) {
    value = f.get('player0Coupons')
  }
  return value
}

export function gstsServerSetPlayerCoupons(playerIndex: bigint, nextValue: bigint, f: MatchFlow) {
  if (bool(playerIndex === 0n)) {
    f.set('player0Coupons', nextValue)
  } else {
    f.set('player1Coupons', nextValue)
  }
  return 0n
}

export function gstsServerAddPlayerCoupons(playerIndex: bigint, delta: bigint, f: MatchFlow) {
  const currentValue = gstsServerGetPlayerCoupons(playerIndex, f)
  const nextValue = f.addition(currentValue, delta)
  gstsServerSetPlayerCoupons(playerIndex, nextValue, f)
  return nextValue
}

export function gstsServerGetPlayerPosition(playerIndex: bigint, f: MatchFlow) {
  let value = f.get('player1Position')
  if (bool(playerIndex === 0n)) {
    value = f.get('player0Position')
  }
  return value
}

export function gstsServerSetPlayerPosition(playerIndex: bigint, nextValue: bigint, f: MatchFlow) {
  let wrappedValue = nextValue
  if (bool(f.greaterThanOrEqualTo(nextValue, MAP_LENGTH))) {
    wrappedValue = f.subtraction(nextValue, MAP_LENGTH)
  }
  if (bool(f.lessThan(wrappedValue, 0n))) {
    wrappedValue = f.addition(wrappedValue, MAP_LENGTH)
  }
  if (bool(playerIndex === 0n)) {
    f.set('player0Position', wrappedValue)
  } else {
    f.set('player1Position', wrappedValue)
  }
  return 0n
}

export function gstsServerGetPropertyOwner(tileIndex: bigint, f: MatchFlow) {
  const value = f.get('propertyOwners')[idx(tileIndex)]
  return value
}

export function gstsServerSetPropertyOwner(tileIndex: bigint, ownerId: bigint, f: MatchFlow) {
  const values = f.get('propertyOwners')
  values[idx(tileIndex)] = ownerId
  f.set('propertyOwners', values)
  return 0n
}

export function gstsServerGetPropertyLevel(tileIndex: bigint, f: MatchFlow) {
  const value = f.get('propertyLevels')[idx(tileIndex)]
  return value
}

export function gstsServerSetPropertyLevel(tileIndex: bigint, nextLevel: bigint, f: MatchFlow) {
  const values = f.get('propertyLevels')
  values[idx(tileIndex)] = nextLevel
  f.set('propertyLevels', values)
  return 0n
}

export function gstsServerGetPlayerHand(playerIndex: bigint, f: MatchFlow) {
  let hand = f.get('player1Hand')
  if (bool(playerIndex === 0n)) {
    hand = f.get('player0Hand')
  }
  return hand
}

export function gstsServerSetPlayerHand(playerIndex: bigint, hand: string[], f: MatchFlow) {
  if (bool(playerIndex === 0n)) {
    f.set('player0Hand', hand)
  } else {
    f.set('player1Hand', hand)
  }
  return 0n
}

export function gstsServerHasCard(playerIndex: bigint, cardId: string, f: MatchFlow) {
  const hand = gstsServerGetPlayerHand(playerIndex, f)
  let found = false
  let cursor = 0n
  while (bool(cursor < 8n)) {
    const slot = hand[idx(cursor)]
    if (bool(slot === cardId)) {
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
  while (bool(cursor < 8n)) {
    const slot = hand[idx(cursor)]
    if (bool(consumed === false && slot === cardId)) {
      hand[idx(cursor)] = ''
      consumed = true
    }
    cursor = cursor + 1n
  }
  gstsServerSetPlayerHand(playerIndex, hand, f)
  return consumed
}

export function gstsServerGetUpgradeCost(currentLevel: bigint) {
  let cost = PROPERTY_UPGRADE_COST_LEVEL_2
  if (bool(currentLevel <= 1n)) {
    cost = PROPERTY_UPGRADE_COST_LEVEL_1
  }
  return cost
}

export function gstsServerGetRentForProperty(tileIndex: bigint, level: bigint) {
  const baseRent = gstsServerGetPropertyBaseRent(tileIndex)
  let rent = baseRent
  if (bool(level >= 2n)) {
    rent = baseRent * 2n
  }
  return rent
}

export function gstsServerIsPropertySealed(tileIndex: bigint, f: MatchFlow) {
  return bool(f.get('sealedPropertyIndex') === tileIndex) && bool(f.get('sealedRoundsLeft') > 0n)
}

export function gstsServerApplyShieldIfPossible(playerIndex: bigint, f: MatchFlow) {
  let blocked = false
  if (bool(gstsServerHasCard(playerIndex, 'ST-02', f))) {
    gstsServerConsumeCard(playerIndex, 'ST-02', f)
    gstsServerLogLine('[Richman6] 紧急护盾生效')
    blocked = true
  }
  return blocked
}

export function gstsServerMarkBankruptIfNeeded(playerIndex: bigint, f: MatchFlow) {
  if (bool(gstsServerGetPlayerCash(playerIndex, f) < 0n)) {
    const alive = f.get('playerAlive')
    alive[idx(playerIndex)] = false
    f.set('playerAlive', alive)
    f.set('gameOver', true)
    f.set('winnerId', gstsServerGetOpponent(playerIndex))
    gstsServerLogLine('[Richman6] 有玩家破产，游戏结束')
  }
  return 0n
}

export function gstsServerGetTotalAssets(playerIndex: bigint, f: MatchFlow) {
  let totalAssets = f.addition(
    gstsServerGetPlayerCash(playerIndex, f),
    f.multiplication(gstsServerGetPlayerCoupons(playerIndex, f), 100n)
  )
  let cursor = 0n
  const owners = f.get('propertyOwners')
  const levels = f.get('propertyLevels')
  while (bool(cursor < MAP_LENGTH)) {
    if (bool(owners[idx(cursor)] === playerIndex)) {
      totalAssets = f.addition(totalAssets, gstsServerGetPropertyPrice(cursor))
      if (bool(levels[idx(cursor)] >= 2n)) {
        totalAssets = f.addition(totalAssets, PROPERTY_UPGRADE_COST_LEVEL_1)
      }
    }
    cursor = cursor + 1n
  }
  return totalAssets
}

export function gstsServerFinalizeByAssets(f: MatchFlow) {
  const player0Assets = gstsServerGetTotalAssets(0n, f)
  const player1Assets = gstsServerGetTotalAssets(1n, f)
  let winnerId = 0n
  if (bool(player1Assets > player0Assets)) {
    winnerId = 1n
  }
  f.set('winnerId', winnerId)
  f.set('gameOver', true)
  gstsServerLogLine('[Richman6] 达到回合上限，已按总资产结算')
  return 0n
}

export function gstsServerInitializeMatch(f: MatchFlow) {
  f.set('gameStarted', true)
  f.set('gameOver', false)
  f.set('currentPlayer', 0n)
  f.set('currentRound', 1n)
  f.set('currentDice', 0n)
  f.set('winnerId', -1n)
  f.set('trapTile', -1n)
  f.set('trapOwner', -1n)
  f.set('sealedPropertyIndex', -1n)
  f.set('sealedRoundsLeft', 0n)
  gstsServerLogLine('[Richman6] MVP 对局初始化完成')
  return 0n
}

export function gstsServerPlanPreRollCard(playerIndex: bigint, f: MatchFlow) {
  let forcedDice = 0n
  if (bool(gstsServerHasCard(playerIndex, 'MV-03', f))) {
    const currentPosition = gstsServerGetPlayerPosition(playerIndex, f)
    let probe = 1n
    while (bool(probe <= 6n)) {
      let probeTile = f.addition(currentPosition, probe)
      if (bool(f.greaterThanOrEqualTo(probeTile, MAP_LENGTH))) {
        probeTile = f.subtraction(probeTile, MAP_LENGTH)
      }
      if (
        bool(gstsServerGetTileType(probeTile) === TILE_PROPERTY) &&
        bool(gstsServerGetPropertyOwner(probeTile, f) < 0n)
      ) {
        gstsServerConsumeCard(playerIndex, 'MV-03', f)
        gstsServerLogLine('[Richman6] 已使用遥控骰')
        forcedDice = probe
      }
      probe = probe + 1n
    }
  }
  return forcedDice
}

export function gstsServerRollDice(playerIndex: bigint, f: MatchFlow) {
  let dice = Random.Range(1n, 7n)
  const forcedDice = gstsServerPlanPreRollCard(playerIndex, f)
  if (bool(forcedDice > 0n)) {
    dice = forcedDice
  }
  f.set('currentDice', dice)
  return dice
}

export function gstsServerTryStopOnDanger(playerIndex: bigint, steps: bigint, f: MatchFlow) {
  let nextSteps = steps
  const currentPosition = gstsServerGetPlayerPosition(playerIndex, f)
  let plannedTile = f.addition(currentPosition, steps)
  if (bool(f.greaterThanOrEqualTo(plannedTile, MAP_LENGTH))) {
    plannedTile = f.subtraction(plannedTile, MAP_LENGTH)
  }
  const plannedOwner = gstsServerGetPropertyOwner(plannedTile, f)
  const plannedLevel = gstsServerGetPropertyLevel(plannedTile, f)
  if (
    bool(gstsServerHasCard(playerIndex, 'MV-05', f)) &&
    bool(gstsServerGetTileType(plannedTile) === TILE_PROPERTY) &&
    bool(plannedOwner >= 0n) &&
    bool(plannedOwner !== playerIndex) &&
    bool(plannedLevel >= 2n)
  ) {
    gstsServerConsumeCard(playerIndex, 'MV-05', f)
    gstsServerLogLine('[Richman6] 已使用定点驻足')
    nextSteps = 0n
  }
  return nextSteps
}

export function gstsServerTryAddOneStep(playerIndex: bigint, steps: bigint, f: MatchFlow) {
  let nextSteps = steps
  if (bool(nextSteps > 0n) && bool(gstsServerHasCard(playerIndex, 'MV-01', f))) {
    gstsServerConsumeCard(playerIndex, 'MV-01', f)
    gstsServerLogLine('[Richman6] 已使用微步推进')
    nextSteps = f.addition(nextSteps, 1n)
  }
  return nextSteps
}

export function gstsServerTryAddTwoSteps(playerIndex: bigint, steps: bigint, f: MatchFlow) {
  let nextSteps = steps
  if (bool(nextSteps > 0n) && bool(gstsServerHasCard(playerIndex, 'MV-02', f))) {
    gstsServerConsumeCard(playerIndex, 'MV-02', f)
    gstsServerLogLine('[Richman6] 已使用双冲刺')
    nextSteps = f.addition(nextSteps, 2n)
  }
  return nextSteps
}

export function gstsServerPlanAfterRollMovement(playerIndex: bigint, dice: bigint, f: MatchFlow) {
  let steps = dice
  steps = gstsServerTryStopOnDanger(playerIndex, steps, f)
  steps = gstsServerTryAddOneStep(playerIndex, steps, f)
  if (bool(steps === dice) || bool(steps > dice)) {
    steps = gstsServerTryAddTwoSteps(playerIndex, steps, f)
  }
  return steps
}

export function gstsServerMovePlayer(playerIndex: bigint, steps: bigint, f: MatchFlow) {
  const currentPosition = gstsServerGetPlayerPosition(playerIndex, f)
  const rawPosition = f.addition(currentPosition, steps)
  let nextPosition = rawPosition
  if (bool(f.greaterThanOrEqualTo(rawPosition, MAP_LENGTH))) {
    nextPosition = f.subtraction(rawPosition, MAP_LENGTH)
  }
  if (bool(rawPosition >= MAP_LENGTH)) {
    gstsServerAddPlayerCash(playerIndex, PASS_START_REWARD, f)
    gstsServerLogLine('[Richman6] 经过起点并获得奖励')
  }
  gstsServerSetPlayerPosition(playerIndex, nextPosition, f)
  gstsServerLogLine('[Richman6] 已完成本次移动')
  return nextPosition
}

export function gstsServerResolveTrap(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  if (bool(tileIndex === f.get('trapTile'))) {
    if (bool(gstsServerApplyShieldIfPossible(playerIndex, f) === false)) {
      gstsServerAddPlayerCash(playerIndex, -TRAP_PENALTY, f)
      gstsServerLogLine('[Richman6] 踩中延时陷阱')
      gstsServerMarkBankruptIfNeeded(playerIndex, f)
    }
    f.set('trapTile', -1n)
    f.set('trapOwner', -1n)
  }
  return 0n
}

export function gstsServerTryBuyProperty(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  let price = gstsServerGetPropertyPrice(tileIndex)
  let bought = false
  if (bool(gstsServerHasCard(playerIndex, 'PR-01', f))) {
    price = price - BUY_DISCOUNT_BY_CARD
    gstsServerConsumeCard(playerIndex, 'PR-01', f)
    gstsServerLogLine('[Richman6] 已使用快速签约')
  }
  if (bool(gstsServerGetPlayerCash(playerIndex, f) >= price)) {
    gstsServerAddPlayerCash(playerIndex, -price, f)
    gstsServerSetPropertyOwner(tileIndex, playerIndex, f)
    gstsServerSetPropertyLevel(tileIndex, 1n, f)
    gstsServerLogLine('[Richman6] 已购入地产')
    bought = true
  }
  return bought
}

export function gstsServerTryUpgradeProperty(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  const level = gstsServerGetPropertyLevel(tileIndex, f)
  let upgraded = false
  if (bool(level < 2n)) {
    let cost = gstsServerGetUpgradeCost(level)
    if (bool(gstsServerHasCard(playerIndex, 'PR-03', f))) {
      cost = f.subtraction(cost, UPGRADE_DISCOUNT_BY_CARD)
      gstsServerConsumeCard(playerIndex, 'PR-03', f)
      gstsServerLogLine('[Richman6] 已使用施工许可')
    }
    if (bool(gstsServerGetPlayerCash(playerIndex, f) >= cost)) {
      gstsServerAddPlayerCash(playerIndex, -cost, f)
      gstsServerSetPropertyLevel(tileIndex, f.addition(level, 1n), f)
      gstsServerLogLine('[Richman6] 已升级地产')
      upgraded = true
    }
  }
  return upgraded
}

export function gstsServerTryPayRent(
  playerIndex: bigint,
  ownerId: bigint,
  tileIndex: bigint,
  f: MatchFlow
) {
  let settled = true
  if (bool(gstsServerIsPropertySealed(tileIndex, f))) {
    gstsServerLogLine('[Richman6] 地产处于封盘中，本次不收费')
  } else if (bool(gstsServerHasCard(playerIndex, 'ST-01', f))) {
    gstsServerConsumeCard(playerIndex, 'ST-01', f)
    gstsServerLogLine('[Richman6] 已使用差旅补贴')
  } else {
    const rent = gstsServerGetRentForProperty(tileIndex, gstsServerGetPropertyLevel(tileIndex, f))
    gstsServerAddPlayerCash(playerIndex, -rent, f)
    gstsServerAddPlayerCash(ownerId, rent, f)
    gstsServerLogLine('[Richman6] 已完成租金结算')
    gstsServerMarkBankruptIfNeeded(playerIndex, f)
  }
  return settled
}

export function gstsServerResolveEconomyTile(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  const tileType = gstsServerGetTileType(tileIndex)
  if (bool(tileType === TILE_REWARD)) {
    gstsServerAddPlayerCash(playerIndex, REWARD_TILE_CASH, f)
    gstsServerLogLine('[Richman6] 进入奖励格')
  } else if (bool(tileType === TILE_EVENT)) {
    gstsServerAddPlayerCash(playerIndex, EVENT_CASH_REWARD, f)
    gstsServerAddPlayerCoupons(playerIndex, 1n, f)
    gstsServerLogLine('[Richman6] 触发事件格')
  } else if (bool(tileType === TILE_SHOP)) {
    gstsServerAddPlayerCoupons(playerIndex, SHOP_TILE_COUPON, f)
    gstsServerLogLine('[Richman6] 进入商店格')
  } else if (bool(tileType === TILE_START)) {
    gstsServerAddPlayerCash(playerIndex, 100n, f)
    gstsServerLogLine('[Richman6] 停在起点')
  }
  return 0n
}

export function gstsServerFindFirstOwnedProperty(ownerId: bigint, f: MatchFlow) {
  let cursor = 0n
  const owners = f.get('propertyOwners')
  let found = -1n
  while (bool(cursor < MAP_LENGTH)) {
    if (bool(found < 0n) && bool(owners[idx(cursor)] === ownerId)) {
      found = cursor
    }
    cursor = cursor + 1n
  }
  return found
}

export function gstsServerApplyAfterLandCards(playerIndex: bigint, f: MatchFlow) {
  const opponent = gstsServerGetOpponent(playerIndex)
  if (bool(gstsServerHasCard(playerIndex, 'BL-01', f))) {
    let trapTile = f.addition(gstsServerGetPlayerPosition(opponent, f), 3n)
    if (bool(f.greaterThanOrEqualTo(trapTile, MAP_LENGTH))) {
      trapTile = f.subtraction(trapTile, MAP_LENGTH)
    }
    gstsServerConsumeCard(playerIndex, 'BL-01', f)
    f.set('trapTile', trapTile)
    f.set('trapOwner', playerIndex)
    gstsServerLogLine('[Richman6] 已布置延时陷阱')
  }
  if (bool(gstsServerHasCard(playerIndex, 'PR-06', f))) {
    const targetProperty = gstsServerFindFirstOwnedProperty(opponent, f)
    if (
      bool(targetProperty >= 0n) &&
      bool(gstsServerApplyShieldIfPossible(opponent, f) === false)
    ) {
      gstsServerConsumeCard(playerIndex, 'PR-06', f)
      f.set('sealedPropertyIndex', targetProperty)
      f.set('sealedRoundsLeft', 1n)
      gstsServerLogLine('[Richman6] 已使用临时封盘')
    }
  }
  return 0n
}

export function gstsServerResolveLanding(playerIndex: bigint, tileIndex: bigint, f: MatchFlow) {
  let shouldContinue = true
  gstsServerResolveTrap(playerIndex, tileIndex, f)
  if (bool(f.get('gameOver'))) {
    shouldContinue = false
  }
  if (bool(shouldContinue) && bool(gstsServerGetTileType(tileIndex) === TILE_PROPERTY)) {
    const ownerId = gstsServerGetPropertyOwner(tileIndex, f)
    if (bool(ownerId < 0n)) {
      gstsServerTryBuyProperty(playerIndex, tileIndex, f)
    } else if (bool(ownerId === playerIndex)) {
      gstsServerTryUpgradeProperty(playerIndex, tileIndex, f)
    } else {
      gstsServerTryPayRent(playerIndex, ownerId, tileIndex, f)
    }
  } else if (bool(shouldContinue)) {
    gstsServerResolveEconomyTile(playerIndex, tileIndex, f)
  }
  if (bool(f.get('gameOver') === false)) {
    gstsServerApplyAfterLandCards(playerIndex, f)
  }
  return 0n
}

export function gstsServerAdvanceRoundState(previousPlayer: bigint, f: MatchFlow) {
  const nextPlayer = gstsServerGetOpponent(previousPlayer)
  const currentRound = f.get('currentRound')
  const sealedRoundsLeft = f.get('sealedRoundsLeft')
  f.set('currentPlayer', nextPlayer)
  if (bool(nextPlayer === 0n)) {
    f.set('currentRound', currentRound + 1n)
  }
  if (bool(sealedRoundsLeft > 0n)) {
    f.set('sealedRoundsLeft', sealedRoundsLeft - 1n)
  }
  if (bool(f.get('sealedRoundsLeft') === 0n)) {
    f.set('sealedPropertyIndex', -1n)
  }
  return 0n
}

export function gstsServerCheckWinCondition(f: MatchFlow) {
  if (bool(f.get('currentRound') > MAX_ROUNDS) && bool(f.get('gameOver') === false)) {
    gstsServerFinalizeByAssets(f)
  }
  return 0n
}

export function gstsServerRunTurn(f: MatchFlow) {
  let shouldRun = true
  if (bool(f.get('gameOver'))) {
    gstsServerLogLine('[Richman6] 游戏已结束')
    shouldRun = false
  }
  if (bool(shouldRun)) {
    const playerIndex = f.get('currentPlayer')
    gstsServerLogLine('[Richman6] 开始新的回合')
    const dice = gstsServerRollDice(playerIndex, f)
    const steps = gstsServerPlanAfterRollMovement(playerIndex, dice, f)
    const tileIndex = gstsServerMovePlayer(playerIndex, steps, f)
    gstsServerResolveLanding(playerIndex, tileIndex, f)
    gstsServerCheckWinCondition(f)
    if (bool(f.get('gameOver') === false)) {
      gstsServerAdvanceRoundState(playerIndex, f)
    }
  }
  return 0n
}
