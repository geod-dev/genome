import { Reactive } from "@genome/state-contracts";

export type PartData<T> = T | Reactive<T>;
