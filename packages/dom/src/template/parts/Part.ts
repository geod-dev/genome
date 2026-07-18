import { PartData } from "@/types/PartData.js";
import { Reactive, UnsubscribeFunction } from "@genome/state-contracts";

export abstract class Part<Tnode extends Node = Node, Tdata = unknown> {
    private unsubscribe: UnsubscribeFunction = () => {};
    protected dependsOnOwner: boolean = false;

    constructor(
        private _node: Tnode,
        private readonly data: PartData<Tdata>,
    ) {}

    get value(): Tdata {
        return this.data instanceof Reactive ? this.data.value : this.data;
    }

    get textContent(): string {
        return String(this.value);
    }

    get node() {
        return this._node;
    }

    set node(node: Tnode) {
        this.destroy();
        this._node = node;
        this.init();
        this.update();
    }

    init() {
        if (this.data instanceof Reactive)
            this.unsubscribe = this.data.subscribe(() => this.update());
    }

    abstract update(): void;

    destroy() {
        this.unsubscribe();
    }
}
