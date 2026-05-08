# richman6 阶段一原型运行说明

本文档记录当前原型落地后的结构、边界和下一步扩展方式。

## 1. 当前代码结构

- [src/main.ts](/Users/wonder/Desktop/explore/richman6/src/main.ts:1)
  - 单一入口
  - 初始化节点图
  - 启动自动回合循环
- [src/match.ts](/Users/wonder/Desktop/explore/richman6/src/match.ts:1)
  - 对局初始化
  - 10 回合主循环
  - 胜负判定
- [src/economy-engine.ts](/Users/wonder/Desktop/explore/richman6/src/economy-engine.ts:1)
  - 移动、买地、升级、收租、资产结算
- [src/card-engine.ts](/Users/wonder/Desktop/explore/richman6/src/card-engine.ts:1)
  - 10 张原型卡牌的自动策略
- [src/status-engine.ts](/Users/wonder/Desktop/explore/richman6/src/status-engine.ts:1)
  - 停留、免疫、贫弱
- [src/role-engine.ts](/Users/wonder/Desktop/explore/richman6/src/role-engine.ts:1)
  - 每名玩家 1 个测试型主动能力
- [src/companion-engine.ts](/Users/wonder/Desktop/explore/richman6/src/companion-engine.ts:1)
  - 最小蓄能与触发

## 2. 当前原型的实现取舍

- 玩家现金、点券、位置、状态计时都使用标量变量。
- 地产归属、地产等级、手牌仍使用列表变量。
- 回合采用 `setInterval` 自动推进，优先验证规则稳定性，而不是先接入手动按钮。
- 当前构建结论之一：定时器更适合作为“持续触发但在逻辑内短路”的循环，而不是依赖保存句柄后再 `clearInterval` 停止。
- 地图表现优先用 `teleportPlayer` 到测试点位，不依赖正式棋子或格子资源。

## 3. 已覆盖的第一阶段计划点

- 16 格极简测试地图
- 2 名固定玩家
- 10 回合固定结算
- 2 级地产成长
- 10 张原型卡牌
- 3 类状态
- 角色接口验证
- 辅助单位接口验证
- 文本播报、状态快照、阶段日志

## 4. 当前仍是“学习版”的地方

- 卡牌仍然是自动策略，不是玩家主动点按释放。
- 地图表现只有位置变化，没有正式 UI 控件组。
- 连片地产、第三等级地产、功能建筑还没打开。
- 角色和辅助单位只有最小原型，不是正式平衡版本。
- 问题清单先通过日志与文档沉淀，还没有专门的自动化测试面板。

## 5. 推荐下一步

1. 先在编辑器里验证自动移动和日志是否稳定。
2. 根据真实运行结果，记录：
   - 哪些节点图变量结构稳定
   - 哪些表现钩子需要改成信号或 UI 控件
   - `teleportPlayer` 是否足够承载测试棋子移动
3. 再进入完整版的第一轮扩展：
   - 手牌输入
   - 角色 4 定位
   - 辅助单位 4 模板
   - 20~24 张正式首发卡
