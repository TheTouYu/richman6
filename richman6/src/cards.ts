import type { CardDef } from './types'

export const MVP_CARD_DEFS: CardDef[] = [
  {
    id: 'MV-01',
    category: 'movement',
    window: 'after_roll',
    targetRule: 'self',
    summary: '微步推进：本回合额外前进 1 格'
  },
  {
    id: 'MV-02',
    category: 'movement',
    window: 'after_roll',
    targetRule: 'self',
    summary: '双冲刺：本回合额外前进 2 格'
  },
  {
    id: 'MV-03',
    category: 'movement',
    window: 'before_roll',
    targetRule: 'self',
    summary: '遥控骰：优先定向到可购买地产'
  },
  {
    id: 'MV-05',
    category: 'movement',
    window: 'after_roll',
    targetRule: 'self',
    summary: '定点驻足：遇到高危险落点时停步'
  },
  {
    id: 'PR-01',
    category: 'property',
    window: 'after_land',
    targetRule: 'empty_property',
    summary: '快速签约：购地时减少成本'
  },
  {
    id: 'PR-03',
    category: 'property',
    window: 'after_land',
    targetRule: 'owned_property',
    summary: '施工许可：升级时减少成本'
  },
  {
    id: 'BL-01',
    category: 'block',
    window: 'after_land',
    targetRule: 'future_tile',
    summary: '延时陷阱：在对手前方布置陷阱'
  },
  {
    id: 'BL-04',
    category: 'block',
    window: 'after_land',
    targetRule: 'enemy_player',
    summary: '冻结仓：让对手跳过 1 个行动回合'
  },
  {
    id: 'PR-06',
    category: 'block',
    window: 'after_land',
    targetRule: 'enemy_property',
    summary: '临时封盘：封住敌方地产 1 回合'
  },
  {
    id: 'ST-01',
    category: 'defense',
    window: 'before_pay',
    targetRule: 'self',
    summary: '差旅补贴：免除一次租金'
  },
  {
    id: 'ST-02',
    category: 'defense',
    window: 'before_pay',
    targetRule: 'self',
    summary: '紧急护盾：抵挡一次陷阱、冻结或封盘'
  }
]
