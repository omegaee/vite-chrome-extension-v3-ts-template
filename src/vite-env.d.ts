/// <reference types="vite/client" />

export interface ImportMetaEnv {
  readonly VITE_ENV: string,  // 环境名字
  readonly VITE_MINIFY: boolean | "terser" | "esbuild",  // 是否压缩
  readonly VITE_WATCH?: boolean,  // 是否开启持续build
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
