import {
    Reactive,
    SubscriberCallback,
    UnsubscribeFunction,
} from "@genome/state-contracts";

export class State<T = unknown> extends Reactive<T> {
    private _value: T;
    private subscribers: SubscriberCallback<T>[] = [];

    constructor(value: T) {
        super();
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    set value(value: T) {
        this._value = value;
        this.subscribers.forEach((callback) => callback(value));
    }

    subscribe(callback: SubscriberCallback<T>): UnsubscribeFunction {
        this.subscribers.push(callback);
        return () => this.unsubscribe(callback);
    }

    unsubscribe(callback: SubscriberCallback<T>): void {
        this.subscribers = this.subscribers.filter((c) => c !== callback);
    }
}

export function state<T = unknown>(value: T): State<T> {
    return new State<T>(value);
}
