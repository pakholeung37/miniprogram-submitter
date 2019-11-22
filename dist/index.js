"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils/utils");
const wxapp_1 = __importDefault(require("./wxapp"));
utils_1.cli
    .version('0.0.1')
    .option('-c, --config <path>', 'custom config file')
    .option('-s, --silent', 'silent log')
    .option('-u, --upload', 'upload flag')
    .option('-t, --target <name>', `avaliable target name:
  wxapp-dev
  wxapp-dev-plugin
  wxapp-oem-dev
  wxapp-oem-dev-plugin
  wxapp-svr
  wxapp-svr-plugin
  wxapp-oem-svr
  wxapp-oem-svr-plugin
  
  bdapp-dev
  bdapp-dev-run
  bdapp-oem
  bdapp-oem-run
  bdapp-svr
  bdapp-svr-run
  bdapp-oem-svr
  bdapp-oem-svr-run`)
    .parse(process.argv);
if (utils_1.cli.slient)
    utils_1.log.silent();
console.log(utils_1.cli.target);
wxapp_1.default();
//# sourceMappingURL=index.js.map