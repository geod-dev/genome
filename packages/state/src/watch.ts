import { State } from "@/state.js";

export function watch<T>(state: State<T>) {
    return function (
        originalMethod: (value: T) => void,
        context: ClassMethodDecoratorContext,
    ) {
        context.addInitializer(function () {
            state.subscribe((value) => {
                originalMethod.call(this, value);
            });
        });
    };
}
