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
import commander from 'commander';
import run from './wxapp';

commander
  .version('0.0.1')
  .option('-c, --config <path>', 'custom config file')
  .option('-s, --silent', 'silent log')
  .parse(process.argv);

run();