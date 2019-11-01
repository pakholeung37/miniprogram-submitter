"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 凡科轻站内部小程序提交脚本
 * @author 梁伯豪 pakholeung
 * @date 2019-11-01 16:04:58
 * @version 0.0.1
 * @license MIT
 * @description 该脚本用于快速提交轻站wxapp和bdapp包, 使用前先修改config文件
 *
 *
 */
const commander_1 = __importDefault(require("commander"));
const utils_1 = require("./utils/utils");
commander_1.default
    .version('0.0.1')
    .option('-c, --config <path>', 'custom config file')
    .option('-s, --silent', 'silent log')
    .parse(process.argv);
if (commander_1.default.silent)
    utils_1.log.silent();
utils_1.log.debug('helloworld');
utils_1.log.warn('helloworld');
utils_1.log.error('helloworld');
