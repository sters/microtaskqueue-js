class MicroTaskQueue {
    constructor() {
        this.queue = [];
        this.whenLastTask = performance.now();
        this.idleDetectionMs = 1000;
        this.idleTimeMs = 500;
        this.idleMaxTimeMs = this.idleTimeMs * 5;
        this.stopped = false;
    }

    add(fn) {
        this.queue.push(fn);
    }

    addEachDom(selector, fn) {
        this.add(() => {
            document.querySelectorAll(selector).forEach((e) => {
                this.add(() => fn(e));
            });
        });
    }

    addTimerOnce(fn, tickMs) {
        setTimeout(() => {
            this.add(fn);
        }, tickMs || 300);
    }

    start() {
        if (this.stopped) return;

        const n = performance.now();
        if (this.queue.length === 0) {
            const t = n - this.whenLastTask;
            if (t > this.idleMaxTimeMs) {
                // timeout, auto stop
                this.stop();
            } else if (t > this.idleDetectionMs) {
                // waiting for idle
                requestAnimationFrame(() => this.start());
            } else {
                // idle now
                setTimeout(() => this.start(), this.idleTimeMs);
            }
            return;
        }

        // do microtask
        const limit = 3;
        const taskStartTime = performance.now();
        do {
            const task = this.queue.shift();
            if (typeof task === 'function') {
                task();
            }
            this.whenLastTask = performance.now();
        } while (this.queue.length !== 0 && this.whenLastTask - taskStartTime < limit);
        this.whenLastTask = performance.now();

        requestAnimationFrame(() => this.start());
    }

    stop() {
        this.stopped = true;
    }
}
