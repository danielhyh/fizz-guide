# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VitePress (1.6.4) 静态文档站点 — 英雄联盟中单知识库，内容全部为中文。

## Commands

```bash
npm run dev      # 启动开发服务器 (vitepress dev docs)
npm run build    # 构建静态站点 (vitepress build docs)
npm run preview  # 预览构建产物 (vitepress preview docs)
```

## Architecture

```
docs/                          # VitePress 内容根目录
├── .vitepress/config.mts      # 站点配置（导航、侧边栏、搜索）
├── .vitepress/theme/
│   ├── index.ts               # 自定义主题入口，注册全局 Vue 组件
│   ├── components/            # Vue 组件
│   │   ├── MidlaneMindmap.vue # 中单全景知识树（搜索+展开折叠）
│   │   ├── TreeNode.vue       # 递归树节点（被 MidlaneMindmap 使用）
│   │   └── Markmap.vue        # 通用 Markdown→思维导图渲染器
│   └── data/
│       └── midlane-data.ts    # 中单知识树的数据源（编辑内容改这里）
├── champions/fizz/            # Fizz 英雄专区（对线、连招、符文、对局）
│   └── matchups/{assassins,mages,special}/
├── game/                      # 通用游戏理解（游走、视野、团战、心态）
│   └── panorama/midlane.md    # 使用 <MidlaneMindmap /> 组件
└── index.md                   # 首页
```

### Key Patterns

- **侧边栏和导航**在 `docs/.vitepress/config.mts` 的 `sidebar` / `nav` 中配置。添加新页面时需同步更新。
- **自定义 Vue 组件**在 `theme/index.ts` 中通过 `app.component()` 注册为全局组件，可直接在 `.md` 文件中使用。
- **知识树数据**存储在 `theme/data/midlane-data.ts`，结构为 `{ id, label, icon, color?, details?, children? }`。`MidlaneMindmap.vue` 通过 `provide/inject` 向递归的 `TreeNode.vue` 传递状态（expandedIds、searchQuery）。
- **新增分路全景**：在 `theme/data/` 下创建对应数据文件，复制 `MidlaneMindmap.vue` 改为导入新数据，在 `theme/index.ts` 注册，然后在 `game/panorama/` 下创建 `.md` 页面引用即可。
- **新增英雄**：在 `champions/` 下建目录，在 `config.mts` 的 sidebar 和 nav 中添加对应路由。

### Dependencies

- `markmap-lib` / `markmap-view` / `markmap-toolbar` — Markmap 思维导图渲染（`Markmap.vue` 使用）
- 项目使用 VitePress 内置的 Vue 3，无需额外安装 Vue

## Conventions

- 所有用户可见文本使用中文
- 组件中使用 VitePress CSS 变量（`--vp-c-*`）适配明暗主题
- 需要 SSR 兼容时用 `<ClientOnly>` 包裹或动态 `import()`
