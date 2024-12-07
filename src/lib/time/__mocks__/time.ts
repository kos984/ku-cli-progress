export class Time {
  protected static time?: number = undefined;
  public static setMockTimeForAll = (time: number) => {
    Time.time = time;
  };

  public static instances: Time[] = [];

  protected time = 0;

  public constructor() {
    Time.instances.push(this);
  }

  public getTime = jest.fn().mockImplementation(() => {
    const time = this.time;
    this.time += 1000;
    return Time.time !== undefined ? Time.time : time;
  });
}
