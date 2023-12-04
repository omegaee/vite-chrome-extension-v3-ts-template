# Vite + TS -- Chrome-Extension-V3模板

- 干净的模板 -- 无多余的依赖
- 可扩展依赖
- 快速开始
- Vite + TS

### 快速开始

```sh
# 克隆模板
git clone https://github.com/omegaee/vite-chrome-extension-v3-ts-template.git my-extension
# 进入模板
cd my-extension
# 安装依赖
npm install
# 开发调试
npm run dev
## 从浏览器扩展管理加载 my-extension/dist/dev
```

### 开发

1. `cd my-extension` -- 进入扩展目录
2. `npm run dev` -- 监听文件修改并快速解析构建
3. 进入浏览器 > 扩展管理 > 加载解压缩的扩展
4. 选择: `my-extension/dist/dev`目录

### 命令

```
# (开发)监听文件修改并快速解析构建到dist/dev
npm run dev

# (开发)构建项目到dist/dev
npm run build:dev

# (发布)打包构建项目到dist/release
npm run build:release
```

### 结构

```
.
├── manifest.json       # 项目入口文件
├── package.json        # npm
├── tsconfig.json       # ts配置
├── tsconfig.node.json  # ts配置
├── vite.config.ts      # vite配置
├── ex-plugin.ts        # extension插件
├── .env.dev            # 开发环境
├── .env.release        # 发布环境
├── src
└   └── vite-env.d.ts   # env常量类型
```
