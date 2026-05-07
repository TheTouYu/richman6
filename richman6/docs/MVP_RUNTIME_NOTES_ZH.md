# richman6 MVP 运行与配置关键点

本文档记录当前 `richman6` MVP 的几个关键认识：配置层次、运行流程、以及本次排查中确认的 `genshin-ts` / 节点图编译注意事项。

## 1. 三层配置不要混淆

### 1.1 规则常量配置

文件：

- `src/config.ts`

用途：

- 放游戏规则常量，而不是局内动态状态。
- 例如：
  - `MATCH_NODE_GRAPH_ID`
  - `MAP_LENGTH`
  - `MAX_ROUNDS`
  - `PASS_START_REWARD`
  - `REWARD_TILE_CASH`
  - `EVENT_CASH_REWARD`
  - `SHOP_TILE_COUPON`
  - `TRAP_PENALTY`
  - `PROPERTY_UPGRADE_COST_LEVEL_1`
  - `PROPERTY_UPGRADE_COST_LEVEL_2`
  - `TILE_START / TILE_PROPERTY / TILE_REWARD / TILE_EVENT / TILE_SHOP / TILE_TRAP`

理解方式：

- 这是“规则参数层”。
- 改这里，等于改玩法数值和地图编码规则。

### 1.2 节点图变量初始状态

文件：

- `src/match.ts`

位置：

- `MATCH_VARIABLES`

用途：

- 定义一局游戏开始时的节点图变量初始值。
- 例如：
  - `gameStarted`
  - `gameOver`
  - `currentPlayer`
  - `currentRound`
  - `currentDice`
  - `winnerId`
  - `player0Cash / player1Cash`
  - `player0Coupons / player1Coupons`
  - `player0Position / player1Position`
  - `propertyOwners`
  - `propertyLevels`
  - `player0Hand / player1Hand`
  - `trapTile`
  - `trapOwner`
  - `sealedPropertyIndex`
  - `sealedRoundsLeft`

理解方式：

- 这是“开局状态层”。
- 改这里，等于改开局资源、开局手牌、开局回合状态。

### 1.3 编译入口配置

文件：

- `gsts.config.ts`

当前关键值：

- `entries: ['./src/main.ts']`
- `outDir: './dist'`

理解方式：

- 这是“工具链入口层”。
- 改这里，等于改从哪个 TS 入口生成节点图产物。

## 2. 当前 MVP 主流程

### 2.1 入口

文件：

- `src/main.ts`

流程：

- `whenEntityIsCreated` 第一次负责初始化：
  - `gstsServerInitializeMatch`
- `whenEntityIsCreated` 第二次负责跑主回合：
  - `gstsServerRunTurn`

### 2.2 运行时主链

文件：

- `src/match.ts`

主链顺序：

1. `gstsServerInitializeMatch`
2. `gstsServerRunTurn`
3. `gstsServerRollDice`
4. `gstsServerPlanPreRollCard`
5. `gstsServerPlanAfterRollMovement`
6. `gstsServerMovePlayer`
7. `gstsServerResolveLanding`
8. `gstsServerCheckWinCondition`
9. `gstsServerAdvanceRoundState`

### 2.3 地图规则来源

文件：

- `src/map.ts`

作用：

- 负责根据格子索引返回：
  - 格子类型
  - 地产价格
  - 基础租金

当前实现特点：

- 没有直接复用原作布局。
- 使用原创单环地图编码。

## 3. 这次排查确认的关键编译经验

### 3.1 不要把会参与算术的玩家状态继续放在 list 变量里

这次已经确认：

- `playerCash`
- `playerCoupons`
- `playerPositions`

如果定义成 list 变量，再去做：

- `f.get('xxx')[idx(i)] + n`

很容易在 `GIA` 生成阶段触发类型不匹配或 JS BigInt 混型问题。

当前稳定方案：

- 改成标量变量：
  - `player0Cash / player1Cash`
  - `player0Coupons / player1Coupons`
  - `player0Position / player1Position`

### 3.2 节点值不要轻易穿过 JS BigInt helper 再做原生运算

这次已经确认会出问题的模式：

- `function add(a: bigint, b: bigint) { return a + b }`
- 然后把节点图里的运行时值传进去

原因：

- 在 `gs_to_ir_json / GIA` 阶段，这些值不一定是稳定 JS `bigint`
- 很容易触发：
  - `Cannot mix BigInt and other types`

当前更稳的方案：

- 让关键数值运算发生在当前节点图上下文里：
  - `f.addition(...)`
  - `f.subtraction(...)`
  - `f.multiplication(...)`
  - `f.greaterThanOrEqualTo(...)`
  - `f.lessThan(...)`

### 3.3 列表变量本身不是完全不能用

这次通过实验文件确认：

- `list` 变量定义本身没有问题
- `f.get('cashA')[0]` 这种最小读写链是可以编译通过的

但注意：

- 当 list 元素参与更复杂的运行时逻辑、函数调用链、或多层 helper 时，风险会显著增加

所以当前建议：

- `propertyOwners`
- `propertyLevels`
- `player0Hand / player1Hand`

这些仍可保留为 list

但：

- 频繁参与算术和位置推进的玩家数值，优先用标量

### 3.4 `hand.length` 这类写法不稳定

这次排查中确认：

- `int(hand.length)` 可能在节点图编译阶段失败

当前更稳的方案：

- 对固定容量手牌，直接用固定上限循环
- 例如当前代码里固定扫前 `8` 个槽位

### 3.5 `wrapTile` 这类 helper 也可能成为混型入口

即使逻辑很简单：

- `if (tileIndex >= MAP_LENGTH) tileIndex - MAP_LENGTH`

只要参数是节点图运行时值，放在独立 JS helper 里就可能触发混型。

当前更稳的方案：

- 把这类简单数值变换直接内联到当前持有 `f` 的函数里
- 使用：
  - `f.greaterThanOrEqualTo`
  - `f.subtraction`
  - `f.addition`

## 4. 当前推荐开发方式

### 4.1 用 `npm run dev` 做主验证

原因：

- `npm run build` 对较复杂节点图会更重
- `npm run dev` 支持文件变化后的增量编译，更适合当前阶段

注意：

- 当前环境下若直接跑工具链，可能因默认语言环境报：
  - `Invalid language tag: C`

更稳的方式：

- `LANG=zh_CN.UTF-8 LC_ALL=zh_CN.UTF-8 npm run dev`
- 或：
  - `LANG=zh_CN.UTF-8 LC_ALL=zh_CN.UTF-8 npm run build`

### 4.2 恢复复杂逻辑时用“小步恢复”

本次排查证明：

- 直接一次性接回完整主链，不利于定位

更稳的方式：

1. 先恢复最小可编译主链
2. 再恢复一个函数
3. 立刻跑增量编译
4. 出问题就立刻缩到具体函数

## 5. 当前最值得记住的结论

### 结论 1

`config.ts` 是规则参数，`MATCH_VARIABLES` 是节点图开局状态，`gsts.config.ts` 是编译入口配置。

### 结论 2

玩家现金、点券、位置这类“会频繁参与算术”的运行时状态，优先改成标量变量，不要继续用 list 变量。

### 结论 3

节点图运行时值不要随便交给 JS 原生 `bigint` helper 做 `+/-/*`，优先在当前持有 `f` 的上下文里用节点图运算 API。

### 结论 4

列表变量可以保留，但最好用于：

- 归属表
- 等级表
- 手牌槽位

而不是用于高频数值结算主链。

### 结论 5

当前阶段优先用 `npm run dev` 增量验证，不要完全依赖重型全量编译来定位问题。
