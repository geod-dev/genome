export function bindMethods<T extends object>(
    instance: T,
    stopParent?: object,
) {
    const seen = new Set<PropertyKey>();

    let prototype = Object.getPrototypeOf(instance);
    const stopPrototype = stopParent ? Object.getPrototypeOf(stopParent) : null;

    while (
        prototype &&
        prototype !== stopPrototype &&
        prototype !== Object.prototype
    ) {
        for (const key of Object.getOwnPropertyNames(prototype)) {
            if (seen.has(key)) continue;
            seen.add(key);

            const descriptor = Object.getOwnPropertyDescriptor(prototype, key);

            if (
                descriptor &&
                typeof descriptor.value === "function" &&
                key !== "constructor"
            ) {
                Object.defineProperty(instance, key, {
                    ...descriptor,
                    value: descriptor.value.bind(instance),
                });
            }
        }

        prototype = Object.getPrototypeOf(prototype);
    }
}
