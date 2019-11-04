"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const merge_1 = __importDefault(require("lodash/merge"));
const wxappTargetPath = path_1.default.resolve(__dirname, '../../wxapp');
const bdappTargetPath = path_1.default.resolve(__dirname, '../../bdapp');
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
const wxappExt__DEV = merge_1.default({}, baseWxappExt, {
    "extAppid": "wxa8f78f6cd7ae5462",
    "ext": {
        "isOem": false,
        "wxappAid": 9865628,
        "wxappId": 101,
        "wxappAppId": "wxa8f78f6cd7ae5462",
        "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/",
        "wxappDomain": "https://wxapp.dev.faisco.com.cn/wxAppConnectionV3.jsp"
    }
});
const wxappExt__OEMDEV = merge_1.default({}, baseWxappExt, {
    "extAppid": "wx22c3680805ec5ce3",
    "ext": {
        "isOem": true,
        "wxappAid": 21,
        "wxappId": 101,
        "wxappAppId": "wx22c3680805ec5ce3",
        "wxappDomainUrl": "https://wxapp.dev.faisco.com.cn/",
        "wxappDomain": "https://wxapp.dev.faisco.com.cn/wxAppConnectionV3.jsp"
    }
});
const wxappExt__SVR = merge_1.default({}, baseWxappExt, {
    "extAppid": "wx3e3322226cae5bb7",
    "ext": {
        "isOem": false,
        "wxappAid": 3039,
        "wxappId": 102,
        "wxappAppId": "wx3e3322226cae5bb7",
        "wxappDomainUrl": "https://i.qz.fkw.com/",
        "wxappDomain": "https://i.qz.fkw.com/wxAppConnectionV3.jsp"
    }
});
const wxappExt__OEMSVR = merge_1.default({}, baseWxappExt, {
    "extAppid": "wxaa7ea2a6597f6144",
    "ext": {
        "isOem": true,
        "wxappAid": 21,
        "wxappId": 101,
        "wxappAppId": "wxaa7ea2a6597f6144",
        "wxappDomainUrl": "https://i.qz.fkw.com/",
        "wxappDomain": "https://i.qz.fkw.com/wxAppConnectionV3.jsp"
    }
});
const libVersion = "1.9.6";
const projectConfigBase = {
    "libVersion": libVersion,
};
const projectConfig__DEV = merge_1.default({}, projectConfigBase, {
    "appid": wxappExt__DEV.extAppid,
});
const projectConfig__OEMDEV = merge_1.default({}, projectConfigBase, {
    "appid": wxappExt__OEMDEV.extAppid,
});
const projectConfig__SVR = merge_1.default({}, projectConfigBase, {
    "appid": wxappExt__SVR.extAppid,
});
const projectConfig__OEMSVR = merge_1.default({}, projectConfigBase, {
    "appid": wxappExt__OEMSVR.extAppid,
});
const commonVideoPlugin = {
    "version": "1.2.2",
    "provider": "wxa75efa648b60994b"
};
exports.default = {
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
};
//# sourceMappingURL=config.js.map