"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
exports.log = {
    _silent: false,
    debug(...args) {
        if (this._silent)
            return;
        console.log(chalk_1.default.green(...args));
    },
    warn(...args) {
        if (this._silent)
            return;
        console.log(chalk_1.default.yellow(...args));
    },
    error(...args) {
        if (this._silent)
            return;
        console.error(chalk_1.default.red(...args));
    },
    silent(value = true) {
        this._silent = value;
    }
};
exports.readFileAsync = util_1.promisify(fs_1.default.readFile);
exports.writeFileAsync = util_1.promisify(fs_1.default.writeFile);
