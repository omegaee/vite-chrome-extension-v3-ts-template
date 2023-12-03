import { defineConfig, loadEnv  } from 'vite';
import type { ImportMetaEnv } from './src/vite-env'
import exPlugin from './ex-plugin'

export default (({mode}) => {
  const env = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv;

  return defineConfig({
    plugins: [exPlugin()],
    build: {
      outDir: 'dist/' + env.VITE_ENV,
      minify: env.VITE_MINIFY,
    }
  });
})