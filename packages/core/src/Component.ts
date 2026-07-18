import { bindMethods } from "@/utils/bindMethods.js";
import { getInheritedStylesheets } from "@/utils/getInheritedStylesheets.js";
import { GenomeContext } from "@genome/context";
import { TemplateLike } from "@genome/dom-contracts";

export abstract class Component extends HTMLElement {
    static styles?: CSSStyleSheet;

    protected $context: GenomeContext = {};

    private template: TemplateLike | undefined;
    private methodsBinded: boolean = false;

    private get root(): ShadowRoot {
        if (!this.shadowRoot) return this.attachShadow({ mode: "open" });
        return this.shadowRoot;
    }

    private adoptStylesheets() {
        const stylesheets = getInheritedStylesheets(this);
        if (!stylesheets.length) return;
        this.root.adoptedStyleSheets = [
            ...this.root.adoptedStyleSheets,
            ...stylesheets,
        ];
    }

    private ensureMethodsBinded() {
        if (this.methodsBinded) return;
        this.methodsBinded = true;
        bindMethods(this, Component);
    }

    private get closestComponent(): Component | null {
        let node: Node | null = this.parentNode;
        while (node && !(node instanceof HTMLBodyElement)) {
            if (node instanceof Component) return node;
            if (node instanceof ShadowRoot) node = node.host;
            else node = node.parentNode;
        }
        return null;
    }

    protected onBeforeMount() {}
    protected onMounted() {}
    connectedCallback() {
        this.ensureMethodsBinded();
        this.$context = this.closestComponent?.$context ?? {};
        this.adoptStylesheets();
        this.onBeforeMount();
        this.mountContent();
        this.onMounted();
    }

    protected onBeforeUnmount() {}
    protected onUnmounted() {}
    disconnectedCallback() {
        this.onBeforeUnmount();
        this.unmountContent();
        this.onUnmounted();
    }

    private mountContent() {
        const render = this.render();
        if (render instanceof TemplateLike) {
            this.template = render;
            this.template.attachContext(this.$context);
            this.template.build();
            this.template.mount(this.root);
        } else this.root.innerHTML = render;
    }

    private unmountContent() {
        this.template?.destroy();
        this.template = undefined;
        this.root.innerHTML = "";
    }

    protected rerender() {
        this.unmountContent();
        this.mountContent();
    }

    protected render(): TemplateLike | string {
        return "<slot></slot>";
    }
}
