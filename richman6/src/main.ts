import { g } from 'genshin-ts/runtime/core'

import { MATCH_NODE_GRAPH_ID, TURN_INTERVAL_MS } from './config'
import {
  gstsServerInitializeMatch,
  gstsServerRunTurn,
  MATCH_VARIABLES
} from './match'
import type { MatchFlow } from './game-state'

g.server({
  id: MATCH_NODE_GRAPH_ID,
  variables: MATCH_VARIABLES
}).on('whenEntityIsCreated', (_evt, f) => {
  if (bool(f.get('gameStarted') === false)) {
    gstsServerInitializeMatch(f)
    const timerName = setInterval((_timerEvt, timerFlow) => {
      gstsServerRunTurn(timerFlow as unknown as MatchFlow)
    }, TURN_INTERVAL_MS)
    f.set('turnLoopTimer', timerName)
  }
})
