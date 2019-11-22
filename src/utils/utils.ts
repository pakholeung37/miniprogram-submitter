import { promisify } from 'util';
import fs from 'fs';
import chalk from 'chalk';
import Promise from 'q';
import expandTilde from 'expand-tilde';

import c from 'commander';

export const cli = new c.Command();

enum Level {
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
}
class Log {
  _silent = false;
  _level: Level = Level.INFO;
  debug(...args: any) {
    if(this._silent && this._level <= Level.DEBUG) return;
    console.log(chalk.green(...args));
  }
  info(...args: any) {
    if(this._silent && this._level <= Level.INFO) return;
    console.log(...args);
  }
  warn(...args: any) {
    if(this._silent && this._level <= Level.WARN) return;
    console.log(chalk.yellow(...args))
  }
  error(...args: any) {
    if(this._silent && this._level <= Level.ERROR) return;
    console.error(chalk.red(...args));
  }
  silent(value: boolean = true) {
    this._silent = value;
  }
}

export const log = new Log();

const _readFileAsync = promisify(fs.readFile);
const _writeFileAsync = promisify(fs.writeFile);
interface File {
  path: string | number | Buffer | URL;
  orginalData: string | Buffer;
  hadOverride?: boolean;
}
class RollBackSystem {
  private fileSet: Set<File> = new Set();

  readFileAsync(...args: Parameters<typeof _readFileAsync>) {

    return _readFileAsync(...args)
      .then(data => {
        this.fileSet.add({ path: args[0], orginalData: data })
        return data;
      })
  }
  writeFileAsync(...args: Parameters<typeof _readFileAsync>) {
    this.fileSet.forEach(_ => (_.path = args[0]) && (_.hadOverride = true))
    return _writeFileAsync(...args);
  }
  rollback() {
    const functionArray: (ReturnType<typeof _writeFileAsync>)[] = [];
    this.fileSet.forEach(file => {
      if(file.hadOverride) {
        functionArray.push(_writeFileAsync(file.path, file.orginalData));
      }
    })
    return Promise.all(functionArray);
  }
}

export const rollBackSystem = new RollBackSystem();

export function isWin() {
  return /^win/.test(process.platform);
}
export function getWxUploadPortAsync() {
  const wxPortFilePath = isWin() 
    ? expandTilde('~/AppData/Local/微信开发者工具/User Data/Default/.ide')
    : expandTilde('~/Library/Application Support/微信开发者工具/Default/.ide');
  return _readFileAsync(wxPortFilePath, 'utf-8')
    .then(result => {
      const port = ~~result;
      if(!port) throw Error('端口不存在, 请检查是否打开微信开发者工具服务端口开关');
      return port;
    })
}