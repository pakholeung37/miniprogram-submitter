import { getWxUploadPortAsync, log } from "../utils/utils";

/**
 * stage 2
 * 
 * @description 阶段2 将修改好的wxapp项目上传到第三方平台中
 */
export default function run () {
  return getWxUploadPortAsync()
    .then(port => {
      log.info(port);
    })
}