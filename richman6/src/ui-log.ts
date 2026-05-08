import type { MatchFlow } from './game-state'
import { gstsServerGetTileLabel } from './map'

export function gstsServerLogLine(message: string) {
  print(str(message))
  return 0n
}

export function gstsServerGetCardSummary(cardId: string) {
  let summary = '未知卡牌'
  if (bool(cardId === 'MV-01')) {
    summary = '微步推进：本回合额外前进 1 格'
  } else if (bool(cardId === 'MV-02')) {
    summary = '双冲刺：本回合额外前进 2 格'
  } else if (bool(cardId === 'MV-03')) {
    summary = '遥控骰：优先定向到可购买地产'
  } else if (bool(cardId === 'MV-05')) {
    summary = '定点驻足：遇到高危险落点时停步'
  } else if (bool(cardId === 'PR-01')) {
    summary = '快速签约：购地时减少成本'
  } else if (bool(cardId === 'PR-03')) {
    summary = '施工许可：升级时减少成本'
  } else if (bool(cardId === 'BL-01')) {
    summary = '延时陷阱：在对手前方布置陷阱'
  } else if (bool(cardId === 'BL-04')) {
    summary = '冻结仓：让对手跳过 1 个行动回合'
  } else if (bool(cardId === 'PR-06')) {
    summary = '临时封盘：封住敌方地产 1 回合'
  } else if (bool(cardId === 'ST-01')) {
    summary = '差旅补贴：免除一次租金'
  } else if (bool(cardId === 'ST-02')) {
    summary = '紧急护盾：抵挡一次陷阱、冻结或封盘'
  }
  return summary
}

export function gstsServerGetRoleLabel(playerIndex: bigint) {
  let label = '试验干扰型'
  if (bool(playerIndex === 0n)) {
    label = '试验经济型'
  }
  return label
}

export function gstsServerGetCompanionLabel(playerIndex: bigint) {
  let label = '试验护盾机'
  if (bool(playerIndex === 0n)) {
    label = '试验补给机'
  }
  return label
}

export function gstsServerLogSetupSummary() {
  gstsServerLogLine('[Richman6] 阶段一原型已启动')
  gstsServerLogLine('[Richman6] 首图格子数')
  gstsServerLogLine(str(16n))
  gstsServerLogLine('[Richman6] 地图表现: 通过玩家传送到测试路线点进行验证')
  gstsServerLogLine('[Richman6] 角色原型')
  gstsServerLogLine(gstsServerGetRoleLabel(0n))
  gstsServerLogLine(gstsServerGetRoleLabel(1n))
  gstsServerLogLine('[Richman6] 辅助单位原型')
  gstsServerLogLine(gstsServerGetCompanionLabel(0n))
  gstsServerLogLine(gstsServerGetCompanionLabel(1n))
  return 0n
}

export function gstsServerLogLanding(tileIndex: bigint) {
  gstsServerLogLine('[Richman6] 落点')
  gstsServerLogLine(gstsServerGetTileLabel(tileIndex))
  gstsServerLogLine(str(tileIndex))
  return 0n
}

export function gstsServerLogSnapshot(playerIndex: bigint, cash: bigint, coupons: bigint, tileIndex: bigint) {
  gstsServerLogLine('[Richman6] 玩家状态')
  gstsServerLogLine(str(playerIndex + 1n))
  gstsServerLogLine(str(tileIndex))
  gstsServerLogLine(str(cash))
  gstsServerLogLine(str(coupons))
  return 0n
}

export function gstsServerLogIssueHints() {
  gstsServerLogLine('[Richman6] 问题清单线索: UI 按钮/信号、真实棋子资源、联网同步 仍待后续阶段验证')
  return 0n
}
