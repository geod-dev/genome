import { Component } from "@genome/core";
import { html } from "@genome/dom";
import Counter from "./Counter";

export default class GenomeApp extends Component {
    protected onBeforeMount(): void {
        this.$context.components ??= new Map();
        this.$context.components.set("Counter", {
            constructor: Counter,
            name: "Counter",
            tag: "genome-counter",
            path: "./Counter",
        });
    }

    render() {
        return html`<genome-counter></genome-counter>`;
    }
}

customElements.define("genome-app", GenomeApp);
