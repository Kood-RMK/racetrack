import EventEmitter from "events";

export enum StopwatchEvents {
    onStopwatchTick = 'onStopwatchTick',
    onStopwatchReset = 'onStopwatchReset',
    onStopwatchStopped = 'onStopwatchStopped',
    onStopwatchStarted = 'onStopwatchStarted',
}

export interface StopwatchCallbacks {
    [StopwatchEvents.onStopwatchTick]: (elapsed: number) => void;
    [StopwatchEvents.onStopwatchReset]: () => void;
    [StopwatchEvents.onStopwatchStopped]: () => void;
    [StopwatchEvents.onStopwatchStarted]: () => void;
}

export class StopwatchEventEmitter extends EventEmitter {

  off<K extends keyof StopwatchCallbacks>(event: K, listener: StopwatchCallbacks[K]): this {
    return super.off(event, listener);
  }

  on<K extends keyof StopwatchCallbacks>(event: K, listener: StopwatchCallbacks[K]): this {
    return super.on(event, listener);
  }

  emit<K extends keyof StopwatchCallbacks>(event: K, ...args: Parameters<StopwatchCallbacks[K]>): boolean {
    return super.emit(event, ...args);
  }
}


export class Stopwatch {
    private _startTime: number | null;
    private _elapsed: number;
    private _intervalId: NodeJS.Timeout | null;
    private _tickInternal: number;
    private _eventEmitter;

    constructor(tickInternal: number = 100) {
        this._startTime = null;
        this._elapsed = 0;
        this._intervalId = null;
        this._tickInternal = tickInternal;
        this._eventEmitter = new StopwatchEventEmitter();
    }

    public get events() {
        return this._eventEmitter;
    }

    public start() : void {

        if (this._intervalId) {
            // Already running.
            return;
        } 

        this._startTime = Date.now() - this._elapsed;
        this._intervalId = setInterval(() => this.update(), this._tickInternal);
        this._eventEmitter.emit(StopwatchEvents.onStopwatchStarted);
    }

    public stop() {

        if (!this._intervalId) {
            // Not running.
            return;
        }

        if (this._startTime !== null) {
            this._elapsed = Date.now() - this._startTime;
        }

        clearInterval(this._intervalId);
        this._intervalId = null;
        this._eventEmitter.emit(StopwatchEvents.onStopwatchStopped);
    }

    public reset() {
        this.stop();
        this._elapsed = 0;
        this._startTime = Date.now();

        this._eventEmitter.emit(StopwatchEvents.onStopwatchReset);
        this.start();
        return 0;
    }

    public get elapsed(): number {
        if (this._startTime !== null) {
            return Date.now() - this._startTime;
        }

        return 0;
    }

    private update() {
        if (this._startTime !== null) {
            this._eventEmitter.emit(StopwatchEvents.onStopwatchTick, this.elapsed);
        }
    }
}