import { Part } from "@/template/parts/Part.js";
import { PartData } from "@/types/PartData.js";

export class TextPart<Tdata = unknown> extends Part<Text, Tdata> {
    constructor(data: PartData<Tdata>) {
        super(new Text(), data);
    }

    update() {
        this.node.data = this.textContent;
    }

    destroy(): void {
        this.node.data = "";
    }
}
