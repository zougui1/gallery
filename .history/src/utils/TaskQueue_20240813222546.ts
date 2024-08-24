export abstract class TaskQueue<T> {
  abstract findIdle(): Promise<T | undefined>;
  abstract findBusy(): Promise<T | undefined>;
  abstract process(task: T): Promise<void>;

  add = async (task: T): Promise<void> => {
    const busyTask = await this.findBusy();

    if (busyTask) {
      return;
    }

    await this._process(task);
  }

  protected _process = async (task: T): Promise<void> => {
    await this.process(task);

    const busyTask = await this.findBusy();

    if (busyTask) {
      return;
    }

    const idleTask = await this.findIdle();

    if (idleTask) {
      await this._process(idleTask);
    }
  }
}
