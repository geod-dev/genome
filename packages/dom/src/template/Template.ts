import { partifyElementAttributes } from "@/template/partifyElementAttributes.js";
import { partifyTextNode } from "@/template/partifyTextNode.js";
import { Part } from "@/template/parts/Part.js";
import { replaceTags } from "@/template/replaceTags.js";
import { TemplateException } from "@/template/TemplateException.js";
import { TemplateSource } from "@/template/TemplateSource.js";
import { GenomeContext } from "@genome/context";
import { TemplateLike } from "@genome/dom-contracts";

export class Template extends TemplateLike {
    private template!: HTMLTemplateElement;
    private root!: DocumentFragment | ShadowRoot;
    private parts: Part[] = [];
    private context?: GenomeContext;
    private rawHtml: string;
    mounted: boolean = false;

    constructor(
        private readonly source: TemplateSource,
        private readonly document: Document = window.document,
    ) {
        super();
        this.rawHtml = source.html;
        this.template = this.document.createElement("template");
        this.root = this.template.content;
    }

    private replaceElementTag(element: Element, tag: string) {
        const newNode = document.createElement(tag);
        if (element instanceof Element && newNode instanceof Element) {
            for (const attr of element.attributes)
                newNode.setAttribute(attr.name, attr.value);
        }
        while (element.firstChild) newNode.appendChild(element.firstChild);
        this.parts
            .filter((p) => p.node === element)
            .forEach((part) => (part.node = newNode));
        element.replaceWith(newNode);
    }

    private createWalker() {
        return this.document.createTreeWalker(
            this.root,
            NodeFilter.SHOW_ELEMENT |
                NodeFilter.SHOW_COMMENT |
                NodeFilter.SHOW_TEXT,
        );
    }

    private getTreeNodes() {
        const walker = this.createWalker();
        const nodes: Node[] = [];

        let node: Node | null;

        while ((node = walker.nextNode())) {
            nodes.push(node);
        }
        return nodes;
    }

    attachContext(context: GenomeContext): void {
        this.context = context;
        if (!context.components) return;
        const tagMap: Record<string, string> = {};
        context.components.forEach((c) => (tagMap[c.name] = c.tag));
        this.rawHtml = replaceTags(this.rawHtml, tagMap);
    }

    build() {
        this.template.innerHTML = this.rawHtml;
        if (this.root.childNodes.length !== 1)
            throw new TemplateException(
                "template should have exactly 1 root tag",
            );
        const nodes = this.getTreeNodes();
        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE)
                partifyTextNode(node as Text, this.source.parts, this.parts);
            if (node instanceof Element)
                partifyElementAttributes(node, this.source.parts, this.parts);
        }
    }

    mount(shadow: ShadowRoot) {
        this.root.childNodes.forEach((node) => shadow.appendChild(node));
        this.root = shadow;
    }

    destroy(): void {
        this.parts.forEach((p) => p.destroy());
    }
}
