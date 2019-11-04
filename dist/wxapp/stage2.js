"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
function run() {
    return utils_1.getWxUploadPortAsync()
        .then(port => {
        utils_1.log.info(port);
    });
}
exports.default = run;
//# sourceMappingURL=stage2.js.map