const timer = {
  point: () => process.hrtime(),
  cal(stime: [number, number], msg: string = "") {
    const etime = process.hrtime(stime);
    const ptime = etime[0] * 1000 + etime[1] / 1000000;

    console.log(`Processing time - ${msg}: ${ptime} ms`);
  },
};

export default timer;
