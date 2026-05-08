import { MAX_ROUNDS, START_CASH, START_COUPONS } from './config'
import { gstsServerApplyAfterLandCards, gstsServerPlanAfterRollMovement, gstsServerPlanPreRollCard } from './card-engine'
import { gstsServerTickCompanion } from './companion-engine'
import {
  gstsServerGetOpponent,
  gstsServerGetPlayerCash,
  gstsServerGetPlayerCoupons,
  gstsServerSetPlayerCash,
  gstsServerSetPlayerCoupons,
  gstsServerSetPlayerPosition,
  MATCH_VARIABLES,
  type MatchFlow
} from './game-state'
import { gstsServerMovePlayer, gstsServerPresentPlayerPosition, gstsServerResolveLanding, gstsServerGetTotalAssets } from './economy-engine'
import { gstsServerRunRolePrototype } from './role-engine'
import { gstsServerApplyTurnDecay, gstsServerGetStopTurns, gstsServerSetImmuneTurns, gstsServerSetStopTurns, gstsServerSetWeakenTurns } from './status-engine'
import { gstsServerLogIssueHints, gstsServerLogLine, gstsServerLogSetupSummary } from './ui-log'

export { MATCH_VARIABLES }

export function gstsServerFinalizeByAssets(f: MatchFlow) {
  const player0Assets = gstsServerGetTotalAssets(0n, f)
  const player1Assets = gstsServerGetTotalAssets(1n, f)
  let winnerId = 0n
  if (bool(player1Assets > player0Assets)) {
    winnerId = 1n
  }
  f.set('winnerId', winnerId)
  f.set('gameOver', true)
  gstsServerLogLine(
    '[Richman6] 10 回合结束，P1=' + str(player0Assets) + ' / P2=' + str(player1Assets)
  )
  return 0n
}

export function gstsServerInitializeMatch(f: MatchFlow) {
  f.set('gameStarted', true)
  f.set('gameOver', false)
  f.set('currentPlayer', 0n)
  f.set('currentRound', 1n)
  f.set('currentDice', 0n)
  f.set('currentPhase', 'init')
  f.set('winnerId', -1n)
  f.set('lastLandingTile', 0n)
  f.set('trapTile', -1n)
  f.set('trapOwner', -1n)
  f.set('sealedPropertyIndex', -1n)
  f.set('sealedRoundsLeft', 0n)
  f.set('player0Cash', START_CASH)
  f.set('player1Cash', START_CASH)
  f.set('player0Coupons', START_COUPONS)
  f.set('player1Coupons', START_COUPONS)
  f.set('player0Position', 0n)
  f.set('player1Position', 0n)
  f.set('player0StopTurns', 0n)
  f.set('player1StopTurns', 0n)
  f.set('player0ImmuneTurns', 0n)
  f.set('player1ImmuneTurns', 0n)
  f.set('player0WeakenTurns', 0n)
  f.set('player1WeakenTurns', 0n)
  f.set('player0RoleUsed', false)
  f.set('player1RoleUsed', false)
  f.set('player0CompanionEnergy', 0n)
  f.set('player1CompanionEnergy', 0n)
  gstsServerPresentPlayerPosition(0n, 0n, f)
  gstsServerPresentPlayerPosition(1n, 0n, f)
  gstsServerLogSetupSummary()
  gstsServerLogIssueHints()
  return 0n
}

export function gstsServerRollDice(playerIndex: bigint, f: MatchFlow) {
  let dice = Random.Range(1n, 7n)
  const forcedDice = gstsServerPlanPreRollCard(playerIndex, f)
  if (bool(forcedDice > 0n)) {
    dice = forcedDice
  }
  f.set('currentDice', dice)
  gstsServerLogLine('[Richman6] P' + str(playerIndex + 1n) + ' 掷出 ' + str(dice))
  return dice
}

export function gstsServerAdvanceRoundState(previousPlayer: bigint, f: MatchFlow) {
  const nextPlayer = gstsServerGetOpponent(previousPlayer)
  f.set('currentPlayer', nextPlayer)

  if (bool(nextPlayer === 0n)) {
    f.set('currentRound', f.addition(f.get('currentRound'), 1n))
  }

  if (bool(f.get('sealedRoundsLeft') > 0n)) {
    f.set('sealedRoundsLeft', f.subtraction(f.get('sealedRoundsLeft'), 1n))
  }
  if (bool(f.get('sealedRoundsLeft') === 0n)) {
    f.set('sealedPropertyIndex', -1n)
  }

  gstsServerApplyTurnDecay(previousPlayer, f)
  return 0n
}

export function gstsServerCheckWinCondition(f: MatchFlow) {
  if (bool(gstsServerGetPlayerCash(0n, f) < 0n)) {
    f.set('winnerId', 1n)
    f.set('gameOver', true)
  } else if (bool(gstsServerGetPlayerCash(1n, f) < 0n)) {
    f.set('winnerId', 0n)
    f.set('gameOver', true)
  } else if (bool(f.get('currentRound') > MAX_ROUNDS)) {
    gstsServerFinalizeByAssets(f)
  }
  return 0n
}

export function gstsServerRunTurn(f: MatchFlow) {
  if (bool(f.get('gameOver'))) {
    gstsServerLogLine('[Richman6] 游戏结束，胜者 P' + str(f.get('winnerId') + 1n))
    return 0n
  }

  const playerIndex = f.get('currentPlayer')
  f.set('currentPhase', 'turn_start')
  gstsServerLogLine('[Richman6] 第 ' + str(f.get('currentRound')) + ' 回合，P' + str(playerIndex + 1n))

  if (bool(gstsServerGetStopTurns(playerIndex, f) > 0n)) {
    gstsServerLogLine('[Richman6] 玩家被停留，跳过本回合')
    gstsServerSetStopTurns(playerIndex, f.subtraction(gstsServerGetStopTurns(playerIndex, f), 1n), f)
    gstsServerTickCompanion(playerIndex, f)
    gstsServerAdvanceRoundState(playerIndex, f)
    gstsServerCheckWinCondition(f)
    return 0n
  }

  f.set('currentPhase', 'before_roll')
  gstsServerRunRolePrototype(playerIndex, f)

  const dice = gstsServerRollDice(playerIndex, f)
  f.set('currentPhase', 'after_roll')
  const steps = gstsServerPlanAfterRollMovement(playerIndex, dice, f)

  f.set('currentPhase', 'move')
  const landingTile = gstsServerMovePlayer(playerIndex, steps, f)

  f.set('currentPhase', 'after_land')
  gstsServerResolveLanding(playerIndex, landingTile, f)
  gstsServerApplyAfterLandCards(playerIndex, f)
  gstsServerTickCompanion(playerIndex, f)
  gstsServerCheckWinCondition(f)

  if (bool(f.get('gameOver') === false)) {
    gstsServerAdvanceRoundState(playerIndex, f)
  }

  f.set('currentPhase', 'idle')
  return 0n
}
