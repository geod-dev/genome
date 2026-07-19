import { state, State } from "@/state.js";

const globalStates = new Map<string, State<any>>();

export function globalState<T = unknown>(
    name: string,
    defaultValueCallback: () => T = () => undefined as T,
): State<T> {
    if (!globalStates.has(name))
        globalStates.set(name, state<T>(defaultValueCallback()));
    return globalStates.get(name)!;
}

export function clearGlobalStates() {
    return globalStates.clear();
}
