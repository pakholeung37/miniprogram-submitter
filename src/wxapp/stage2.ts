import { getWxUploadPortAsync, log } from "../utils/utils";
import path from 'path';
import axios from 'axios';
import config from '../config';
import { RunCommand } from './index';

/**
 * stage 2
 * 
 * @description 阶段2 将修改好的wxapp项目上传到第三方平台中
 * @param {RunCommand} command
 */
export default function run (command: RunCommand) {
  return uploadPorject(config.wxappTargetPath, command)
    .then(() => {
      log.info('stage2 成功');
    })
    .catch((err) => {
      log.error(err);
      log.info('stage2 失败, 即将回滚');
    })
}

/**
 * 利用微信开发者工具提交代码
 * 
 * @description 前置条件: 微信开发者工具已打开并且服务端口已打开
 */
function uploadPorject(target: string, command: RunCommand) {
  const targetPath = path.resolve(target);
  const desc = 
  command === 'dev' || command === 'dev-plugin' ? '轻站小程序test' :
  command === 'oem-dev' || command === 'oem-dev-plugin' ? '轻应用小程序test' : ''
  // 通常以当天日期作为版本号
  const version = formatTime(new Date()) + (/plugin$/.test(command) ? '01' : '02');
  return getWxUploadPortAsync()
  .then(port => {
    if(!port) throw Error('端口为空')
    const uploadApi = `http://127.0.0.1:${port}/upload`;
    return axios.get(uploadApi, {
      data: {
        projectpath: targetPath,
        version: version,
        desc: desc,
      }
    })
  })
  .then(() => log.info(`${target} - ${command} 上传成功`))
}

function formatTime(date: Date) {
  return `${date.getFullYear()}${date.getDate()}${date.getDate()}`;
}