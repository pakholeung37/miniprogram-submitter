import { RunCommand } from './index';
import stage1 from './stage1';
import stage2 from './stage2';
import { cli } from '../utils/utils';


const command = <const> [
  'dev',
  'dev-plugin',
  'oem-dev',
  'oem-dev-plugin',
  'svr',
  'svr-plugin',
  'oem-svr',
  'oem-svr-plugin'
];

export type RunCommand = typeof command[number];

function validRunCommand(s: string): s is RunCommand {
  return command.some(_ => _ === s);
}
export default async function run () {
  const target: string = cli.target;
  if(!validRunCommand(target)) {
    console.log('参数错误', target);
    return;
  }
  await stage1(target);
  await stage2(target);
}