import { rollBackSystem as r } from './../utils/utils';
import config, { extConfig } from '../config';
import { log } from './../utils/utils';
import merge from 'lodash/merge';
import path from 'path';
import Promise from 'q';

type RunCommand = 
  'dev' |
  'dev-plugin' |
  'oem' |
  'oem-plugin';
/**
 * stage1
 * 
 * @description 阶段1 进行文件预处理, 包括处理脚本的Aid, DomainUrl以及添加视频plugin等
 */
export default function run(command: RunCommand) {
  const target = config.wxappTargetPath;
  

  let promiseArray;
  switch (command) {
    case 'dev':
    case 'oem':
      promiseArray = [
        editExtFile(
          target, 
          command === 'dev' 
            ? config.wxappExt__DEV 
            : config.wxappExt__OEMDEV),
        commentVideoWxmlCode(target),
        delTxVideoComponentJsonTxKey(target),
        delVideoJsonTxKey(target),
        delAppTxVideoPlugin(target),
      ]
      break;
    case 'dev-plugin':
    case 'oem-plugin':
      promiseArray = [
        editExtFile(
          target, 
          command === 'dev-plugin'
          ? config.wxappExt__DEV 
          : config.wxappExt__OEMDEV),
        uncommentVideoWxmlCode(target),
        addTxVideoComponentJsonTxKey(target),
        addVideoJsonTxKey(target),
        addAppTxVideoPlugin(target),
      ]
      break;
    default:
      break;
  }
  if(!promiseArray) throw Error(`command: ${command} 无法识别`)
  return Promise.allSettled(promiseArray)
    .then((results) => {
        const rejectPromise = results.filter(_ => _.state === 'rejected');
        if(rejectPromise.length) {
          rejectPromise.forEach(_ => {
            log.error(_.reason);
          });
          log.error('stage 1 失败, 即将回滚');
          r.rollback()
            .then(() => log.debug('回滚成功'))
            .catch((err) => log.error(err, '回滚失败'));
        } else {
          log.debug('stage 1 成功');
        }
    })
}

/**
 * 修改Ext.json
 *
 * @param {string} target wxapp项目所在根目录
 * @param {extConfig} extconfig ext.json兼容json设置
 * @returns 返回Promise
 */
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
      log.debug(`${targetPath} 修改成功`);
    })
}

/**
 * 注释txVideoComponent.wxml中video相关代码
 * 
 * @param target wxapp项目所在根目录
 * @returns 返回Promise
 */
function commentVideoWxmlCode(target: string) {
  const targetPath = path.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
  return r.readFileAsync(targetPath, 'utf-8')
    .then((file) => {
      if(!/<!--\s*<tx-video/.test(<string>file)) {
        const startTag = new RegExp("<tx-video", "g");
        const endTag = new RegExp("</tx-video>", "g");
        const newstr = (<string>file).replace(startTag, "<!--<tx-video").replace(endTag, "</tx-video>-->");

        if(newstr) {
          return r.writeFileAsync(targetPath, newstr)
        } else {
          log.warn('没找到标签<tx-video>')
          return;
        }
      }
    })
    .then(() => {
      log.debug(`${targetPath} 注释成功`);
    })
}

/**
 * 取消注释txVideoComponent.wxml中video相关代码
 * 
 * @param target wxapp项目所在根目录
 * @returns 返回Promise
 */
function uncommentVideoWxmlCode(target: string) {
  const targetPath = path.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
  return r.readFileAsync(targetPath, 'utf-8')
    .then((file) => {
      if(/<!--\s*<tx-video/.test(<string>file)) {
        const startTag = new RegExp("<!--<tx-video", "g");
        const endTag = new RegExp("</tx-video>-->", "g");
        const newstr = (<string>file).replace(startTag, "<tx-video").replace(endTag, "</tx-video>");

        if(newstr) {
          return r.writeFileAsync(targetPath, newstr)
        } else {
          log.warn('没找到标签<tx-video>')
          return;
        }
      } 
    })
    .then(() => {
      log.debug(`${targetPath} 取消注释成功`);
    })
}

/**
 * 添加txVideoComponent.json中video相关代码
 * 
 * @param target wxapp项目所在根目录
 * @returns 返回Promise
 */
function addTxVideoComponentJsonTxKey(target: string) {
  const targetPath = path.resolve(`${target}/components/txVideoComponent/txVideoComponent.json`);
  return TxKeyToggleFactory('video --add', targetPath);
}

/**
 * 删除txVideoComponent.json中video相关代码
 * 
 * @param target wxapp项目所在根目录
 * @returns 返回Promise
 */
function delTxVideoComponentJsonTxKey(target: string) {
  const targetPath = path.resolve(`${target}/components/txVideoComponent/txVideoComponent.json`);
  return TxKeyToggleFactory('video --delete', targetPath);
}

/**
 * 添加video.json中video相关代码
 * 
 * @param target wxapp项目所在根目录
 * @returns 返回Promise
 */
function addVideoJsonTxKey(target: string) {
  const targetPath = path.resolve(`${target}/components/modules/video/video.json`);
  return TxKeyToggleFactory('video --add', targetPath);
}

/**
 * 删除video.json中video相关代码
 * 
 * @param target wxapp项目所在根目录
 * @returns 返回Promise
 */
function delVideoJsonTxKey(target: string) {
  const targetPath = path.resolve(`${target}/components/modules/video/video.json`);
  return TxKeyToggleFactory('video --delete', targetPath);
}

/**
 * 添加app.json中video相关代码
 * 
 * @param target wxapp项目所在根目录
 * @returns 返回Promise
 */
function addAppTxVideoPlugin(target: string) {
  const targetPath = path.resolve(`${target}/app.json`);
  return TxKeyToggleFactory('app --add', targetPath);
}

/**
 * 删除app.json中video相关代码
 * 
 * @param target wxapp项目所在根目录
 * @returns 返回Promise
 */
function delAppTxVideoPlugin(target: string) {
  const targetPath = path.resolve(`${target}/app.json`);
  return TxKeyToggleFactory('app --delete', targetPath);
}

type ToggleFactoryCommand = 
  'app --add' |
  'app --delete' |
  'video --add' |
  'video --delete';

/**
 * 添加删除工厂方法
 *
 * @param {ToggleFactoryCommand} command
 * @param {string} filePath
 * @returns 返回Promise
 */
function TxKeyToggleFactory(command: ToggleFactoryCommand, filePath: string) {
  const targetPath = filePath;
  return r.readFileAsync(targetPath, 'utf-8')
    .then(result => {
      const data = JSON.parse(<string>result);
      if(!data) throw Error('文件内容为空');
      
      if (command === 'video --add') {
        const txVideoTag = data.usingComponents['tx-video'];  
        if(txVideoTag) {
          log.warn(`${targetPath} 属性tx-video已存在`);
          return;
        }
        data.usingComponents['tx-video'] = "plugin://txvideo/video";

      } else if(command === 'video --delete') {
        const txVideoTag = data.usingComponents['tx-video'];  
        if(!txVideoTag) {
          log.warn(`${targetPath} 属性tx-video不存在`);
          return;
        }
        delete data.usingComponents['tx-video'];

      } else if(command === 'app --add') {
        if(data.plugins['txvideo']) {
          log.warn(`${targetPath} 属性plugins.txvideo已存在`);
          return;
        }
        data.plugins['txvideo'] = config.commonVideoPlugin;
      } else if(command === 'app --delete') {
        
        if(!data.plugins['txvideo']) {
          log.warn(`${targetPath} 属性plugins.txvideo不存在`);
          return;
        }
        delete data.plugins['txvideo'];
      }
      return r.writeFileAsync(targetPath, JSON.stringify(data, null, 2))
        .then(() => {
          if(command === 'app --add') log.debug(`${targetPath} 新增属性plugins.txvideo成功`);
          else if(command === 'app --delete') log.debug(`${targetPath} 删除属性plugins.txvideo成功`);
          else if(command === 'video --add') log.debug(`${targetPath} 新增属性usingComponents.tx-video成功`);
          else if(command === 'video --delete') log.debug(`${targetPath} 删除属性usingComponents.tx-video成功`);
        })
    })
}

