export const timer = {
  breakPoint: () => process.hrtime(),
  cal: (logStr: string, startTime: [number, number]) => {
    const endTime = process.hrtime(startTime);
    const execTime = endTime[0] * 1000 + endTime[1] / 1000000;

    console.log(`Processing time - ${logStr}: ${execTime} ms`);
  },
};
