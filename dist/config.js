"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
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
const wxappExt__DEV = Object.assign({}, baseWxappExt, {
    "extAppid": "wxa8f78f6cd7ae5462",
    "ext": {
        "wxappAid": 9865628,
        "wxappId": 101,
        "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/"
    }
});
/**
 * 本地轻应用
 */
const wxappExt__OEMDEV = Object.assign({}, baseWxappExt, {
    "extAppid": "wx3e3322226cae5bb7",
    "ext": {
        "wxappAid": 21,
        "wxappId": 101,
        "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/"
    }
});
/**
 * 线上轻站
 */
const wxappExt__SVR = Object.assign({}, baseWxappExt, {
    "extAppid": "wx22c3680805ec5ce3",
    "ext": {
        "wxappAid": 3039,
        "wxappId": 102,
        "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/"
    }
});
/**
 * 线上轻应用
 */
const wxappExt__OEMSVR = Object.assign({}, baseWxappExt, {
    "extAppid": "wxaa7ea2a6597f6144",
    "ext": {
        "wxappAid": 21,
        "wxappId": 101,
        "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/"
    }
});
/**
 * wxapp项目路径
 */
const wxappTargetPath = path_1.default.resolve(__dirname, '../../wxapp');
/**
 * bdapp项目路径
 */
const bdappTargetPath = path_1.default.resolve(__dirname, '../../bdapp');
exports.default = {
    wxappExt__DEV,
    wxappExt__OEMDEV,
    wxappExt__SVR,
    wxappExt__OEMSVR,
    wxappTargetPath,
    bdappTargetPath,
};
