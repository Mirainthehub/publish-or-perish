# Contributing to Publish or Perish | 为不发表就出局贡献

Thank you for your interest in contributing to Publish or Perish! This document provides guidelines for contributing to the project.

感谢您对为不发表就出局项目贡献代码的兴趣！本文档提供了项目贡献指南。

## English

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/publish-or-perish.git
   cd publish-or-perish
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following the coding standards
3. **Test your changes**:
   ```bash
   npm run test
   npm run lint
   ```
4. **Commit your changes**:
   ```bash
   git commit -m "feat: add amazing new feature"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** on GitHub

### Coding Standards

- **TypeScript**: Use strict TypeScript with proper type definitions
- **React**: Follow React best practices and hooks conventions
- **Formatting**: Code will be automatically formatted with ESLint
- **Testing**: Add tests for new features and bug fixes
- **Accessibility**: Ensure WCAG AA compliance
- **Internationalization**: Support both English and Chinese

### Commit Message Format

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or updates
- `chore`: Build process or auxiliary tool changes

### Testing

- Run tests with: `npm run test`
- Run tests with UI: `npm run test:ui`
- Generate coverage: `npm run test:coverage`
- All tests must pass before merging

### Pull Request Guidelines

- **Clear description**: Explain what the PR does and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how the changes were tested
- **Breaking changes**: Clearly mark any breaking changes
- **Bilingual**: Update both English and Chinese text when applicable

### Reporting Issues

When reporting bugs or requesting features:

1. **Search existing issues** first
2. **Use the issue templates** provided
3. **Provide clear reproduction steps** for bugs
4. **Include system information** (OS, browser, version)
5. **Add screenshots** if relevant

---

## 中文

### 开始贡献

1. **Fork 仓库** 在 GitHub 上
2. **克隆您的 fork** 到本地：
   ```bash
   git clone https://github.com/your-username/publish-or-perish.git
   cd publish-or-perish
   ```
3. **安装依赖**：
   ```bash
   npm install
   ```
4. **运行开发服务器**：
   ```bash
   npm run dev
   ```

### 开发流程

1. **创建功能分支**：
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **按照编码标准进行更改**
3. **测试您的更改**：
   ```bash
   npm run test
   npm run lint
   ```
4. **提交您的更改**：
   ```bash
   git commit -m "feat: add amazing new feature"
   ```
5. **推送到您的 fork**：
   ```bash
   git push origin feature/your-feature-name
   ```
6. **在 GitHub 上创建 Pull Request**

### 编码标准

- **TypeScript**：使用严格的 TypeScript 和适当的类型定义
- **React**：遵循 React 最佳实践和 hooks 约定
- **格式化**：代码将通过 ESLint 自动格式化
- **测试**：为新功能和错误修复添加测试
- **无障碍**：确保符合 WCAG AA 标准
- **国际化**：支持中英文双语

### 提交消息格式

我们遵循[约定式提交](https://conventionalcommits.org/)规范：

```
<类型>(<范围>): <描述>

[可选正文]

[可选脚注]
```

类型：
- `feat`：新功能
- `fix`：错误修复
- `docs`：文档更改
- `style`：代码样式更改
- `refactor`：代码重构
- `test`：测试添加或更新
- `chore`：构建过程或辅助工具更改

### 测试

- 运行测试：`npm run test`
- 运行 UI 测试：`npm run test:ui`
- 生成覆盖率：`npm run test:coverage`
- 所有测试必须在合并前通过

### Pull Request 指南

- **清晰描述**：解释 PR 做什么以及为什么
- **截图**：为 UI 更改包含截图
- **测试**：描述如何测试更改
- **破坏性更改**：清楚标记任何破坏性更改
- **双语**：适用时更新中英文文本

### 报告问题

报告错误或请求功能时：

1. **首先搜索现有问题**
2. **使用提供的问题模板**
3. **为错误提供清晰的重现步骤**
4. **包含系统信息**（操作系统、浏览器、版本）
5. **如果相关，添加截图**

---

## Community Guidelines | 社区准则

- Be respectful and inclusive | 保持尊重和包容
- Help others learn and grow | 帮助他人学习和成长
- Focus on constructive feedback | 专注于建设性反馈
- Welcome newcomers | 欢迎新人
- Follow the code of conduct | 遵守行为准则

Thank you for contributing! | 感谢您的贡献！
