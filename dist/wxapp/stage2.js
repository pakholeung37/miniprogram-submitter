"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
function run(command) {
    return uploadPorject(config_1.default.wxappTargetPath, command)
        .then(() => {
        utils_1.log.info('stage2 成功');
    })
        .catch((err) => {
        utils_1.log.error(err);
        utils_1.log.info('stage2 失败, 即将回滚');
    });
}
exports.default = run;
function uploadPorject(target, command) {
    const targetPath = path_1.default.resolve(target);
    const desc = command === 'dev' || command === 'dev-plugin' ? '轻站小程序test' :
        command === 'oem-dev' || command === 'oem-dev-plugin' ? '轻应用小程序test' : '';
    const version = formatTime(new Date()) + (/plugin$/.test(command) ? '01' : '02');
    return utils_1.getWxUploadPortAsync()
        .then(port => {
        if (!port)
            throw Error('端口为空');
        const uploadApi = `http://127.0.0.1:${port}/upload`;
        return axios_1.default.get(uploadApi, {
            data: {
                projectpath: targetPath,
                version: version,
                desc: desc,
            }
        });
    })
        .then(() => utils_1.log.info(`${target} - ${command} 上传成功`));
}
function formatTime(date) {
    return `${date.getFullYear()}${date.getDate()}${date.getDate()}`;
}
//# sourceMappingURL=stage2.js.map