import type { Plugin, InputOptions, OutputOptions,  NormalizedOutputOptions, OutputBundle } from 'rollup';
import fs from 'fs'
import path from 'path';

let url = 'manifest.json'
const manifestPath = path.resolve(process.cwd(), url);

type Manifest = {
  content: string,
  value: {[key: string]: any},
}

let manifest: Manifest;
let lastInput: string[];
let needUpdate = true

/**
 * update manifest.json
 */
const updateManifest = function () {
  const content = fs.readFileSync(manifestPath, 'utf8')
  if(manifest && content === manifest.content){
    return
  }
  manifest = {
    content,
    value: JSON.parse(content)
  }
  lastInput = undefined
  needUpdate = true
}

let changeTimer: NodeJS.Timeout;  // change may trigger multiple times
/**
 * watch manifest.json
 */
const watchManifest = function () {
  updateManifest()
  fs.watch(manifestPath, (eventType, filename) => {
    if(eventType === 'change'){
      clearTimeout(changeTimer)
      changeTimer = setTimeout(() => {
        const input = lastInput?.[0]
        updateManifest()
        if(input){
          const time = new Date();
          fs.utimesSync(input, time, time);
        }
      }, 500)
    }
  });
}

/**
 * modify options
 * @param opts rollup options
 */
const options = (opts: InputOptions): InputOptions => {
  if(!manifest)return

  // lastInput exist
  if(lastInput){
    opts.input = lastInput
    return opts
  }

  // lastInput not exist
  lastInput = []

  // popup
  if (manifest.value.action?.default_popup) {
    lastInput.push(manifest.value.action.default_popup)
  }

  // background
  if (manifest.value.background?.service_worker) {
    lastInput.push(manifest.value.background.service_worker)
  }

  // content
  const contents: any[] | undefined = manifest.value.content_scripts
  contents?.forEach((content) => {
    if (content?.js){
      lastInput.push(...content.js)
    }
    if(content?.css){
      lastInput.push(...content.css)
    }
  })

  // resources
  const web_resources: any[] | undefined = manifest.value.web_accessible_resources
  web_resources?.forEach((web_resource) => {
    lastInput.push(...web_resource.resources)
  })

  opts.input = lastInput
  return opts;
}

/**
 * modify output options
 * @param opts 
 */
const outputOptions = function (opts: OutputOptions) {
  // assets/[name]-[hash].js
  
}

/**
 * copy manifest to outdir
 */
const generateBundle = function (opts: NormalizedOutputOptions, bundle: OutputBundle, isWrite: boolean) {
  if(needUpdate){
    Object.entries(bundle).forEach(([fileName, chunk]) => {
      // Absolute Path
      const srcPath: string = chunk['facadeModuleId']
      if(!srcPath)return
      if(srcPath.split('.').at(-1)?.indexOf('html') !== -1)return

      // popup
      const popup: string | undefined = manifest.value.action?.default_popup
      if (popup) {
        const abs = path.resolve(popup)
        if(abs === srcPath){
          manifest.value.action.default_popup = fileName
          return
        }
      }

      // background
      const worker = manifest.value.background?.service_worker
      if (worker) {
        const abs = path.resolve(worker)
        if(abs === srcPath){
          manifest.value.background.service_worker = fileName
          return
        }
      }

      // content
      const contents: any[] | undefined = manifest.value.content_scripts
      if(contents){
        for(const content of contents){
          // js
          const jsArr: string[] | undefined = content?.js
          if (jsArr){
            let index: number = -1
            for(let i = 0; i < jsArr.length; ++i){
              const abs = path.resolve(jsArr[i])
              if(srcPath === abs){
                index = i
                break
              }
            }
            if(index != -1){
              content.js[index] = fileName
              return
            }
          }
          // css
          const cssArr: string[] | undefined = content?.css
          if (cssArr){
            let index: number = -1
            for(let i = 0; i < cssArr.length; ++i){
              const abs = path.resolve(cssArr[i])
              if(srcPath === abs){
                index = i
                break
              }
            }
            if(index != -1){
              content.css[index] = fileName
              return
            }
          }
        }
      }

      // resources
      const web_resources: any[] | undefined = manifest.value.web_accessible_resources
      if(web_resources){
        for(const web_resource of web_resources){
          // resources
          const resArr: string[] | undefined = web_resource?.resources
          if (resArr){
            let index: number = -1
            for(let i = 0; i < resArr.length; ++i){
              const abs = path.resolve(resArr[i])
              if(srcPath === abs){
                index = i
                break
              }
            }
            if(index != -1){
              web_resource.resources[index] = fileName
              return
            }
          }
        }
      }
    })


    this.emitFile({
      type: 'asset',
      fileName: 'manifest.json',
      source: JSON.stringify(manifest.value, null, 2)
    });
    needUpdate = false
  }
}

export default (): Plugin => {
  watchManifest()
  return {
    name: 'ex-build',
    options,
    outputOptions,
    generateBundle,
  }
}