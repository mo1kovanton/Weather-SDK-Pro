const { WeatherScheduler } = require("../src/scheduler/WeatherScheduler");

describe("WeatherScheduler", () => {
  jest.useFakeTimers();
  let calls;

  beforeEach(() => {
    calls = [];
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test("executes task immediately and on interval", () => {
    const task = jest.fn(async () => {
      calls.push("run");
    });
    const scheduler = new WeatherScheduler({ task, intervalMin: 1 / 60 }); // 1 секунда

    scheduler.start();

    expect(task).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(task).toHaveBeenCalledTimes(2);

    scheduler.dispose();

    jest.advanceTimersByTime(1000);
    expect(task).toHaveBeenCalledTimes(2);
  });

  test("does not start twice", () => {
    const task = jest.fn(async () => {
      calls.push("run");
    });
    const scheduler = new WeatherScheduler({ task, intervalMin: 1 / 60 });

    scheduler.start();
    scheduler.start();

    jest.advanceTimersByTime(1000);
    expect(task).toHaveBeenCalledTimes(2);

    scheduler.dispose();
  });
});
