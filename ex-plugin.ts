import { Plugin, InputOptions } from 'rollup';
import fs from 'fs'
import path from 'path';

let url = 'manifest.json'
const manifestPath = path.resolve(process.cwd(), url);

type Manifest = {
  stat: fs.Stats,
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
  if(!manifest){
    // new manifest
    const content = fs.readFileSync(manifestPath, 'utf8')
    manifest = {
      stat: fs.statSync(manifestPath),
      content,
      value: JSON.parse(content)
    }
    lastInput = undefined
    needUpdate = true
  }else{
    const stat = fs.statSync(manifestPath);
    if(stat.atimeMs > manifest.stat.atimeMs){
      // modify manifest
      manifest.stat = stat
      const contetn = fs.readFileSync(manifestPath, 'utf8')
      manifest.content = contetn
      manifest.value = JSON.parse(contetn)
      lastInput = undefined
      needUpdate = true
    }
  }
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
    lastInput.push(manifest.value.action?.default_popup)
  }

  // background
  if (manifest.value.background?.service_worker) {
    lastInput.push(manifest.value.background.service_worker)
  }

  // content
  const contents = manifest.value.content_scripts
  if (contents?.js)lastInput.push(...contents.js)
  if(contents?.css)lastInput.push(...contents.css)

  // resources
  if(manifest.value.web_accessible_resources?.resources){
    lastInput.push(...manifest.value.web_accessible_resources.resources)
  }

  opts.input = lastInput
  return opts;
}

/**
 * copy manifest to outdir
 */
const generateBundle = function () {
  if(needUpdate){
    this.emitFile({
      type: 'asset',
      fileName: 'manifest.json',
      source: manifest.content
    });
    needUpdate = false
  }
}

export default (): Plugin => {
  watchManifest()
  return {
    name: 'ex-build',
    options,
    generateBundle
  }
}