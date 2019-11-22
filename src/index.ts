/**
 * 凡科轻站内部小程序提交脚本
 *
 * @author 梁伯豪 pakholeung
 * @date 2019-11-01 16:04:58
 * @version 0.0.1
 * @license MIT
 * @description 该脚本用于快速提交轻站wxapp和bdapp包, 使用前先修改config文件
 * 
 * 
 */
import { log, cli } from './utils/utils';
import run from './wxapp';

cli
  .version('0.0.1')
  .option('-c, --config <path>', 'custom config file')
  .option('-s, --silent', 'silent log')
  .option('-u, --upload', 'upload flag')
  .option('-t, --target <name>', 
  `avaliable target name:
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

if(cli.slient) log.silent();

console.log(cli.target);
run();