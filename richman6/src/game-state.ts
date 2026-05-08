import type { ServerExecutionFlowFunctionsWithVars } from 'genshin-ts/runtime/core'

import {
  COMPANION_TRIGGER_ENERGY,
  EMPTY_PROPERTY_LEVELS,
  EMPTY_PROPERTY_OWNERS,
  HAND_SIZE,
  INITIAL_PLAYER_0_HAND,
  INITIAL_PLAYER_1_HAND,
  START_CASH,
  START_COUPONS
} from './config'

export const MATCH_VARIABLES = {
  gameStarted: false,
  gameOver: false,
  currentPlayer: 0n,
  currentRound: 1n,
  currentDice: 0n,
  currentPhase: 'idle',
  winnerId: -1n,
  lastLandingTile: 0n,
  turnLoopTimer: '',
  player0Cash: START_CASH,
  player1Cash: START_CASH,
  player0Coupons: START_COUPONS,
  player1Coupons: START_COUPONS,
  player0Position: 0n,
  player1Position: 0n,
  player0StopTurns: 0n,
  player1StopTurns: 0n,
  player0ImmuneTurns: 0n,
  player1ImmuneTurns: 0n,
  player0WeakenTurns: 0n,
  player1WeakenTurns: 0n,
  player0RoleUsed: false,
  player1RoleUsed: false,
  player0CompanionEnergy: 0n,
  player1CompanionEnergy: 0n,
  player0Hand: INITIAL_PLAYER_0_HAND,
  player1Hand: INITIAL_PLAYER_1_HAND,
  propertyOwners: list('int', EMPTY_PROPERTY_OWNERS),
  propertyLevels: list('int', EMPTY_PROPERTY_LEVELS),
  trapTile: -1n,
  trapOwner: -1n,
  sealedPropertyIndex: -1n,
  sealedRoundsLeft: 0n,
  prototypeIssueFlags: list('str', ['', '', '', '', '', '']),
  handLoopCap: HAND_SIZE,
  companionThreshold: COMPANION_TRIGGER_ENERGY
}

export type MatchFlow = ServerExecutionFlowFunctionsWithVars<typeof MATCH_VARIABLES, 'beyond'>

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
  if (bool(playerIndex === 0n)) {
    f.set('player0Position', nextValue)
  } else {
    f.set('player1Position', nextValue)
  }
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

export function gstsServerGetPropertyOwner(tileIndex: bigint, f: MatchFlow) {
  return f.get('propertyOwners')[idx(tileIndex)]
}

export function gstsServerSetPropertyOwner(tileIndex: bigint, ownerId: bigint, f: MatchFlow) {
  const owners = f.get('propertyOwners')
  owners[idx(tileIndex)] = ownerId
  f.set('propertyOwners', owners)
  return 0n
}

export function gstsServerGetPropertyLevel(tileIndex: bigint, f: MatchFlow) {
  return f.get('propertyLevels')[idx(tileIndex)]
}

export function gstsServerSetPropertyLevel(tileIndex: bigint, level: bigint, f: MatchFlow) {
  const levels = f.get('propertyLevels')
  levels[idx(tileIndex)] = level
  f.set('propertyLevels', levels)
  return 0n
}
