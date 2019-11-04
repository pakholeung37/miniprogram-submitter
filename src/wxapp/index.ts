import stage1 from './stage1';
import stage2 from './stage2';

export type RunCommand = 
  'dev' |
  'dev-plugin' |
  'oem-dev' |
  'oem-dev-plugin';

export default async function run () {
  await stage1('dev-plugin');
  await stage2();
}