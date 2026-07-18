import { Component } from "@genome/core";
import { html } from "@genome/dom";
import { state } from "@genome/state";

export default class Counter extends Component {
    counter = state(0);

    onClick() {
        this.counter.value++;
    }

    render() {
        return html`<button @click=${this.onClick}>${this.counter}</button>`;
    }
}

customElements.define("genome-counter", Counter);
