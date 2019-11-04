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
const q_1 = __importDefault(require("q"));
function run(command) {
    const target = config_1.default.wxappTargetPath;
    let promiseArray = [];
    switch (command) {
        case 'dev':
        case 'dev-plugin':
            promiseArray = [
                editExtFile(target, config_1.default.wxappExt__DEV),
                editProjectConfigFile(target, config_1.default.projectConfig__DEV)
            ];
            break;
        case 'oem-dev':
        case 'oem-dev-plugin':
            promiseArray = [
                editExtFile(target, config_1.default.wxappExt__OEMDEV),
                editProjectConfigFile(target, config_1.default.projectConfig__OEMDEV)
            ];
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
            ];
            break;
        case 'dev-plugin':
        case 'oem-dev-plugin':
            promiseArray = [
                ...promiseArray,
                uncommentVideoWxmlCode(target),
                addTxVideoComponentJsonTxKey(target),
                addVideoJsonTxKey(target),
                addAppTxVideoPlugin(target),
            ];
            break;
        default:
            break;
    }
    if (!promiseArray)
        throw Error(`command: ${command} 无法识别`);
    return q_1.default.allSettled(promiseArray)
        .then((results) => {
        const rejectPromise = results.filter(_ => _.state === 'rejected');
        if (rejectPromise.length) {
            rejectPromise.forEach(_ => {
                utils_2.log.error(_.reason);
            });
            utils_2.log.error('stage 1 失败, 即将回滚');
            utils_1.rollBackSystem.rollback()
                .then(() => utils_2.log.info('回滚成功'))
                .catch((err) => utils_2.log.error(err, '回滚失败'));
        }
        else {
            utils_2.log.info('stage 1 成功');
        }
    });
}
exports.default = run;
function editExtFile(target, extConfig) {
    const targetPath = path_1.default.resolve(`${target}/ext.json`);
    return mergeFile(targetPath, extConfig);
}
function editProjectConfigFile(target, projectConfig) {
    const targetPath = path_1.default.resolve(`${target}/project.config.json`);
    return mergeFile(targetPath, projectConfig);
}
function commentVideoWxmlCode(target) {
    const targetPath = path_1.default.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
    return utils_1.rollBackSystem.readFileAsync(targetPath, 'utf-8')
        .then((file) => {
        if (!/<!--\s*<tx-video/.test(file)) {
            const startTag = new RegExp("<tx-video", "g");
            const endTag = new RegExp("</tx-video>", "g");
            const newstr = file.replace(startTag, "<!--<tx-video").replace(endTag, "</tx-video as string>-->");
            if (newstr) {
                return utils_1.rollBackSystem.writeFileAsync(targetPath, newstr)
                    .then(() => utils_2.log.info(`${targetPath} 注释成功`));
            }
            return;
        }
        else {
            utils_2.log.warn(`${targetPath} 标签<tx-video>已注释`);
            return;
        }
    });
}
function uncommentVideoWxmlCode(target) {
    const targetPath = path_1.default.resolve(`${target}/components/txVideoComponent/txVideoComponent.wxml`);
    return utils_1.rollBackSystem.readFileAsync(targetPath, 'utf-8')
        .then((file) => {
        if (/<!--\s*<tx-video/.test(file)) {
            const startTag = new RegExp("<!--<tx-video", "g");
            const endTag = new RegExp("</tx-video>-->", "g");
            const newstr = file.replace(startTag, "<tx-video").replace(endTag, "</tx-video>");
            if (newstr) {
                return utils_1.rollBackSystem.writeFileAsync(targetPath, newstr)
                    .then(() => {
                    utils_2.log.info(`${targetPath} 取消注释成功`);
                });
            }
            return;
        }
        else {
            utils_2.log.warn(`${targetPath} 没找到注释标签<tx-video>`);
            return;
        }
    });
}
function addTxVideoComponentJsonTxKey(target) {
    const targetPath = path_1.default.resolve(`${target}/components/txVideoComponent/txVideoComponent.json`);
    return TxKeyToggleFactory('video --add', targetPath);
}
function delTxVideoComponentJsonTxKey(target) {
    const targetPath = path_1.default.resolve(`${target}/components/txVideoComponent/txVideoComponent.json`);
    return TxKeyToggleFactory('video --delete', targetPath);
}
function addVideoJsonTxKey(target) {
    const targetPath = path_1.default.resolve(`${target}/components/modules/video/video.json`);
    return TxKeyToggleFactory('video --add', targetPath);
}
function delVideoJsonTxKey(target) {
    const targetPath = path_1.default.resolve(`${target}/components/modules/video/video.json`);
    return TxKeyToggleFactory('video --delete', targetPath);
}
function addAppTxVideoPlugin(target) {
    const targetPath = path_1.default.resolve(`${target}/app.json`);
    return TxKeyToggleFactory('app --add', targetPath);
}
function delAppTxVideoPlugin(target) {
    const targetPath = path_1.default.resolve(`${target}/app.json`);
    return TxKeyToggleFactory('app --delete', targetPath);
}
function mergeFile(targetPath, mergeConfig) {
    return utils_1.rollBackSystem.readFileAsync(targetPath, 'utf-8')
        .then((data) => {
        let result = JSON.parse(data);
        if (!result)
            throw Error(`${targetPath}文件内容为空`);
        result = merge_1.default({}, result, mergeConfig);
        return utils_1.rollBackSystem.writeFileAsync(targetPath, JSON.stringify(result, null, 2));
    })
        .then(() => {
        utils_2.log.info(`${targetPath} 修改成功`);
    });
}
function TxKeyToggleFactory(command, filePath) {
    const targetPath = filePath;
    return utils_1.rollBackSystem.readFileAsync(targetPath, 'utf-8')
        .then(result => {
        const data = JSON.parse(result);
        if (!data)
            throw Error('文件内容为空');
        if (command === 'video --add') {
            const txVideoTag = data.usingComponents['tx-video'];
            if (txVideoTag) {
                utils_2.log.warn(`${targetPath} 属性tx-video已存在`);
                return;
            }
            data.usingComponents['tx-video'] = "plugin://txvideo/video";
        }
        else if (command === 'video --delete') {
            const txVideoTag = data.usingComponents['tx-video'];
            if (!txVideoTag) {
                utils_2.log.warn(`${targetPath} 属性tx-video不存在`);
                return;
            }
            delete data.usingComponents['tx-video'];
        }
        else if (command === 'app --add') {
            if (data.plugins['txvideo']) {
                utils_2.log.warn(`${targetPath} 属性plugins.txvideo已存在`);
                return;
            }
            data.plugins['txvideo'] = config_1.default.commonVideoPlugin;
        }
        else if (command === 'app --delete') {
            if (!data.plugins['txvideo']) {
                utils_2.log.warn(`${targetPath} 属性plugins.txvideo不存在`);
                return;
            }
            delete data.plugins['txvideo'];
        }
        return utils_1.rollBackSystem.writeFileAsync(targetPath, JSON.stringify(data, null, 2))
            .then(() => {
            if (command === 'app --add')
                utils_2.log.info(`${targetPath} 新增属性plugins.txvideo成功`);
            else if (command === 'app --delete')
                utils_2.log.info(`${targetPath} 删除属性plugins.txvideo成功`);
            else if (command === 'video --add')
                utils_2.log.info(`${targetPath} 新增属性usingComponents.tx-video成功`);
            else if (command === 'video --delete')
                utils_2.log.info(`${targetPath} 删除属性usingComponents.tx-video成功`);
        });
    });
}
//# sourceMappingURL=stage1.js.map