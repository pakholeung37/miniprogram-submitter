"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils/utils");
const config_1 = __importDefault(require("../config"));
const utils_2 = require("./../utils/utils");
const merge_1 = __importDefault(require("lodash/merge"));
const path_1 = __importDefault(require("path"));
function run() {
    const target = config_1.default.wxappTargetPath;
    return Promise.all([
        editExtFile(target, config_1.default.wxappExt__DEV),
        commentVideoWxmlCode(target),
    ])
        .catch((err) => {
        utils_2.log.error(err);
        utils_2.log.error('stage 1 失败, 即将回滚');
    });
}
exports.default = run;
let originalExtFile;
function editExtFile(target, extconfig) {
    const targetPath = path_1.default.resolve(`${target}/ext.json`);
    return utils_1.readFileAsync(targetPath, 'utf-8')
        .then((data) => {
        originalExtFile = data;
        let result = JSON.parse(data);
        if (!result)
            throw Error('文件内容为空');
        result = merge_1.default({}, result, extconfig);
        return utils_1.writeFileAsync(targetPath, JSON.stringify(result, null, 2));
    })
        .then(() => {
        utils_2.log.debug(`${target}/ext.json 修改成功`);
    });
}
let originalVideoFile;
function commentVideoWxmlCode(target) {
    const targetPath = path_1.default.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
    return utils_1.readFileAsync(targetPath, 'utf-8')
        .then((file) => {
        originalExtFile = file;
        if (!/<!--\s*<tx-video/.test(file)) {
            const startReg = new RegExp("<tx-video", "g");
            const endReg = new RegExp("</tx-video>", "g");
            const newstr = file.replace(startReg, "<!--<tx-video").replace(endReg, "</tx-video>-->");
            if (newstr) {
                return utils_1.writeFileAsync(targetPath, newstr);
            }
        }
    })
        .then(() => {
        utils_2.log.debug(`${targetPath} 注释成功`);
    });
}
function uncommentVideoWxmlCode(target) {
    const targetPath = path_1.default.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
    return utils_1.readFileAsync(targetPath, 'utf-8')
        .then((file) => {
        originalExtFile = file;
        if (/<!--\s*<tx-video/.test(file)) {
            const startReg = new RegExp("<!--<tx-video", "g");
            const endReg = new RegExp("</tx-video>-->", "g");
            const newstr = file.replace(startReg, "<tx-video").replace(endReg, "</tx-video>");
            if (newstr) {
                return utils_1.writeFileAsync(targetPath, newstr);
            }
        }
    })
        .then(() => {
        utils_2.log.debug(`${targetPath} 取消注释成功`);
    });
}
//# sourceMappingURL=stage1.js.map