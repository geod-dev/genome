import { Component } from "@genome/core";
import { css, html } from "../../dist/index.js";

class MyButton extends Component {
    static styles = css`
        button {
            color: red;
        }
    `;

    counter = 0;

    onClick() {
        this.counter++;
        this.update();
    }

    onMount() {
        this.addEventListener("click", this.onClick);
    }

    onUnmount() {
        this.removeEventListener("click", this.onClick);
    }

    render() {
        return html` <button @click=${this.update}>${this.counter}</button> `;
    }
}

customElements.define("my-button", MyButton);
