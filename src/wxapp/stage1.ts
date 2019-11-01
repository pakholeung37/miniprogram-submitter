import { rollBackSystem as r } from './../utils/utils';
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


function editExtFile(target: string, extconfig: extConfig) {
  const targetPath = path.resolve(`${target}/ext.json`);
  return r.readFileAsync(targetPath, 'utf-8')
    .then((data) => {
      let result = JSON.parse(<string>data);
      if (!result) throw Error('文件内容为空');
      result = merge({}, result, extconfig);
      return r.writeFileAsync(targetPath, JSON.stringify(result, null, 2))
      
    })
    .then(() => {
      log.debug(`${target}/ext.json 修改成功`);
    })
}

function commentVideoWxmlCode(target: string) {
  const targetPath = path.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
  return r.readFileAsync(targetPath, 'utf-8')
    .then((file) => {
      if(!/<!--\s*<tx-video/.test(<string>file)) {
        const startReg = new RegExp("<tx-video", "g");
        const endReg = new RegExp("</tx-video>", "g");
        const newstr = (<string>file).replace(startReg, "<!--<tx-video").replace(endReg, "</tx-video>-->");

        if(newstr) {
          return r.writeFileAsync(targetPath, newstr)
        }
      } 
    })
    .then(() => {
      log.debug(`${targetPath} 注释成功`);
    })
}

function uncommentVideoWxmlCode(target: string) {
  const targetPath = path.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
  return r.readFileAsync(targetPath, 'utf-8')
    .then((file) => {
      if(/<!--\s*<tx-video/.test(<string>file)) {
        const startReg = new RegExp("<!--<tx-video", "g");
        const endReg = new RegExp("</tx-video>-->", "g");
        const newstr = (<string>file).replace(startReg, "<tx-video").replace(endReg, "</tx-video>");

        if(newstr) {
          return r.writeFileAsync(targetPath, newstr)
        }
      } 
    })
    .then(() => {
      log.debug(`${targetPath} 取消注释成功`);
    })
}

