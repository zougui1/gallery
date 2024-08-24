export abstract class TaskQueue<T> {
  #initialized = false;

  constructor() {
    setTimeout(() => {
      this.#initialized = true;
      this.exec();
    }, 100);
  }

  abstract findIdle(): Promise<T | undefined>;
  abstract findBusy(): Promise<T | undefined>;
  abstract process(task: T): Promise<void>;

  add = async (task: T): Promise<void> => {
    if (!this.#initialized) {
      return;
    }

    const busyTask = await this.findBusy();

    if (busyTask) {
      return;
    }

    await this._process(task);
  }

  protected exec = async (): Promise<void> => {
    const busyTask = await this.findBusy();

    if (busyTask) {
      return;
    }

    const idleTask = await this.findIdle();

    if (idleTask) {
      await this._process(idleTask);
    }
  }

  protected _process = async (task: T): Promise<void> => {
    await this.process(task);
    await this.exec();
  }

  protected async _init(): Promise<void> {
    try {
      const busyTask = await this.findBusy();

      if (busyTask) {
        await this._process(busyTask);
      }

      const idleTask = await this.findIdle();

      if (idleTask) {
        await this._process(idleTask);
      }
    } finally {
      this.#initialized = true;
    }
  }
}
