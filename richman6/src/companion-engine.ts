import {
  COMPANION_ECONOMY_CASH,
  COMPANION_SHIELD_TURNS,
  COMPANION_TRIGGER_ENERGY
} from './config'
import { gstsServerAddPlayerCash, gstsServerAddPlayerCoupons } from './game-state'
import { gstsServerSetImmuneTurns } from './status-engine'
import { gstsServerLogLine } from './ui-log'
import type { MatchFlow } from './game-state'

export function gstsServerGetCompanionEnergy(playerIndex: bigint, f: MatchFlow) {
  let value = f.get('player1CompanionEnergy')
  if (bool(playerIndex === 0n)) {
    value = f.get('player0CompanionEnergy')
  }
  return value
}

export function gstsServerSetCompanionEnergy(playerIndex: bigint, value: bigint, f: MatchFlow) {
  if (bool(playerIndex === 0n)) {
    f.set('player0CompanionEnergy', value)
  } else {
    f.set('player1CompanionEnergy', value)
  }
  return 0n
}

export function gstsServerTickCompanion(playerIndex: bigint, f: MatchFlow) {
  const nextEnergy = f.addition(gstsServerGetCompanionEnergy(playerIndex, f), 1n)
  gstsServerSetCompanionEnergy(playerIndex, nextEnergy, f)

  if (bool(nextEnergy >= COMPANION_TRIGGER_ENERGY)) {
    gstsServerSetCompanionEnergy(playerIndex, 0n, f)
    if (bool(playerIndex === 0n)) {
      gstsServerAddPlayerCash(playerIndex, COMPANION_ECONOMY_CASH, f)
      gstsServerAddPlayerCoupons(playerIndex, 1n, f)
      gstsServerLogLine('[Richman6] 经济辅助单位已触发')
    } else {
      gstsServerSetImmuneTurns(playerIndex, COMPANION_SHIELD_TURNS, f)
      gstsServerLogLine('[Richman6] 护盾辅助单位已触发')
    }
  }

  return 0n
}
