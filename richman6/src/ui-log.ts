import { MVP_CARD_DEFS } from './cards'
import { MINI_BOARD, PROTOTYPE_COMPANIONS, PROTOTYPE_ROLES } from './config'
import type { MatchFlow } from './game-state'

export function gstsServerLogLine(message: string) {
  print(str(message))
  return 0n
}

export function gstsServerGetCardSummary(cardId: string) {
  let summary = '未知卡牌'
  let cursor = 0n
  while (bool(cursor < 11n)) {
    if (bool(MVP_CARD_DEFS[idx(cursor)].id === cardId)) {
      summary = MVP_CARD_DEFS[idx(cursor)].summary
    }
    cursor = cursor + 1n
  }
  return summary
}

export function gstsServerGetRoleLabel(playerIndex: bigint) {
  let label = PROTOTYPE_ROLES[1].label
  if (bool(playerIndex === 0n)) {
    label = PROTOTYPE_ROLES[0].label
  }
  return label
}

export function gstsServerGetCompanionLabel(playerIndex: bigint) {
  let label = PROTOTYPE_COMPANIONS[1].label
  if (bool(playerIndex === 0n)) {
    label = PROTOTYPE_COMPANIONS[0].label
  }
  return label
}

export function gstsServerLogSetupSummary() {
  gstsServerLogLine('[Richman6] 阶段一原型已启动')
  gstsServerLogLine('[Richman6] 首图格子数: ' + str(16n))
  gstsServerLogLine('[Richman6] 地图表现: 通过玩家传送到测试路线点进行验证')
  gstsServerLogLine('[Richman6] 角色原型: ' + gstsServerGetRoleLabel(0n) + ' / ' + gstsServerGetRoleLabel(1n))
  gstsServerLogLine(
    '[Richman6] 辅助单位原型: ' +
      gstsServerGetCompanionLabel(0n) +
      ' / ' +
      gstsServerGetCompanionLabel(1n)
  )
  return 0n
}

export function gstsServerLogLanding(tileIndex: bigint) {
  gstsServerLogLine(
    '[Richman6] 落点 -> ' + MINI_BOARD[idx(tileIndex)].label + ' @ tile ' + str(tileIndex)
  )
  return 0n
}

export function gstsServerLogSnapshot(playerIndex: bigint, cash: bigint, coupons: bigint, tileIndex: bigint) {
  gstsServerLogLine(
    '[Richman6] P' +
      str(playerIndex + 1n) +
      ' 位置=' +
      str(tileIndex) +
      ' 现金=' +
      str(cash) +
      ' 点券=' +
      str(coupons)
  )
  return 0n
}

export function gstsServerLogIssueHints() {
  gstsServerLogLine('[Richman6] 问题清单线索: UI 按钮/信号、真实棋子资源、联网同步 仍待后续阶段验证')
  return 0n
}
