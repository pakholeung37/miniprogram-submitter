"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stage1_1 = __importDefault(require("./stage1"));
const stage2_1 = __importDefault(require("./stage2"));
const utils_1 = require("../utils/utils");
const command = [
    'dev',
    'dev-plugin',
    'oem-dev',
    'oem-dev-plugin',
    'svr',
    'svr-plugin',
    'oem-svr',
    'oem-svr-plugin'
];
function validRunCommand(s) {
    return command.some(_ => _ === s);
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const target = utils_1.cli.target;
        if (!validRunCommand(target)) {
            console.log('参数错误', target);
            return;
        }
        yield stage1_1.default(target);
        yield stage2_1.default(target);
    });
}
exports.default = run;
//# sourceMappingURL=index.js.map