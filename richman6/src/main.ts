import { g } from 'genshin-ts/runtime/core'

import { MATCH_NODE_GRAPH_ID } from './config'
import { gstsServerInitializeMatch, gstsServerRunTurn, MATCH_VARIABLES } from './match'

g.server({
  id: MATCH_NODE_GRAPH_ID,
  variables: MATCH_VARIABLES
})
  .on('whenEntityIsCreated', (_evt, f) => {
    if (bool(f.get('gameStarted') === false)) {
      gstsServerInitializeMatch(f)
    }
  })
  .on('whenEntityIsCreated', (_evt, f) => {
    if (bool(f.get('gameOver') === false)) {
      gstsServerRunTurn(f)
    }
  })
