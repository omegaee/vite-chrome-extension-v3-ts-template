# Vite + TS -- Chrome-V3扩展模板

- 干净的模板 -- 无多余的依赖
- 可扩展依赖
- 快速开始
- Vite + TS

### 快速开始

```sh
# clone模板
git clone https://github.com/omegaee/vite-chrome-extension-v3-ts-template.git my-extension
# 进入模板
cd my-extension
# 安装依赖
npm install
```

### 开发

1. 进入扩展目录 -- `cd my-extension`
2. 监听文件修改并快速解析构建 -- `npm run dev`
2. 进入浏览器 > 扩展管理 > 加载解压缩的扩展
3. 选择: `my-extension/dist/dev`目录

### 命令

```
# (开发)监听文件修改并快速解析构建到dist/dev
npm run dev

# (开发)构建项目到dist/dev
npm run build:dev

# (发布)打包构建项目到dist/release
npm run build:release
```

