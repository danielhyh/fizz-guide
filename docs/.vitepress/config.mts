import {defineConfig} from 'vitepress'

// LOL 心得笔记 - VitePress 配置
export default defineConfig({
  title: 'LOL 心得笔记',
  description: '我的英雄联盟知识库 — 英雄攻略、游戏理解、心态管理',
  lang: 'zh-CN',
  lastUpdated: true,

  themeConfig: {
    // ========== 顶部导航 ==========
    nav: [
      { text: '首页', link: '/' },
      {
        text: '英雄攻略',
        items: [
          { text: '🐟 小鱼人 (Fizz)', link: '/champions/fizz/' },
          // 未来新英雄在这里加一行就行
          // { text: '⚔️ 亚托克斯 (Aatrox)', link: '/champions/aatrox/' },
        ],
      },
      { text: '游戏理解', link: '/game/' },
    ],

    // ========== 侧边栏 ==========
    sidebar: {

      // ---------- Fizz 专区 ----------
      '/champions/fizz/': [
        {
          text: '🐟 小鱼人 (Fizz)',
          items: [
            { text: '英雄总览', link: '/champions/fizz/' },
          ],
        },
        {
          text: '基础体系',
          items: [
            { text: '连招与伤害逻辑', link: '/champions/fizz/combo' },
            { text: '强势期 & 节奏', link: '/champions/fizz/power-spikes' },
            { text: '符文出装', link: '/champions/fizz/runes-items' },
          ],
        },
        {
          text: '对线攻略 — 刺客',
          collapsed: false,
          items: [
            { text: 'vs 劫 (Zed)', link: '/champions/fizz/matchups/assassins/zed' },
            { text: 'vs 阿卡丽 (Akali)', link: '/champions/fizz/matchups/assassins/akali' },
            { text: 'vs 男刀 (Talon)', link: '/champions/fizz/matchups/assassins/talon' },
          ],
        },
        {
          text: '对线攻略 — 法师',
          collapsed: false,
          items: [
            { text: 'vs 辛德拉 (Syndra)', link: '/champions/fizz/matchups/mages/syndra' },
            { text: 'vs 发条 (Orianna)', link: '/champions/fizz/matchups/mages/orianna' },
            { text: 'vs 拉克丝 (Lux)', link: '/champions/fizz/matchups/mages/lux' },
          ],
        },
        {
          text: '对线攻略 — 特殊',
          collapsed: false,
          items: [
            { text: 'vs 加里奥 (Galio)', link: '/champions/fizz/matchups/special/galio' },
            { text: 'vs 卡萨丁 (Kassadin)', link: '/champions/fizz/matchups/special/kassadin' },
          ],
        },
      ],

      // ---------- 未来新英雄的侧边栏模板 ----------
      // '/champions/aatrox/': [
      //   {
      //     text: '⚔️ 亚托克斯 (Aatrox)',
      //     items: [
      //       { text: '英雄总览', link: '/champions/aatrox/' },
      //     ],
      //   },
      // ],

      // ---------- 游戏理解 ----------
      '/game/': [
        {
          text: '🎮 游戏理解',
          items: [
            { text: '总览', link: '/game/' },
          ],
        },
        {
          text: '🗺️ 宏观思路',
          items: [
            { text: '游走时机与路线', link: '/game/roaming' },
            { text: '视野控制', link: '/game/vision' },
            { text: '团战定位与切入', link: '/game/teamfight' },
          ],
        },
        {
          text: '🧠 心态管理',
          items: [
            { text: 'Ranked 心态', link: '/game/ranked-mental' },
          ],
        },
        {
          text: '🗺️ 分路全景理解',
          collapsed: false,
          items: [
            { text: '中单全景', link: '/game/panorama/midlane' },
          ],
        },
      ],
    },

    // ========== 社交链接 ==========
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username/lol-notes' },
    ],

    // ========== 全文搜索 ==========
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除搜索',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    // ========== 界面文字 ==========
    docFooter: { prev: '上一篇', next: '下一篇' },
    outline: { label: '本页目录', level: [2, 3] },
    lastUpdated: { text: '最后更新' },
    returnToTopLabel: '回到顶部',
  },

  markdown: {
    lineNumbers: false,
  },
})
