export type SubscriberCallback<T = unknown> = (value: T) => unknown;
export type UnsubscribeFunction = () => void;

export abstract class Reactive<T = unknown> {
    abstract readonly value: T;
    abstract subscribe(callback: SubscriberCallback<T>): UnsubscribeFunction;
    abstract unsubscribe(callback: SubscriberCallback<T>): void;
}
