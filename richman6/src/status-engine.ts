import type { MatchFlow } from './game-state'

export function gstsServerGetStopTurns(playerIndex: bigint, f: MatchFlow) {
  let value = f.get('player1StopTurns')
  if (bool(playerIndex === 0n)) {
    value = f.get('player0StopTurns')
  }
  return value
}

export function gstsServerSetStopTurns(playerIndex: bigint, turns: bigint, f: MatchFlow) {
  if (bool(playerIndex === 0n)) {
    f.set('player0StopTurns', turns)
  } else {
    f.set('player1StopTurns', turns)
  }
  return 0n
}

export function gstsServerGetImmuneTurns(playerIndex: bigint, f: MatchFlow) {
  let value = f.get('player1ImmuneTurns')
  if (bool(playerIndex === 0n)) {
    value = f.get('player0ImmuneTurns')
  }
  return value
}

export function gstsServerSetImmuneTurns(playerIndex: bigint, turns: bigint, f: MatchFlow) {
  if (bool(playerIndex === 0n)) {
    f.set('player0ImmuneTurns', turns)
  } else {
    f.set('player1ImmuneTurns', turns)
  }
  return 0n
}

export function gstsServerGetWeakenTurns(playerIndex: bigint, f: MatchFlow) {
  let value = f.get('player1WeakenTurns')
  if (bool(playerIndex === 0n)) {
    value = f.get('player0WeakenTurns')
  }
  return value
}

export function gstsServerSetWeakenTurns(playerIndex: bigint, turns: bigint, f: MatchFlow) {
  if (bool(playerIndex === 0n)) {
    f.set('player0WeakenTurns', turns)
  } else {
    f.set('player1WeakenTurns', turns)
  }
  return 0n
}

export function gstsServerTryBlockControl(playerIndex: bigint, f: MatchFlow) {
  let blocked = false
  if (bool(gstsServerGetImmuneTurns(playerIndex, f) > 0n)) {
    blocked = true
    gstsServerSetImmuneTurns(playerIndex, 0n, f)
  }
  return blocked
}

export function gstsServerApplyTurnDecay(playerIndex: bigint, f: MatchFlow) {
  const immune = gstsServerGetImmuneTurns(playerIndex, f)
  const weaken = gstsServerGetWeakenTurns(playerIndex, f)
  if (bool(immune > 0n)) {
    gstsServerSetImmuneTurns(playerIndex, immune - 1n, f)
  }
  if (bool(weaken > 0n)) {
    gstsServerSetWeakenTurns(playerIndex, weaken - 1n, f)
  }
  return 0n
}
