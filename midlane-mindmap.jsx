import { useState, useCallback } from "react";

const MIND_MAP_DATA = {
  id: "root",
  label: "中单全面理解",
  icon: "🏰",
  children: [
    {
      id: "laning",
      label: "对线期",
      icon: "⚔️",
      color: "#e74c3c",
      children: [
        {
          id: "lv1-3",
          label: "等级 1-3（生存期）",
          icon: "🌱",
          color: "#e74c3c",
          details: [
            { title: "核心目标", text: "安全补刀，不送一血，观察敌方打野路线" },
            { title: "补刀优先级", text: "前3波兵 > 换血。用技能补刀而非换血（除非你是强势1级英雄如潘森）" },
            { title: "走位原则", text: "站在兵线侧面，不要站在敌方兵线后面吃小兵仇恨。远程vs近战：利用草丛断仇恨" },
            { title: "血量管理", text: "保持60%以上血量。低于60%被打野gank几乎必死" },
            { title: "技能使用", text: "记录双方技能CD。对方关键技能交了（如劫W、阿卡丽E）= 换血窗口" },
          ],
          children: [
            {
              id: "lv1-3-ahead",
              label: "占优时",
              icon: "✅",
              color: "#e74c3c",
              details: [
                { title: "打法", text: "控线在己方塔前，让对方上前补刀时换血" },
                { title: "注意", text: "不要越塔强杀，1-3级塔伤极高，容易被反杀" },
                { title: "视野", text: "插河道眼，防止敌方打野来帮对面稳线" },
              ],
            },
            {
              id: "lv1-3-behind",
              label: "劣势时",
              icon: "⚠️",
              color: "#e74c3c",
              details: [
                { title: "打法", text: "用技能远程补刀，放弃部分补刀保命。经验 > 金币" },
                { title: "核心", text: "绝对不能死。1-3级的死亡 = 丢1-2波兵 + 对方先到6" },
                { title: "求助", text: "Ping打野来中路帮忙推线或Gank。告知队友'中路压力大'" },
              ],
            },
          ],
        },
        {
          id: "lv4-6",
          label: "等级 4-6（转折期）",
          icon: "🔥",
          color: "#e74c3c",
          details: [
            { title: "核心目标", text: "争取先到6级。先到6级 = 击杀压力 / 游走权" },
            { title: "如何先到6", text: "不漏兵（包括炮车），合理使用技能清线。控制推线节奏让自己先接到炮车波" },
            { title: "6级时间窗口", text: "到6的那一瞬间立刻评估：能不能solo kill？能不能游走？" },
            { title: "TP vs 点燃", text: "点燃 = 更强的对线kill pressure。TP = 更好的地图支援和回线能力" },
          ],
          children: [
            {
              id: "lv6-allin",
              label: "6级All-in判断",
              icon: "💀",
              color: "#e74c3c",
              details: [
                { title: "可以打的条件", text: "① 对方血量<70% ② 对方关键技能CD中 ③ 知道敌方打野不在附近 ④ 你有点燃/引爆" },
                { title: "不能打的条件", text: "① 不知道敌方打野位置 ② 对方有屏障/净化 ③ 兵线对你不利（大波兵线） ④ 对方血量满且有控制" },
                { title: "典型combo", text: "小鱼人: R→Q→W→E撤离 | 劫: WEQ→R→E→AA→引爆 | 赛拉斯: E1E2→W→Q→R" },
              ],
            },
          ],
        },
        {
          id: "lv7-9",
          label: "等级 7-9（主动期）",
          icon: "⚡",
          color: "#e74c3c",
          details: [
            { title: "核心目标", text: "利用技能等级优势（主Q/W满级），扩大线权或制造游走" },
            { title: "波线权", text: "快速清线后你有15-20秒窗口期做事：游走/入侵野区/放眼/回城购物" },
            { title: "补给节奏", text: "大件完成时机非常重要。第一个大件完成 = 显著战力提升" },
            { title: "地图阅读", text: "持续观察小地图，判断哪条线有机会。每10秒看一次小地图" },
          ],
        },
        {
          id: "wave-mgmt",
          label: "兵线管理（核心技术）",
          icon: "🌊",
          color: "#e74c3c",
          children: [
            {
              id: "wave-freeze",
              label: "控线 / 冻结",
              icon: "🧊",
              color: "#e74c3c",
              details: [
                { title: "什么时候用", text: "你有击杀压力时；对方刚死回线时；你想让对方过度推进被gank" },
                { title: "怎么做", text: "保持对方3-4个多余小兵存活。在塔前2个身位处拉住兵线。只用平A补尾刀" },
                { title: "风险", text: "如果对方游走你不跟 = 队友可能被杀。要平衡冻结收益和队友安全" },
                { title: "何时放弃冻结", text: "① 队友需要支援 ② 有大龙/小龙团战 ③ 对方整队来破冻结" },
              ],
            },
            {
              id: "wave-slow",
              label: "慢推",
              icon: "🐢",
              color: "#e74c3c",
              details: [
                { title: "什么时候用", text: "准备游走/回城前；想要塔下大波兵压力；准备做龙/先锋" },
                { title: "怎么做", text: "只补尾刀，不用技能打兵。让己方兵线慢慢积累数量优势" },
                { title: "配合游走", text: "慢推2-3波 → 大波兵推到对方塔下 → 游走。对方要么丢兵要么不能跟" },
                { title: "大招时机", text: "配合打野做先锋：先慢推中路再转上河道" },
              ],
            },
            {
              id: "wave-fast",
              label: "快推 / 硬推",
              icon: "💨",
              color: "#e74c3c",
              details: [
                { title: "什么时候用", text: "要回城补给时；对方离线时（死了/游走了）；要争夺地图资源" },
                { title: "怎么做", text: "全技能清兵，越快越好。目标是让兵线撞塔" },
                { title: "注意", text: "快推后如果不做事（游走/回城/做视野），就是浪费了时间窗口" },
                { title: "清线速度基准", text: "翡翠段位，争取5秒内清完一波兵。清线速度 = 你的地图影响力" },
              ],
            },
            {
              id: "wave-bounce",
              label: "弹兵线",
              icon: "↩️",
              color: "#e74c3c",
              details: [
                { title: "什么是弹兵线", text: "把兵线推到对方塔下，让塔快速消耗你的兵，然后兵线会自然向你这边推回来" },
                { title: "什么时候用", text: "想回城购物但不想丢兵时；想设置冻结时；做完一波游走准备回线时" },
                { title: "关键", text: "推到塔下时不要留太多兵。2-3个远程兵即可，太多兵会让弹回速度变慢" },
              ],
            },
          ],
        },
        {
          id: "matchup-types",
          label: "对线类型应对",
          icon: "🎭",
          color: "#e74c3c",
          children: [
            {
              id: "vs-mage",
              label: "vs 法师（辛德拉/维克托/奥莉安娜）",
              icon: "🔮",
              color: "#e74c3c",
              details: [
                { title: "核心策略", text: "利用他们前期无位移的弱点。等他们用了关键控制技能后再进场" },
                { title: "走位", text: "蛇形走位躲技能，不要直线接近。利用小兵挡技能（如辛德拉Q）" },
                { title: "击杀窗口", text: "6级后是最佳窗口。法师通常6级没有逃生手段" },
                { title: "出装调整", text: "可以考虑多兰盾开局减少poke伤害；水银鞋应对高控制法师" },
              ],
            },
            {
              id: "vs-assassin",
              label: "vs 刺客（劫/卡特/泰隆）",
              icon: "🗡️",
              color: "#e74c3c",
              details: [
                { title: "核心原则", text: "'谁先手谁输'。耐心等对方先交关键技能" },
                { title: "走位", text: "保持安全距离，不给对方免费进场机会" },
                { title: "防守优先", text: "先用防守技能（小鱼人E、赛拉斯E）躲掉对方爆发再反打" },
                { title: "出装", text: "布甲是性价比之王。中亚沙漏优先级提高" },
              ],
            },
            {
              id: "vs-counter",
              label: "vs 克制英雄（薇恩/潘森/黛安娜）",
              icon: "🛡️",
              color: "#e74c3c",
              details: [
                { title: "心态", text: "接受劣势对线。目标从'赢线'变成'不输太多'" },
                { title: "策略", text: "① 叫打野帮忙 ② 用TP保线权 ③ 专注补刀不打架 ④ 等装备追平" },
                { title: "补刀技巧", text: "用技能远程补，接受会多花蓝。带腐败药水提供持续回复" },
                { title: "翻盘点", text: "被克制 ≠ 输。团战中你的价值可能比对方大。坚持到中期" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "roaming",
      label: "游走与地图控制",
      icon: "🗺️",
      color: "#3498db",
      children: [
        {
          id: "roam-timing",
          label: "游走时机判断",
          icon: "⏰",
          color: "#3498db",
          details: [
            { title: "最佳时机", text: "推完线后 / 对方回城后 / 炮车波后（下波兵来得慢）" },
            { title: "看什么", text: "① 侧线有没有敌人推过半场 ② 队友有没有控制配合 ③ 河道有没有视野" },
            { title: "时间窗口", text: "从推完线到下波兵到，约15-20秒。游走超时 = 丢兵丢经验" },
            { title: "准则", text: "游走不成功也不算亏，只要你没有①死 ②丢太多兵。成功的游走 = 击杀/闪现/塔皮" },
          ],
          children: [
            {
              id: "roam-go",
              label: "✅ 应该游走",
              icon: "🟢",
              color: "#3498db",
              details: [
                { title: "情况1", text: "线已推到对方塔下，对方在塔下补兵无法跟" },
                { title: "情况2", text: "对方血量低/无闪且队友有控制" },
                { title: "情况3", text: "小龙/先锋即将刷新，需要提前布置" },
                { title: "情况4", text: "对方中单游走了，你必须跟或者反向游走" },
                { title: "情况5", text: "你有大招但对线没有击杀机会时（如对方太肉或太安全）" },
              ],
            },
            {
              id: "roam-stay",
              label: "❌ 不应该游走",
              icon: "🔴",
              color: "#3498db",
              details: [
                { title: "情况1", text: "兵线在你这边/正推向你 → 游走 = 丢2波兵" },
                { title: "情况2", text: "你不知道敌方打野位置 → 路上可能被抓" },
                { title: "情况3", text: "侧线队友血量很低 → 去了也打不了" },
                { title: "情况4", text: "你自己血量/蓝量不够 → 先回城补给" },
                { title: "情况5", text: "刚死了准备回线 → 先稳住线权再想游走" },
              ],
            },
          ],
        },
        {
          id: "roam-types",
          label: "游走方式",
          icon: "🧭",
          color: "#3498db",
          children: [
            {
              id: "roam-gank",
              label: "支援Gank",
              icon: "🎯",
              color: "#3498db",
              details: [
                { title: "路线选择", text: "优先从河道走（速度快）。如果有视野，绕后从三角草丛进入" },
                { title: "信号沟通", text: "提前3-5秒Ping信号。让队友准备控制/准备接战" },
                { title: "进场时机", text: "等队友先吸引对方注意力再进。不要冲在最前面" },
                { title: "失败处理", text: "没杀到人就快速回线。不要恋战！" },
              ],
            },
            {
              id: "roam-fake",
              label: "假游走（消失压力）",
              icon: "👻",
              color: "#3498db",
              details: [
                { title: "什么是假游走", text: "推完线后消失在敌方视野，但并不真的去gank。而是在河道/野区刷野/做视野" },
                { title: "为什么有效", text: "你消失 = 侧线敌人必须后退。不需要真的gank就能帮队友减压" },
                { title: "实际操作", text: "推线 → 走入河道 → 插/排眼 → 拿河蟹/水果 → 回线" },
                { title: "高段位必备", text: "翡翠以上，假游走比真游走更常用。因为对手会联防" },
              ],
            },
            {
              id: "roam-invade",
              label: "入侵敌方野区",
              icon: "🐺",
              color: "#3498db",
              details: [
                { title: "什么时候入侵", text: "你的打野在对面半边 / 敌方打野被看到在另一侧 / 你推完线有时间" },
                { title: "做什么", text: "偷敌方野怪 / 做深度视野 / 在野区蹲人" },
                { title: "风险控制", text: "必须有视野信息。如果不知道敌方打野和对方中单位置，不要深入" },
                { title: "收益", text: "偷一个蓝buff = 让敌方中单缺蓝。深度眼位 = 信息优势" },
              ],
            },
          ],
        },
        {
          id: "vision",
          label: "视野控制",
          icon: "👁️",
          color: "#3498db",
          details: [
            { title: "中单必插眼位", text: "① 河道草丛（防gank基础眼） ② 敌方鸡窝旁（追踪打野动向） ③ 龙/先锋坑口" },
            { title: "排眼优先级", text: "控制守卫 > 插眼。先排掉对方视野再做事" },
            { title: "购买习惯", text: "每次回城都买控制守卫（75金）。翡翠段最大视野差距来源" },
            { title: "时机", text: "推完线后利用时间窗口做视野。不要为了做视野丢兵" },
          ],
        },
      ],
    },
    {
      id: "midgame",
      label: "中期决策（14-25分钟）",
      icon: "🎯",
      color: "#e67e22",
      children: [
        {
          id: "advantage-convert",
          label: "优势转化（核心课题）",
          icon: "💰",
          color: "#e67e22",
          details: [
            { title: "总原则", text: "击杀 → 推塔/做龙 → 扩大视野 → 更多击杀。杀人不推塔 = 白杀" },
            { title: "击杀后黄金3秒决策", text: "Kill后立即想：① 能推塔吗？ ② 能做龙吗？ ③ 能入侵野区吗？ ④ 都不行就推线回城买装备" },
          ],
          children: [
            {
              id: "after-kill",
              label: "击杀后决策树",
              icon: "🌳",
              color: "#e67e22",
              details: [
                { title: "杀了对面中单", text: "→ 推中塔 → 如果塔下不了就转游走/做龙" },
                { title: "团灭或杀2-3人", text: "→ 优先大龙/推高地 > 小龙 > 推外塔" },
                { title: "小规模击杀(1人)", text: "→ 推最近的塔 > 做附近野区 > 做视野" },
                { title: "你也残血", text: "→ 不要贪！回城买装备。活着的你 > 可能的额外收益" },
              ],
            },
            {
              id: "tower-play",
              label: "推塔策略",
              icon: "🏗️",
              color: "#e67e22",
              details: [
                { title: "推塔优先级", text: "中一塔 > 下一塔（龙控制） > 上一塔" },
                { title: "镀层经济", text: "14分钟前尽量拿镀层。每层160金 = 半个大件" },
                { title: "利用兵线", text: "有炮车波时推塔效率最高。没兵线不要硬啃塔" },
                { title: "配合刺客打法", text: "中路推完塔后轮换到有塔的侧线继续推进" },
              ],
            },
          ],
        },
        {
          id: "objective-control",
          label: "资源争夺",
          icon: "🐉",
          color: "#e67e22",
          children: [
            {
              id: "dragon",
              label: "小龙控制",
              icon: "🔥",
              color: "#e67e22",
              details: [
                { title: "优先级", text: "第3条龙开始必须争。龙魂 = 巨大团队增益" },
                { title: "提前准备", text: "龙刷新前60秒：推中线 → 走下半区 → 排/插眼 → 等队友集合" },
                { title: "中单角色", text: "提供伤害 + 区域控制。站在龙坑外侧，防止敌人抢龙" },
                { title: "放弃判断", text: "如果队伍人数劣势（少1-2人）或大部分人残血，果断放弃转做其他" },
              ],
            },
            {
              id: "herald-baron",
              label: "先锋 / 大龙",
              icon: "👹",
              color: "#e67e22",
              details: [
                { title: "先锋(前14分)", text: "杀了对面中/上后优先做先锋。先锋用在最弱的塔上" },
                { title: "大龙时机", text: "① 对方有人刚死 ② 你们刚赢团战 ③ 对方被迫去守侧线" },
                { title: "大龙前准备", text: "控制上半区视野 → 中路推线 → 引诱对方做决策失误" },
                { title: "50/50大龙", text: "尽量避免。如果敌方惩戒打野活着，要么先杀打野要么不做" },
              ],
            },
          ],
        },
        {
          id: "sidelane",
          label: "中期轮换与带线",
          icon: "↔️",
          color: "#e67e22",
          details: [
            { title: "何时去侧线", text: "中路塔破后，中路变得危险。转到侧线推进更安全" },
            { title: "刺客带线原则", text: "推到河道视野范围内就回撤。不要深入到没有视野的地方" },
            { title: "131 vs 1-3-1", text: "刺客型中单通常打1-3-1：你带一路，强势侧线带另一路，3人中路拖延" },
            { title: "TP使用", text: "有TP的中单可以大胆带线。关键团战用TP支援" },
          ],
          children: [
            {
              id: "side-safe",
              label: "安全带线检查清单",
              icon: "✅",
              color: "#e67e22",
              details: [
                { title: "✓ 视野", text: "河道和敌方野区有眼，能看到敌人来抓你" },
                { title: "✓ 队友位置", text: "队友在地图另一侧施压，敌方不可能全来抓你" },
                { title: "✓ 逃生手段", text: "你有闪现/位移技能可以逃跑" },
                { title: "✓ 兵线位置", text: "不要推过河道。推到河口就回撤或去做视野" },
                { title: "✗ 危险信号", text: "地图上看不到3个以上敌人 = 立刻后撤！" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "teamfight",
      label: "团战",
      icon: "🤺",
      color: "#9b59b6",
      children: [
        {
          id: "tf-role",
          label: "中单团战定位",
          icon: "🎭",
          color: "#9b59b6",
          details: [
            { title: "刺客型（小鱼人/劫/泰隆）", text: "等团战开始后3-5秒再进场。目标：秒杀后排C位。你是收割者，不是发起者" },
            { title: "法刺型（赛拉斯/阿卡丽）", text: "寻找侧翼进场角度。可以在团战中期切入" },
            { title: "法师型（瑞兹/奥莉安娜）", text: "跟队友站一起，提供持续AOE输出" },
          ],
          children: [
            {
              id: "tf-assassin",
              label: "刺客团战详解",
              icon: "🗡️",
              color: "#9b59b6",
              details: [
                { title: "第一原则", text: "永远不要第一个进场！等队友吸引火力再切入" },
                { title: "等什么", text: "等对方关键控制技能交了（如锤石Q、莫甘娜Q、拉克丝Q）" },
                { title: "切谁", text: "最有价值且最能杀的目标：AD > AP > 辅助 > 上单 > 坦克" },
                { title: "切不到怎么办", text: "如果后排被保护得很好 → 转打侧翼骚扰 / 帮队友打前排也行" },
                { title: "逃生规划", text: "进场前就想好怎么出来。小鱼人E、劫W回影、泰隆跳墙" },
              ],
            },
            {
              id: "tf-timing",
              label: "进场时机",
              icon: "⏱️",
              color: "#9b59b6",
              details: [
                { title: "完美进场", text: "团战已经打了3-5秒 + 对方关键控制交了 + 你的目标暴露了" },
                { title: "可以进场", text: "有队友牵制 + 目标血量不满 + 你有闪现保底" },
                { title: "绝对不进", text: "你是唯一切入点 + 对方控制全在 + 你没有闪现" },
                { title: "清理阶段", text: "团战后期，敌方残血逃跑时 = 你的收割时间" },
              ],
            },
          ],
        },
        {
          id: "tf-position",
          label: "团战站位",
          icon: "📍",
          color: "#9b59b6",
          details: [
            { title: "开团前", text: "站在队伍侧面或后方。不要暴露在最前面" },
            { title: "地形利用", text: "利用墙壁/草丛隐藏自己。对方不知道你在哪 = 他们必须分心提防" },
            { title: "侧翼位", text: "刺客最好从侧面/后方进场，不要正面冲" },
            { title: "视野优先", text: "团战前确保关键草丛有视野。黑暗中的团战 = 赌博" },
          ],
        },
        {
          id: "tf-target",
          label: "目标选择优先级",
          icon: "🎯",
          color: "#9b59b6",
          details: [
            { title: "理想目标", text: "落单/走位失误的后排C位（ADC或AP输出）" },
            { title: "次优目标", text: "已经被消耗到半血的任何人" },
            { title: "可接受目标", text: "没有逃生技能的辅助（如璐璐、娜美）" },
            { title: "不要碰", text: "满血坦克/有护盾的目标。除非他是唯一的选择" },
            { title: "灵活调整", text: "如果ADC有很强保护（露露+日女），转打中路或野区英雄" },
          ],
        },
        {
          id: "tf-lose",
          label: "劣势团战处理",
          icon: "🏳️",
          color: "#9b59b6",
          details: [
            { title: "经济落后时", text: "不要正面开团。利用视野打小规模战斗（2v2, 3v3）" },
            { title: "人数劣势", text: "4v5不要打！除非对方核心刚好被抓。波线防守等队友复活" },
            { title: "防守团战", text: "在塔下/狭窄地形作战。利用中单AOE清兵线守塔" },
            { title: "翻盘思路", text: "寻找对方落单的机会 → 秒杀1人变成5v4 → 立刻开龙/推塔" },
          ],
        },
      ],
    },
    {
      id: "mental",
      label: "心态与习惯",
      icon: "🧠",
      color: "#1abc9c",
      children: [
        {
          id: "tilt-control",
          label: "心态管理",
          icon: "😤",
          color: "#1abc9c",
          details: [
            { title: "核心认知", text: "你只能影响30-40%的比赛结果。有些比赛注定赢不了，接受它" },
            { title: "死亡后3秒", text: "不要想'为什么我会死'，而是想'下次同样情况我怎么避免'" },
            { title: "队友失误", text: "屏蔽聊天。Ping信号沟通就够了。打字骂人 = 分心 = 下一波也输" },
            { title: "连败时", text: "连输2-3把就停。去喝水/上厕所/休息15分钟。上头打只会继续输" },
          ],
        },
        {
          id: "habits",
          label: "好习惯养成",
          icon: "📋",
          color: "#1abc9c",
          details: [
            { title: "每10秒看小地图", text: "设计一个触发器：每次补到炮车就看一眼小地图" },
            { title: "Tab键信息", text: "每30秒按Tab看双方装备。知道对方出了什么 = 知道怎么打" },
            { title: "回城前检查", text: "回城前想3个问题：① 兵线推了吗 ② 买什么 ③ 回来做什么" },
            { title: "复盘习惯", text: "每天至少看1局录像。专注分析死亡和团战失误" },
          ],
        },
        {
          id: "improvement",
          label: "高效提升方法",
          icon: "📈",
          color: "#1abc9c",
          details: [
            { title: "一次改一个问题", text: "不要同时改5个毛病。选一个最大的问题（如死亡太多），花1-2周专门改" },
            { title: "量化目标", text: "设定可衡量的目标：如'场均死亡<5次' '每分钟补刀>7.5'" },
            { title: "录像分析", text: "重点看：① 每次死亡前10秒你在干什么 ② 团战你的目标选择对不对 ③ 兵线处理有没有浪费" },
            { title: "英雄池管理", text: "核心2-3个英雄。宁可精通3个不如泛学10个" },
          ],
        },
      ],
    },
    {
      id: "lategame",
      label: "后期决策（25分钟+）",
      icon: "⏳",
      color: "#f39c12",
      children: [
        {
          id: "late-decisions",
          label: "后期大方向",
          icon: "🧭",
          color: "#f39c12",
          details: [
            { title: "一条命的价值", text: "后期死亡 = 50-60秒灰屏 = 可能丢大龙/高地/比赛。绝对不能冒险" },
            { title: "抱团vs带线", text: "后期一般抱团。除非你是强带线英雄(如瑞兹)且队伍有波比清能力" },
            { title: "大龙决策", text: "后期大龙 = 可能结束游戏。要么确定能安全做，要么用大龙逼团" },
            { title: "站位更重要", text: "后期不再是操作决定胜负，是站位和决策" },
          ],
        },
        {
          id: "late-assassin",
          label: "刺客后期生存指南",
          icon: "🥷",
          color: "#f39c12",
          details: [
            { title: "困境", text: "后期ADC有守护天使+输出很高，一套秒不了就会被反杀" },
            { title: "出装调整", text: "后期补防御装：中亚沙漏/女妖面纱/守护天使（AD刺客）" },
            { title: "角色转变", text: "不一定要秒后排。可以转为切脆皮辅助，或者在团战后期收割" },
            { title: "分推考虑", text: "如果团战打不了，不如带线制造压力，逼对方分兵" },
          ],
        },
        {
          id: "late-close",
          label: "收尾/关门技巧",
          icon: "🚪",
          color: "#f39c12",
          details: [
            { title: "赢了团战后", text: "优先级：水晶 > 高地塔 > 大龙 > 小龙。能结束就结束！" },
            { title: "不要贪泉水", text: "追到高地就够了。泉水追杀浪费时间还可能被复活的人翻" },
            { title: "兵线要求", text: "推高地需要至少一波大兵线。没兵线不要硬推" },
            { title: "精神压力", text: "大优势不要放松。保持专注，一波失误可能翻盘" },
          ],
        },
      ],
    },
    {
      id: "itemization",
      label: "出装与符文思路",
      icon: "🛒",
      color: "#2ecc71",
      children: [
        {
          id: "item-logic",
          label: "出装逻辑",
          icon: "🧪",
          color: "#2ecc71",
          details: [
            { title: "核心原则", text: "不要无脑跟推荐出装。根据对局情况灵活调整" },
            { title: "出装三问", text: "① 我需要伤害还是生存？ ② 对面主要威胁是AP还是AD？ ③ 我现在多少钱买什么最值？" },
            { title: "回城时机", text: "有1300金 = 大件。有900金 = 中件+鞋。低于500金 = 可以不回" },
          ],
          children: [
            {
              id: "item-ap",
              label: "AP中单出装思路",
              icon: "💜",
              color: "#2ecc71",
              details: [
                { title: "标准路线", text: "暗影焰/卢登 → 中亚/法穿靴 → 灭世者/虚空 → 防御装" },
                { title: "雪球路线", text: "暗杀时候戒 → 暗影焰 → 灭世者（高风险高回报）" },
                { title: "抗压路线", text: "失落章节 → 中亚沙漏 → 然后再补伤害" },
                { title: "法穿判断", text: "对方不出魔抗 → 平穿鞋+暗影焰够了。对方叠魔抗 → 虚空之杖必出" },
              ],
            },
            {
              id: "item-ad",
              label: "AD中单出装思路",
              icon: "❤️",
              color: "#2ecc71",
              details: [
                { title: "劫标准", text: "黄昏 → 机缘(或幽梦) → 赛瑞尔达 → 防御装" },
                { title: "穿甲判断", text: "对方不出甲 → 平穿就够。对方出甲 → 黑切/赛瑞尔达" },
                { title: "防御装选择", text: "对面AP多 → 女妖/魔女。对面AD多 → 守护天使/死舞" },
              ],
            },
          ],
        },
        {
          id: "rune-logic",
          label: "符文选择思路",
          icon: "🔷",
          color: "#2ecc71",
          details: [
            { title: "主系选择", text: "电刑 = 爆发型（小鱼人/劫）| 征服者 = 持续战斗（赛拉斯/亚索）| 相位猛冲 = 短换（瑞兹）" },
            { title: "副系灵活", text: "坚决 = 对线困难时（骨甲/护盾）| 启迪 = 需要续航（饼干/时间扭曲）| 精密 = 需要砍/韧性" },
            { title: "小符文", text: "攻击力 vs 法强 vs 生命值。根据你英雄和对手调整" },
            { title: "版本关注", text: "符文平衡每个版本都会变。关注版本更新的符文改动" },
          ],
        },
      ],
    },
  ],
};

// Flattened color mapping
const SECTION_COLORS = {
  "#e74c3c": { bg: "rgba(231,76,60,0.08)", border: "rgba(231,76,60,0.25)", text: "#e74c3c", glow: "rgba(231,76,60,0.15)" },
  "#3498db": { bg: "rgba(52,152,219,0.08)", border: "rgba(52,152,219,0.25)", text: "#3498db", glow: "rgba(52,152,219,0.15)" },
  "#e67e22": { bg: "rgba(230,126,34,0.08)", border: "rgba(230,126,34,0.25)", text: "#e67e22", glow: "rgba(230,126,34,0.15)" },
  "#9b59b6": { bg: "rgba(155,89,182,0.08)", border: "rgba(155,89,182,0.25)", text: "#9b59b6", glow: "rgba(155,89,182,0.15)" },
  "#1abc9c": { bg: "rgba(26,188,156,0.08)", border: "rgba(26,188,156,0.25)", text: "#1abc9c", glow: "rgba(26,188,156,0.15)" },
  "#f39c12": { bg: "rgba(243,156,18,0.08)", border: "rgba(243,156,18,0.25)", text: "#f39c12", glow: "rgba(243,156,18,0.15)" },
  "#2ecc71": { bg: "rgba(46,204,113,0.08)", border: "rgba(46,204,113,0.25)", text: "#2ecc71", glow: "rgba(46,204,113,0.15)" },
};

function DetailCard({ detail, color }) {
  const scheme = SECTION_COLORS[color] || SECTION_COLORS["#3498db"];
  return (
    <div style={{
      padding: "10px 14px",
      marginBottom: "8px",
      background: scheme.bg,
      borderLeft: `3px solid ${scheme.border}`,
      borderRadius: "6px",
    }}>
      <div style={{ fontWeight: 700, fontSize: "13px", color: scheme.text, marginBottom: "4px", letterSpacing: "0.02em" }}>
        {detail.title}
      </div>
      <div style={{ fontSize: "13px", color: "#c8ccd4", lineHeight: "1.6" }}>
        {detail.text}
      </div>
    </div>
  );
}

function TreeNode({ node, depth = 0, parentColor }) {
  const [open, setOpen] = useState(depth < 1);
  const color = node.color || parentColor || "#3498db";
  const scheme = SECTION_COLORS[color] || SECTION_COLORS["#3498db"];
  const hasChildren = (node.children && node.children.length > 0) || (node.details && node.details.length > 0);

  return (
    <div style={{ marginLeft: depth > 0 ? (depth > 1 ? 16 : 8) : 0, marginBottom: depth === 0 ? 6 : 2 }}>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: depth === 0 ? "14px 18px" : depth === 1 ? "10px 14px" : "8px 12px",
          borderRadius: "10px",
          cursor: hasChildren ? "pointer" : "default",
          background: open && depth === 0 ? scheme.bg : "transparent",
          border: depth === 0 ? `1px solid ${open ? scheme.border : "rgba(255,255,255,0.06)"}` : "1px solid transparent",
          transition: "all 0.2s ease",
          marginBottom: "2px",
        }}
        onMouseEnter={e => {
          if (hasChildren) {
            e.currentTarget.style.background = scheme.bg;
            e.currentTarget.style.borderColor = scheme.border;
          }
        }}
        onMouseLeave={e => {
          if (!open || depth !== 0) {
            e.currentTarget.style.background = open && depth === 0 ? scheme.bg : "transparent";
            e.currentTarget.style.borderColor = depth === 0 ? (open ? scheme.border : "rgba(255,255,255,0.06)") : "transparent";
          }
        }}
      >
        {hasChildren && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "18px",
            height: "18px",
            fontSize: "11px",
            color: scheme.text,
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}>
            ▶
          </span>
        )}
        {!hasChildren && <span style={{ width: "18px", flexShrink: 0 }} />}
        <span style={{ fontSize: depth === 0 ? "18px" : "15px", flexShrink: 0 }}>{node.icon}</span>
        <span style={{
          fontSize: depth === 0 ? "16px" : depth === 1 ? "14px" : "13px",
          fontWeight: depth === 0 ? 700 : depth === 1 ? 600 : 500,
          color: depth === 0 ? scheme.text : depth === 1 ? "#e0e4ea" : "#b8bcc6",
          letterSpacing: depth === 0 ? "0.03em" : "0.01em",
        }}>
          {node.label}
        </span>
      </div>

      {open && (
        <div style={{
          marginLeft: depth === 0 ? 24 : 20,
          paddingLeft: 12,
          borderLeft: `2px solid ${scheme.border}`,
          marginTop: 4,
          marginBottom: 8,
        }}>
          {node.details && node.details.map((d, i) => (
            <DetailCard key={i} detail={d} color={color} />
          ))}
          {node.children && node.children.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} parentColor={color} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuickNav({ data, onNavigate }) {
  return (
    <div style={{
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginBottom: "20px",
      padding: "16px",
      background: "rgba(255,255,255,0.02)",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {data.children.map(child => {
        const scheme = SECTION_COLORS[child.color];
        return (
          <button
            key={child.id}
            onClick={() => onNavigate(child.id)}
            style={{
              padding: "8px 14px",
              background: scheme.bg,
              border: `1px solid ${scheme.border}`,
              borderRadius: "8px",
              color: scheme.text,
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = scheme.border;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = scheme.bg;
              e.currentTarget.style.color = scheme.text;
            }}
          >
            {child.icon} {child.label}
          </button>
        );
      })}
    </div>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div style={{
      position: "relative",
      marginBottom: "16px",
    }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="搜索关键词... 如: 游走、团战、出装、冻结"
        style={{
          width: "100%",
          padding: "12px 16px 12px 40px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          color: "#e0e4ea",
          fontSize: "14px",
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
        onFocus={e => e.currentTarget.style.borderColor = "rgba(52,152,219,0.5)"}
        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
      />
      <span style={{
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "16px",
        opacity: 0.5,
      }}>🔍</span>
    </div>
  );
}

function filterTree(node, query) {
  if (!query) return node;
  const q = query.toLowerCase();

  const labelMatch = node.label.toLowerCase().includes(q);
  const detailMatch = node.details?.some(d =>
    d.title.toLowerCase().includes(q) || d.text.toLowerCase().includes(q)
  );

  const filteredChildren = node.children
    ?.map(c => filterTree(c, query))
    .filter(Boolean);

  if (labelMatch || detailMatch || (filteredChildren && filteredChildren.length > 0)) {
    return { ...node, children: filteredChildren || node.children };
  }
  return null;
}

export default function MidLaneMindMap() {
  const [search, setSearch] = useState("");

  const filteredData = search
    ? { ...MIND_MAP_DATA, children: MIND_MAP_DATA.children.map(c => filterTree(c, search)).filter(Boolean) }
    : MIND_MAP_DATA;

  const handleNavigate = useCallback((id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f1117",
      color: "#e0e4ea",
      fontFamily: "'Noto Sans SC', 'PingFang SC', -apple-system, sans-serif",
      padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "28px",
        padding: "24px",
        background: "linear-gradient(135deg, rgba(52,152,219,0.08), rgba(155,89,182,0.08))",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏰</div>
        <h1 style={{
          fontSize: "24px",
          fontWeight: 700,
          margin: "0 0 8px 0",
          background: "linear-gradient(135deg, #3498db, #9b59b6, #e74c3c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.05em",
        }}>
          中单全面决策思维导图
        </h1>
        <p style={{
          fontSize: "13px",
          color: "#8892a0",
          margin: 0,
          letterSpacing: "0.02em",
        }}>
          从对线到收尾 · 点击展开每个节点查看详细策略
        </p>
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Quick Nav */}
      {!search && <QuickNav data={MIND_MAP_DATA} onNavigate={handleNavigate} />}

      {/* Tree */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "16px",
      }}>
        {filteredData.children && filteredData.children.length > 0 ? (
          filteredData.children.map(child => (
            <div key={child.id} id={`section-${child.id}`}>
              <TreeNode node={child} depth={0} />
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            没有找到匹配的内容，试试其他关键词
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        marginTop: "20px",
        padding: "14px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.04)",
      }}>
        {[
          { label: "主题分类", value: "6", color: "#3498db" },
          { label: "决策节点", value: "30+", color: "#e67e22" },
          { label: "策略要点", value: "150+", color: "#2ecc71" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
