import { readFileAsync, writeFileAsync } from './../utils/utils';
import config, { extConfig } from '../config';
import { log } from './../utils/utils';
import merge from 'lodash/merge';
import path from 'path';
/**
 * stage1
 * 
 * @description 阶段1 进行文件预处理, 包括处理脚本的Aid, DomainUrl以及添加视频plugin等
 */
export default function run() {
  const target = config.wxappTargetPath;

  return Promise.all([
    editExtFile(target, config.wxappExt__DEV),
    commentVideoWxmlCode(target),
  ])
    .catch((err) => {
      log.error(err)
      log.error('stage 1 失败, 即将回滚');
    })
}


let originalExtFile: string;
function editExtFile(target: string, extconfig: extConfig) {
  const targetPath = path.resolve(`${target}/ext.json`);
  return readFileAsync(targetPath, 'utf-8')
    .then((data) => {
      originalExtFile = data;
      let result = JSON.parse(data);
      if (!result) throw Error('文件内容为空');
      result = merge({}, result, extconfig);
      return writeFileAsync(targetPath, JSON.stringify(result, null, 2))
      
    })
    .then(() => {
      log.debug(`${target}/ext.json 修改成功`);
    })
}

let originalVideoFile: string;
function commentVideoWxmlCode(target: string) {
  const targetPath = path.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
  return readFileAsync(targetPath, 'utf-8')
    .then((file) => {
      originalExtFile = file;
      if(!/<!--\s*<tx-video/.test(file)) {
        const startReg = new RegExp("<tx-video", "g");
        const endReg = new RegExp("</tx-video>", "g");
        const newstr = file.replace(startReg, "<!--<tx-video").replace(endReg, "</tx-video>-->");

        if(newstr) {
          return writeFileAsync(targetPath, newstr)
        }
      } 
    })
    .then(() => {
      log.debug(`${targetPath} 注释成功`);
    })
}

function uncommentVideoWxmlCode(target: string) {
  const targetPath = path.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
  return readFileAsync(targetPath, 'utf-8')
    .then((file) => {
      originalExtFile = file;
      if(/<!--\s*<tx-video/.test(file)) {
        const startReg = new RegExp("<!--<tx-video", "g");
        const endReg = new RegExp("</tx-video>-->", "g");
        const newstr = file.replace(startReg, "<tx-video").replace(endReg, "</tx-video>");

        if(newstr) {
          return writeFileAsync(targetPath, newstr)
        }
      } 
    })
    .then(() => {
      log.debug(`${targetPath} 取消注释成功`);
    })
}

