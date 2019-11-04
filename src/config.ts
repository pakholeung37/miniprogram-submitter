import path from 'path';
import merge from 'lodash/merge';
export type ExtConfig = typeof baseWxappExt;
export type ProjectConfig = typeof projectConfig__DEV;

/**
 * wxapp项目路径
 */
const wxappTargetPath = path.resolve(__dirname, '../../wxapp');
/**
 * bdapp项目路径
 */
const bdappTargetPath = path.resolve(__dirname, '../../bdapp');


/**
 * ext.json基础设置
 */
const baseWxappExt = {
  "extEnable": true,
  "exAppid": "",
  "ext": {
    "isOem": true,
    "isModel": true,
    "aid": 1,
    "wxappAid": 9865628,
    "wxappId": 101,
    "wxappAppId": "",
    "wxappDomain": "https://wxapp.dev.faisco.com.cn/wxAppConnectionV3.jsp",
    "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/"
  }
};
/**
 * 本地轻站
 */
const wxappExt__DEV = merge({}, baseWxappExt, {
  "extAppid" : "wxa8f78f6cd7ae5462",
  "ext": {
    "isOem": false,
    "wxappAid": 9865628,
    "wxappId": 101,
    "wxappAppId" : "wxa8f78f6cd7ae5462",
    "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/",
    "wxappDomain": "https://wxapp.dev.faisco.com.cn/wxAppConnectionV3.jsp"
  }
});

/**
 * 本地轻应用
 */
const wxappExt__OEMDEV = merge({}, baseWxappExt, {
  "extAppid" : "wx22c3680805ec5ce3",
  "ext": {
    "isOem": true,
    "wxappAid": 21,
    "wxappId": 101,
    "wxappAppId" : "wx22c3680805ec5ce3",
    "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/",
    "wxappDomain": "https://wxapp.dev.faisco.com.cn/wxAppConnectionV3.jsp"
  }
});

/**
 * 线上轻站
 */
const wxappExt__SVR = merge({}, baseWxappExt, {
  "extAppid" : "wx3e3322226cae5bb7",
  "ext": {
    "isOem": false,
    "wxappAid": 3039,
    "wxappId": 102,
    "wxappAppId" : "wx3e3322226cae5bb7",
    "wxappDomainUrl": "https://i.qz.fkw.com/",
    "wxappDomain": "https://i.qz.fkw.com/wxAppConnectionV3.jsp"
  }
});

/**
 * 线上轻应用
 */
const wxappExt__OEMSVR = merge({}, baseWxappExt, {
  "extAppid" : "wxaa7ea2a6597f6144",
  "ext": {
    "isOem": true,
    "wxappAid": 21,
    "wxappId": 101,
    "wxappAppId" : "wxaa7ea2a6597f6144",
    "wxappDomainUrl": "https://i.qz.fkw.com/",
    "wxappDomain": "https://i.qz.fkw.com/wxAppConnectionV3.jsp"
  }
});

/**
 * 基础版本库
 */
const libVersion = "1.9.6";

const projectConfigBase = {
  "libVersion": libVersion,
}
/**
 * 本地轻站wxapp项目设置
 */
const projectConfig__DEV = merge({}, projectConfigBase, {
  "appid": wxappExt__DEV.extAppid,
});
/**
 * 本地轻站wxapp项目设置
 */
const projectConfig__OEMDEV = merge({}, projectConfigBase, {
  "appid": wxappExt__OEMDEV.extAppid,
});
/**
 * 本地轻站wxapp项目设置
 */
const projectConfig__SVR = merge({}, projectConfigBase, {
  "appid": wxappExt__SVR.extAppid,
});
/**
 * 本地轻站wxapp项目设置
 */
const projectConfig__OEMSVR = merge({}, projectConfigBase, {
  "appid": wxappExt__OEMSVR.extAppid,
});

/**
 * video plugin设置
 */
const commonVideoPlugin = {
  "version": "1.2.2",
  "provider": "wxa75efa648b60994b"
}
export default {
  wxappTargetPath,
  bdappTargetPath,
  wxappExt__DEV,
  wxappExt__OEMDEV,
  wxappExt__SVR,
  wxappExt__OEMSVR,
  projectConfig__DEV,
  projectConfig__OEMDEV,
  projectConfig__SVR,
  projectConfig__OEMSVR,
  commonVideoPlugin
}