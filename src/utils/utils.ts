import { promisify } from 'util';
import fs from 'fs';
import chalk from 'chalk';

export const log = {
  _silent: false,
  debug(...args: any) {
    if(this._silent) return;
    console.log(chalk.green(...args));
  },
  warn(...args: any) {
    if(this._silent) return;
    console.log(chalk.yellow(...args))
  },
  error(...args: any) {
    if(this._silent) return;
    console.error(chalk.red(...args));
  },
  silent(value: boolean = true) {
    this._silent = value;
  }
}

export const readFileAsync = promisify(fs.readFile);
export const writeFileAsync = promisify(fs.writeFile);