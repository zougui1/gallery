export abstract class DatabaseQueue<T> {
  abstract findIdle(): Promise<T | undefined>;
  abstract findBusy(): Promise<T | undefined>;
  abstract process(item: T): Promise<void>;

  add = async (item: T): Promise<void> => {
    const busyItem = await this.findBusy();

    if (busyItem) {
      return;
    }

    await this._process(item);
  }

  protected _process = async (item: T): Promise<void> => {
    await this.process(item);

    const busyItem = await this.findBusy();

    if (busyItem) {
      return;
    }

    const idleItem = await this.findIdle();

    if (idleItem) {
      await this._process(idleItem);
    }
  }
}
