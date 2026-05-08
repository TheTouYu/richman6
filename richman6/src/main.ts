import { g } from 'genshin-ts/runtime/core'

import { MATCH_NODE_GRAPH_ID, TURN_INTERVAL_MS } from './config'
import type { MatchFlow } from './game-state'
import { gstsServerInitializeMatch, gstsServerRunTurn, MATCH_VARIABLES } from './match'

g.server({
  id: 1073741826,
  variables: MATCH_VARIABLES
}).on('whenEntityIsCreated', (_evt, f) => {
  if (bool(f.get('gameStarted') === false)) {
    gstsServerInitializeMatch(f)
    const timerName = setInterval((_timerEvt, timerFlow) => {
      gstsServerRunTurn(timerFlow)
    }, TURN_INTERVAL_MS)
    f.set('turnLoopTimer', timerName)
  }
})
