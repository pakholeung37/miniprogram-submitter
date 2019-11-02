import { promisify } from 'util';
import fs from 'fs';
import chalk from 'chalk';
import Promise from 'q';

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
