import { AttributePart } from "@/template/parts/AttributePart.js";
import { TemplateException } from "@/template/TemplateException.js";

export class EventPart extends AttributePart<EventListener> {
    private onEvent: EventListener | undefined;

    get eventName() {
        return this.name.slice(1);
    }

    init(): void {
        super.init();
        this.useRealAttribute = false;
        this.dependsOnOwner = true;
        if (this.name.length < 2 || this.name[0] != "@")
            throw new TemplateException(
                "events attributes should respect format @eventName=${callable}",
            );
        this.node.removeAttribute(this.name);
    }

    update() {
        super.update();
        if (this.onEvent)
            this.node.removeEventListener(this.eventName, this.onEvent);
        this.onEvent = this.value;
        if (typeof this.onEvent !== "function")
            throw new TemplateException("events values must be callable");
        this.node.addEventListener(this.eventName, this.onEvent);
    }

    destroy(): void {
        super.destroy();
        if (this.onEvent)
            this.node.removeEventListener(this.eventName, this.onEvent);
        this.onEvent = undefined;
    }
}
