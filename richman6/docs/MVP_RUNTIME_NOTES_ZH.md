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

## 3. 本次确认的编译边界

这次不是普通 TypeScript 问题，而是 `genshin-ts -> gs -> IR -> GIA` 这条链路里的真实限制。后续开发时，默认都要按下面这些规则写。

### 3.1 `gstsServer*` 只能有末尾唯一 `return`

- 不能在 `if / else / while / switch` 里提前 `return`
- 要改成：
  - 先声明局部结果变量
  - 在分支里改值
  - 最后统一 `return result`

这次已经实际踩到的函数包括：

- `gstsServerTryBuyProperty`
- `gstsServerTryUpgradeProperty`
- `gstsServerTryPayRent`
- `gstsServerRunTurn`

### 3.2 顶层对象数组不要进入节点图运行时

下面这类“顶层表结构”可以留在代码里做说明，但不要在节点图运行时直接按索引取字段：

- `MVP_CARD_DEFS[idx(i)].summary`
- `MINI_BOARD[idx(i)].label`
- `PROTOTYPE_ROLES[idx(i)].label`
- `PROTOTYPE_COMPANIONS[idx(i)].label`

更稳的写法是：

- 用显式 `if / else if` 做 `id -> 文案` 或 `tileIndex -> label` 映射

### 3.3 顶层 `vec3` 列表和局部 `vec3` 中转都不稳

这次已经确认：

- 顶层 `ROUTE_POINTS[idx(tileIndex)]`
- 先返回一个局部 `vec3` 再传给 `teleportPlayer`

都可能在 GIA 阶段失败。

当前稳定方案：

- 直接在 `gstsServerPresentPlayerPosition` 里分支调用 `teleportPlayer`
- 不走 `vec3` 列表
- 不走局部 `vec3` 变量中转

### 3.4 字符串拼接非常脆

下面这种写法在 GIA 阶段容易报 `Generic parameter not matched`：

- `'[Richman6] P' + str(playerIndex + 1n)`
- `'资产=' + str(value)`

当前更稳的方案：

- 把复杂日志拆成多条 `gstsServerLogLine(...)`
- 每条只传单一字符串
- 数值单独 `str(...)` 后单独输出

### 3.5 运行时扣款不要直接写负号

下面这种写法在运行时值链路里不稳：

- `gstsServerAddPlayerCash(playerIndex, -price, f)`
- `gstsServerAddPlayerCash(playerIndex, -rent, f)`

当前更稳的方案：

- `f.subtraction(0n, price)`
- `f.subtraction(0n, rent)`

### 3.6 条件表达式读变量容易把类型搞成泛型

下面这种写法不稳：

- `f.get(bool(playerIndex === 0n) ? 'player0Coupons' : 'player1Coupons')`

当前更稳的方案：

- 先走专门 getter
- 例如 `gstsServerGetPlayerCoupons(playerIndex, f)`

### 3.7 当前已验证可通过的构建方式

在当前仓库状态下，下面两条已经实测通过：

- `npm run typecheck`
- `LANG=zh_CN.UTF-8 LC_ALL=zh_CN.UTF-8 npm run build`

## 4. 已覆盖的第一阶段计划点

- 16 格极简测试地图
- 2 名固定玩家
- 10 回合固定结算
- 2 级地产成长
- 10 张原型卡牌
- 3 类状态
- 角色接口验证
- 辅助单位接口验证
- 文本播报、状态快照、阶段日志

## 5. 当前仍是“学习版”的地方

- 卡牌仍然是自动策略，不是玩家主动点按释放。
- 地图表现只有位置变化，没有正式 UI 控件组。
- 连片地产、第三等级地产、功能建筑还没打开。
- 角色和辅助单位只有最小原型，不是正式平衡版本。
- 问题清单先通过日志与文档沉淀，还没有专门的自动化测试面板。

## 6. 联调建议

接下来和编辑器联调时，建议优先按这个顺序验证：

1. 只看 `main.gia` 是否能正常注入 NodeGraph。
2. 只看 `whenEntityIsCreated` 是否会触发初始化日志。
3. 只看 `teleportPlayer` 是否能把 2 名玩家送到测试点位。
4. 再看自动回合、买地、收租、陷阱、封盘是否按日志发生。

如果联调失败，优先先区分是：

- 注入失败
- 入口事件没触发
- `teleportPlayer` 无效果
- 规则链路运行但表现没挂上

## 7. 推荐下一步

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
