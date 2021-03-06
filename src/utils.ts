import { DateTime } from 'luxon';
import * as minimist from 'minimist';

export function exit(code = 1): void {
  process.exit(code);
}

export class InternalDateTime {
  public dt = DateTime.now().setZone('Asia/Seoul').setLocale('ko-KR');

  private _dt = this.dt.set({ second: 0, millisecond: 0 });

  public toFileTimeFormat(): string {
    return this._dt.toFormat('yyyy-LL/dd/HH_mm_ss');
  }

  public toInternalFormat(): string {
    return this._dt.toFormat('yyyy/LL/dd HH:mm:ss.SSS (ZZZZ)');
  }
}

export function getBaseDistDir(): string {
  const argv = minimist(process.argv.slice(2));
  const basedir: string = argv.basedir || './dist';
  return basedir;
}
