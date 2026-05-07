import type { CardDef } from './types'

export const MVP_CARD_DEFS: CardDef[] = [
  {
    id: 'MV-01',
    category: 'movement',
    window: 'after_roll',
    targetRule: 'self',
    charges: 1n,
    summary: '微步推进：本回合额外前进 1 格'
  },
  {
    id: 'MV-02',
    category: 'movement',
    window: 'after_roll',
    targetRule: 'self',
    charges: 1n,
    summary: '双冲刺：本回合额外前进 2 格'
  },
  {
    id: 'MV-03',
    category: 'movement',
    window: 'before_roll',
    targetRule: 'self',
    charges: 1n,
    summary: '遥控骰：将本回合骰子定向到目标落点'
  },
  {
    id: 'MV-05',
    category: 'movement',
    window: 'after_roll',
    targetRule: 'self',
    charges: 1n,
    summary: '定点驻足：将危险落点改为原地停留'
  },
  {
    id: 'PR-01',
    category: 'property',
    window: 'after_land',
    targetRule: 'empty_property',
    charges: 1n,
    summary: '快速签约：购地时获得折扣'
  },
  {
    id: 'PR-03',
    category: 'property',
    window: 'after_land',
    targetRule: 'owned_property',
    charges: 1n,
    summary: '施工许可：升级地产时获得折扣'
  },
  {
    id: 'BL-01',
    category: 'block',
    window: 'after_land',
    targetRule: 'future_tile',
    charges: 1n,
    summary: '延时陷阱：在对手前方 3 格布置陷阱'
  },
  {
    id: 'PR-06',
    category: 'block',
    window: 'after_land',
    targetRule: 'enemy_property',
    charges: 1n,
    summary: '临时封盘：封住一块敌方地产 1 回合'
  },
  {
    id: 'ST-01',
    category: 'defense',
    window: 'before_pay',
    targetRule: 'self',
    charges: 1n,
    summary: '差旅补贴：免除一次租金'
  },
  {
    id: 'ST-02',
    category: 'defense',
    window: 'before_pay',
    targetRule: 'self',
    charges: 1n,
    summary: '紧急护盾：抵挡一次陷阱或封盘'
  }
]
