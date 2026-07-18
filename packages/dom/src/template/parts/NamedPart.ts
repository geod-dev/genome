import { Part } from "@/template/parts/Part.js";
import { PartData } from "@/types/PartData.js";

export abstract class NamedPart<
    Tnode extends Node = Node,
    Tname extends string = string,
    Tdata = unknown,
> extends Part<Tnode, Tdata> {
    constructor(
        node: Tnode,
        public readonly name: Tname,
        data: PartData<Tdata>,
    ) {
        super(node, data);
    }
}
