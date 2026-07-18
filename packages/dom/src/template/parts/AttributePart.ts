import { NamedPart } from "@/template/parts/NamedPart.js";
import { TemplateException } from "@/template/TemplateException.js";
import { PartData } from "@/types/PartData.js";

export class AttributePart<Tdata = unknown> extends NamedPart<
    Element,
    string,
    Tdata
> {
    protected useRealAttribute: boolean = true;

    constructor(attr: Attr, data: PartData<Tdata>) {
        if (!attr.ownerElement)
            throw new TemplateException("Attr should have an ownerElement");
        super(attr.ownerElement, attr.name, data);
    }

    update() {
        if (this.useRealAttribute)
            this.node.setAttribute(this.name, this.textContent);
    }

    destroy(): void {
        super.destroy();
        if (this.useRealAttribute) this.node.removeAttribute(this.name);
    }
}
