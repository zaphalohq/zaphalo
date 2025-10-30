type Listener = (loading: boolean) => void;

class LoaderSignal {
  private listeners: Listener[] = [];
  private count = 0;

  start() {
    this.count++;
    this.emit(true);
  }

  stop() {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) this.emit(false);
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(loading: boolean) {
    this.listeners.forEach((l) => l(loading));
  }
}

export const loaderSignal = new LoaderSignal();
