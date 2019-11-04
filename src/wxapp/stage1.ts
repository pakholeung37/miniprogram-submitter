import { rollBackSystem as r } from './../utils/utils';
import config, { ExtConfig, ProjectConfig } from '../config';
import { log } from './../utils/utils';
import merge from 'lodash/merge';
import path from 'path';
import Promise from 'q';

type RunCommand = 
  'dev' |
  'dev-plugin' |
  'oem-dev' |
  'oem-dev-plugin';
/**
 * stage1
 * 
 * @description 阶段1 进行文件预处理, 包括处理脚本的Aid, DomainUrl以及添加视频plugin等
 */
export default function run(command: RunCommand) {
  const target = config.wxappTargetPath;
  

  let promiseArray: any[] = [];
  switch (command) {
    case 'dev':
    case 'dev-plugin':
      promiseArray = [
        editExtFile(target, config.wxappExt__DEV),
        editProjectConfigFile(target, config.projectConfig__DEV)
      ]
      break;
    case 'oem-dev':
    case 'oem-dev-plugin':
      promiseArray = [
        editExtFile(target, config.wxappExt__OEMDEV),
        editProjectConfigFile(target, config.projectConfig__OEMDEV)
      ]
      break;
    default:
      break;
  }
  switch (command) {
    case 'dev':
    case 'oem-dev':
      promiseArray = [
        ...promiseArray,
        commentVideoWxmlCode(target),
        delTxVideoComponentJsonTxKey(target),
        delVideoJsonTxKey(target),
        delAppTxVideoPlugin(target),
      ]
      break;
    case 'dev-plugin':
    case 'oem-dev-plugin':
      promiseArray = [
        ...promiseArray,
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
            .then(() => log.info('回滚成功'))
            .catch((err) => log.error(err, '回滚失败'));
        } else {
          log.info('stage 1 成功');
        }
    })
}

/**
 * 修改Ext.json文件
 *
 * @param {string} target wxapp项目所在根目录
 * @param {extConfig} extConfig ext.json兼容json设置
 * @returns 返回Promise
 */
function editExtFile(target: string, extConfig: ExtConfig) {
  const targetPath = path.resolve(`${target}/ext.json`);
  return mergeFile(targetPath, extConfig);
}

/**
 * 修改project.config.json文件
 *
 * @param {string} target
 * @param {ProjectConfig} projectConfig
 * @returns
 */
function editProjectConfigFile(target: string, projectConfig: ProjectConfig) {
  const targetPath = path.resolve(`${target}/project.config.json`);
  return mergeFile(targetPath, projectConfig);
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
      if(!/<!--\s*<tx-video/.test(file as string)) {
        const startTag = new RegExp("<tx-video", "g");
        const endTag = new RegExp("</tx-video>", "g");
        const newstr = (file as string).replace(startTag, "<!--<tx-video").replace(endTag, "</tx-video as string>-->");

        if(newstr) {
          return r.writeFileAsync(targetPath, newstr)
            .then(() => log.info(`${targetPath} 注释成功`))
        }
        return;
      } else {
        log.warn(`${targetPath} 标签<tx-video>已注释`)
        return;
      }
    });
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
      if(/<!--\s*<tx-video/.test(file as string)) {
        const startTag = new RegExp("<!--<tx-video", "g");
        const endTag = new RegExp("</tx-video>-->", "g");
        const newstr = (file as string).replace(startTag, "<tx-video").replace(endTag, "</tx-video>");

        if(newstr) {
          return r.writeFileAsync(targetPath, newstr)
            .then(() => {
              log.info(`${targetPath} 取消注释成功`);
            })
        }
        return;
      } else {
        log.warn(`${targetPath} 没找到注释标签<tx-video>`)
        return;
      }
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

/**
 * 读取文件并合并新内容到文件中, 限json文件
 *
 * @param {string} targetPath
 * @param {Object} mergeConfig
 * @returns
 */
function mergeFile(targetPath: string, mergeConfig: Object) {
  return r.readFileAsync(targetPath, 'utf-8')
    .then((data) => {
      let result = JSON.parse(data as string);
      if (!result) throw Error(`${targetPath}文件内容为空`);
      result = merge({}, result, mergeConfig);
      return r.writeFileAsync(targetPath, JSON.stringify(result, null, 2))
    })
    .then(() => {
      log.info(`${targetPath} 修改成功`);
    })
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
      const data = JSON.parse(result as string);
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
          if(command === 'app --add') log.info(`${targetPath} 新增属性plugins.txvideo成功`);
          else if(command === 'app --delete') log.info(`${targetPath} 删除属性plugins.txvideo成功`);
          else if(command === 'video --add') log.info(`${targetPath} 新增属性usingComponents.tx-video成功`);
          else if(command === 'video --delete') log.info(`${targetPath} 删除属性usingComponents.tx-video成功`);
        })
    })
}

