"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const q_1 = __importDefault(require("q"));
const expand_tilde_1 = __importDefault(require("expand-tilde"));
const commander_1 = __importDefault(require("commander"));
exports.cli = new commander_1.default.Command();
var Level;
(function (Level) {
    Level[Level["DEBUG"] = 0] = "DEBUG";
    Level[Level["INFO"] = 1] = "INFO";
    Level[Level["WARN"] = 2] = "WARN";
    Level[Level["ERROR"] = 3] = "ERROR";
})(Level || (Level = {}));
class Log {
    constructor() {
        this._silent = false;
        this._level = Level.INFO;
    }
    debug(...args) {
        if (this._silent && this._level <= Level.DEBUG)
            return;
        console.log(chalk_1.default.green(...args));
    }
    info(...args) {
        if (this._silent && this._level <= Level.INFO)
            return;
        console.log(...args);
    }
    warn(...args) {
        if (this._silent && this._level <= Level.WARN)
            return;
        console.log(chalk_1.default.yellow(...args));
    }
    error(...args) {
        if (this._silent && this._level <= Level.ERROR)
            return;
        console.error(chalk_1.default.red(...args));
    }
    silent(value = true) {
        this._silent = value;
    }
}
exports.log = new Log();
const _readFileAsync = util_1.promisify(fs_1.default.readFile);
const _writeFileAsync = util_1.promisify(fs_1.default.writeFile);
class RollBackSystem {
    constructor() {
        this.fileSet = new Set();
    }
    readFileAsync(...args) {
        return _readFileAsync(...args)
            .then(data => {
            this.fileSet.add({ path: args[0], orginalData: data });
            return data;
        });
    }
    writeFileAsync(...args) {
        this.fileSet.forEach(_ => (_.path = args[0]) && (_.hadOverride = true));
        return _writeFileAsync(...args);
    }
    rollback() {
        const functionArray = [];
        this.fileSet.forEach(file => {
            if (file.hadOverride) {
                functionArray.push(_writeFileAsync(file.path, file.orginalData));
            }
        });
        return q_1.default.all(functionArray);
    }
}
exports.rollBackSystem = new RollBackSystem();
function isWin() {
    return /^win/.test(process.platform);
}
exports.isWin = isWin;
function getWxUploadPortAsync() {
    const wxPortFilePath = isWin()
        ? expand_tilde_1.default('~/AppData/Local/微信开发者工具/User Data/Default/.ide')
        : expand_tilde_1.default('~/Library/Application Support/微信开发者工具/Default/.ide');
    return _readFileAsync(wxPortFilePath, 'utf-8')
        .then(result => {
        const port = ~~result;
        if (!port)
            throw Error('端口不存在, 请检查是否打开微信开发者工具服务端口开关');
        return port;
    });
}
exports.getWxUploadPortAsync = getWxUploadPortAsync;
//# sourceMappingURL=utils.js.map