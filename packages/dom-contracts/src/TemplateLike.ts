import { GenomeContext } from "@genome/context";

export abstract class TemplateLike {
    abstract attachContext(context: GenomeContext): void;
    abstract build(): void;
    abstract mount(shadow: ShadowRoot): void;
    abstract destroy(): void;
}
