import { DateTime } from 'luxon';

export class InternalDateTime {
  public dt = DateTime.now()
    .setZone('Asia/Seoul')
    .setLocale('ko-KR')
    .set({ second: 0, millisecond: 0 });

  public toFileTimeFormat(): string {
    return this.dt.toFormat('yyyy-LL/dd/HH_mm_ss');
  }

  public toInternalFormat(): string {
    return this.dt.toFormat('yyyy/LL/dd HH:mm:ss.SSS (ZZZZ)');
  }
}
