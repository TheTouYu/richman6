import { ROLE_DISRUPT_SEAL_ROUNDS, ROLE_ECONOMY_BONUS } from './config'
import {
  gstsServerAddPlayerCash,
  gstsServerGetOpponent,
  gstsServerGetPlayerCash,
  gstsServerGetPropertyOwner
} from './game-state'
import { MAP_LENGTH } from './config'
import { gstsServerTryBlockAttackWithShield } from './card-engine'
import { gstsServerLogLine } from './ui-log'
import type { MatchFlow } from './game-state'

export function gstsServerRunRolePrototype(playerIndex: bigint, f: MatchFlow) {
  if (bool(playerIndex === 0n) && bool(f.get('player0RoleUsed') === false)) {
    if (bool(gstsServerGetPlayerCash(playerIndex, f) <= 1200n)) {
      f.set('player0RoleUsed', true)
      gstsServerAddPlayerCash(playerIndex, ROLE_ECONOMY_BONUS, f)
      gstsServerLogLine('[Richman6] 经济型测试技能触发')
    }
  }

  if (bool(playerIndex === 1n) && bool(f.get('player1RoleUsed') === false)) {
    const opponent = gstsServerGetOpponent(playerIndex)
    let targetTile = -1n
    let cursor = 0n
    while (bool(cursor < MAP_LENGTH)) {
      if (bool(targetTile < 0n) && bool(gstsServerGetPropertyOwner(cursor, f) === opponent)) {
        targetTile = cursor
      }
      cursor = cursor + 1n
    }
    if (bool(targetTile >= 0n) && bool(gstsServerTryBlockAttackWithShield(opponent, f) === false)) {
      f.set('player1RoleUsed', true)
      f.set('sealedPropertyIndex', targetTile)
      f.set('sealedRoundsLeft', ROLE_DISRUPT_SEAL_ROUNDS)
      gstsServerLogLine('[Richman6] 干扰型测试技能触发')
    }
  }

  return 0n
}
