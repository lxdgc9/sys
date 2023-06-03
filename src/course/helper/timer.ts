type HrTime = [number, number];

interface ITimer {
  cal(p: HrTime, msg: string): void;
}

export class Timer implements ITimer {
  readonly point: HrTime;

  constructor() {
    this.point = process.hrtime();
  }

  cal(p: HrTime, msg?: string) {
    const etime = process.hrtime(p);
    const ptime = etime[0] * 1000 + etime[1] / 1000000;

    console.log(`Processing time - ${msg}: ${ptime} ms`);
  }
}
