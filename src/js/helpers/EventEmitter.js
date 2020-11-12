class EventEmitter {
  constructor() {
    this.observers = {};
  }

  subscribe(observerName, listener) {
    if (!this.observers[observerName]) {
      this.observers[observerName] = [];
    }

    this.observers[observerName].push(listener);
  }

  publish(observerName, data) {
    const observer = this.observers[observerName];
    if (!observer || !observer.length) {
      return;
    }

    observer.forEach((listener) => {
      listener(data);
    });
  }
}

export default new EventEmitter();
