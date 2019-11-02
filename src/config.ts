import path from 'path';
import merge from 'lodash/merge';
export type extConfig = typeof baseWxappExt;

const baseWxappExt = {
  "extEnable": true,
  "extAppid": "wxa8f78f6cd7ae5462",
  "ext": {
    "isOem": true,
    "isModel": true,
    "aid": 1,
    "wxappAid": 9865628,
    "wxappId": 101,
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
    "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/",
    "wxappDomain": "https://wxapp.dev.faisco.com.cn/wxAppConnectionV3.jsp"
  }
});

/**
 * 本地轻应用
 */
const wxappExt__OEMDEV = merge({}, baseWxappExt, {
  "extAppid" : "wx3e3322226cae5bb7",
  "ext": {
    "wxappAid": 21,
    "wxappId": 101,
    "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/",
    "wxappDomain": "https://wxapp.dev.faisco.com.cn/wxAppConnectionV3.jsp"
  }
});

/**
 * 线上轻站
 */
const wxappExt__SVR = merge({}, baseWxappExt, {
  "extAppid" : "wx22c3680805ec5ce3",
  "ext": {
    "isOem": false,
    "wxappAid": 3039,
    "wxappId": 102,
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
    "wxappAid": 21,
    "wxappId": 101,
    "wxappDomainUrl": "https://i.qz.fkw.com/",
    "wxappDomain": "https://i.qz.fkw.com/wxAppConnectionV3.jsp"
  }
});

/**
 * wxapp项目路径
 */
const wxappTargetPath = path.resolve(__dirname, '../../wxapp');
/**
 * bdapp项目路径
 */
const bdappTargetPath = path.resolve(__dirname, '../../bdapp');

export default {
  wxappExt__DEV,
  wxappExt__OEMDEV,
  wxappExt__SVR,
  wxappExt__OEMSVR,
  wxappTargetPath,
  bdappTargetPath,
  commonVideoPlugin: {
    "version": "1.2.2",
    "provider": "wxa75efa648b60994b"
  }
}