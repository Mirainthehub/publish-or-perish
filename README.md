# Publish or Perish | 不发表就出局

<div align="center">

![Publish or Perish Logo](https://img.shields.io/badge/🎓-Publish_or_Perish-blue?style=for-the-badge)

**A web-based academic board game simulation**  
**一个基于网页的学术棋盘游戏模拟**

[![Live Demo](https://img.shields.io/badge/🚀-Live_Demo-green?style=flat-square)](https://mirainthehub.github.io/publish-or-perish)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

[English](#english) | [中文](#中文)

</div>

---

## English

### 🎮 About the Game

**Publish or Perish** is a strategic board game that simulates the challenges and decisions faced in academic research careers. Players take on the roles of researchers, managing funding, collaborations, and publications while navigating the competitive world of academia.

### ✨ Key Features

- 🎯 **Complete Game Implementation**: All phases from character selection to year-end scoring
- 🌐 **Bilingual Support**: Full English and Chinese localization
- ♿ **Accessibility First**: WCAG AA compliant with keyboard navigation and screen reader support
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UX**: Enhanced UI with animations, transitions, and intuitive interactions
- 💾 **Auto-save System**: Automatic game state persistence with manual save/load options
- ⌨️ **Keyboard Shortcuts**: Full keyboard accessibility for power users
- 🔄 **Real-time Trading**: Interactive trading system with timers and negotiations
- 📊 **Event Logging**: Complete game history with undo functionality
- 🎭 **Rich Characters**: 5 unique academic characters with special abilities
- 🃏 **Diverse Cards**: 100+ cards across research, funding, collaboration, and setback categories

### 🚀 Quick Start

1. **Play Online**: Visit the [live demo](https://mirainthehub.github.io/publish-or-perish)
2. **Test Mode**: Add `?test` to the URL for UX testing: `[demo-url]?test`
3. **Local Development**:
   ```bash
   git clone https://github.com/mirainthehub/publish-or-perish.git
   cd publish-or-perish
   npm install
   npm run dev
   ```

### 🎲 How to Play

1. **Setup**: Choose characters and personalities, determine turn order
2. **Research Phase**: Draw and select research projects
3. **Funding Round**: Compete for grants and funding opportunities
4. **Collaboration**: Build partnerships with other researchers
5. **Trading Phase**: Negotiate resource exchanges with 3-minute timer
6. **Process Round**: Handle mentors, conferences, and setbacks
7. **Year End**: Calculate scores and publications, advance to next year

### ⌨️ Keyboard Controls

| Key | Action |
|-----|--------|
| `?` | Show help overlay |
| `R` | Roll dice (when applicable) |
| `Space` | Confirm action |
| `P` | Publish project |
| `L` | Toggle event log |
| `M` | Toggle mute |
| `H` | Toggle high contrast |
| `X` | Toggle reduced motion |
| `Arrow Keys` | Navigate cards |
| `Enter` | Select/Activate |
| `Esc` | Close modals |

### 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **State Management**: Zustand with persistence
- **Styling**: TailwindCSS with custom design tokens
- **Testing**: Vitest + React Testing Library
- **Deployment**: GitHub Pages
- **Accessibility**: ARIA compliance, keyboard navigation
- **Internationalization**: Custom i18n system

### 📁 Project Structure

```
src/
├── components/          # React components
│   ├── HUD.tsx         # Global game status bar
│   ├── PlayerBoard.tsx # Enhanced player board with tokens
│   ├── DraftRow.tsx    # Card selection with keyboard nav
│   ├── TradePanel.tsx  # Real-time trading interface
│   ├── EventLog.tsx    # Game history with undo
│   ├── Onboarding.tsx  # First-time user tutorial
│   └── ...
├── engine/             # Game logic and state machine
├── store/              # Zustand state management
├── styles/             # Design tokens and themes
├── data/              # Game content (cards, characters)
└── pages/             # Main game and test pages
```

### 🌟 UX Enhancements

- **Global HUD**: Real-time game status with phase descriptions
- **Enhanced Player Boards**: Token chips, progress bars, ghost slots
- **Improved Draft Flow**: Pick order, timers, keyboard navigation
- **Trading System**: Drag & drop, offer management, auto-expiration
- **Event System**: Complete history, search, undo functionality
- **Accessibility**: Screen reader support, high contrast, reduced motion
- **Auto-save**: Periodic saves with visual indicators
- **Responsive Design**: Mobile-first approach with breakpoints

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 中文

### 🎮 关于游戏

**不发表就出局**是一个策略棋盘游戏，模拟学术研究生涯中面临的挑战和决策。玩家扮演研究人员的角色，管理资金、合作和发表，同时在竞争激烈的学术界中导航。

### ✨ 主要特性

- 🎯 **完整游戏实现**：从角色选择到年终计分的所有阶段
- � **双语支持**：完整的中英文本地化
- ♿ **无障碍优先**：符合WCAG AA标准，支持键盘导航和屏幕阅读器
- 📱 **响应式设计**：针对桌面、平板和移动设备优化
- 🎨 **现代UX**：增强的UI，带有动画、过渡和直观交互
- 💾 **自动保存系统**：自动游戏状态持久化，支持手动保存/加载
- ⌨️ **键盘快捷键**：为高级用户提供完整的键盘可访问性
- 🔄 **实时交易**：带有计时器和谈判的交互式交易系统
- 📊 **事件日志**：完整的游戏历史记录，支持撤销功能
- 🎭 **丰富角色**：5个具有特殊能力的独特学术角色
- 🃏 **多样卡牌**：涵盖研究、资金、合作和挫折类别的100+张卡牌

### 🚀 快速开始

1. **在线游玩**：访问[在线演示](https://mirainthehub.github.io/publish-or-perish)
2. **测试模式**：在URL后添加`?test`进行UX测试：`[演示网址]?test`
3. **本地开发**：
   ```bash
   git clone https://github.com/mirainthehub/publish-or-perish.git
   cd publish-or-perish
   npm install
   npm run dev
   ```

### 🎲 游戏玩法

1. **设置**：选择角色和性格，确定回合顺序
2. **研究阶段**：抽取并选择研究项目
3. **资金轮**：竞争补助金和资金机会
4. **合作阶段**：与其他研究人员建立伙伴关系
5. **交易阶段**：在3分钟计时器内协商资源交换
6. **过程轮**：处理导师、会议和挫折
7. **年终**：计算分数和发表，进入下一年

### ⌨️ 键盘控制

| 按键 | 动作 |
|-----|------|
| `?` | 显示帮助覆盖层 |
| `R` | 掷骰子（适用时） |
| `空格` | 确认动作 |
| `P` | 发表项目 |
| `L` | 切换事件日志 |
| `M` | 切换静音 |
| `H` | 切换高对比度 |
| `X` | 切换减少动画 |
| `方向键` | 导航卡牌 |
| `回车` | 选择/激活 |
| `Esc` | 关闭弹窗 |

### 🛠️ 技术栈

- **前端**：React 18 + TypeScript
- **构建工具**：Vite 4
- **状态管理**：Zustand with persistence
- **样式**：TailwindCSS with custom design tokens
- **测试**：Vitest + React Testing Library
- **部署**：GitHub Pages
- **无障碍**：ARIA compliance, keyboard navigation
- **国际化**：Custom i18n system

### 🌟 UX增强功能

- **全局HUD**：带有阶段描述的实时游戏状态
- **增强的玩家面板**：代币芯片、进度条、幽灵槽位
- **改进的选择流程**：选择顺序、计时器、键盘导航
- **交易系统**：拖放、报价管理、自动过期
- **事件系统**：完整历史、搜索、撤销功能
- **无障碍功能**：屏幕阅读器支持、高对比度、减少动画
- **自动保存**：带有视觉指示器的定期保存
- **响应式设计**：移动优先的断点设计

### 🤝 贡献指南

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 打开 Pull Request

### 📄 许可证

该项目采用MIT许可证 - 详情请参阅[LICENSE](LICENSE)文件。

---

<div align="center">

**Made with ❤️ for the academic community**  
**为学术社区用❤️制作**

</div>
