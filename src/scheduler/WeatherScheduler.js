class WeatherScheduler {
  constructor({ task, intervalMin }) {
    this.task = task;
    this.intervalMils = intervalMin * 60 * 1000;
    this.abortController = new AbortController();
    this.intervalId = null;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.task().catch((err) => {
      console.error("Scheduler task error: ", err);
    });
    this.intervalId = setInterval(async () => {
      if (this.abortController.signal.aborted) return;
      try {
        await this.task();
      } catch (err) {
        console.error("Scheduler task error: ", err);
      }
    }, this.intervalMils);

    this.abortController.signal.addEventListener("abort", () => {
      if (this.intervalId) clearInterval(this.intervalId);
      this.running = false;
    });
  }

  dispose() {
    this.abortController.abort();
  }
}

module.exports = { WeatherScheduler };
