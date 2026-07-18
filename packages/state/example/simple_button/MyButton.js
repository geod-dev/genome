import { Component } from "../../../core/dist/index.js";
import { css, html, state } from "../../dist/index.js";

class MyButton extends Component {
    static styles = css`
        button {
            color: red;
        }
    `;

    @state
    counter = 0;

    onClick() {
        this.counter++;
    }

    onMount() {
        this.addEventListener("click", this.onClick);
    }

    onUnmount() {
        this.removeEventListener("click", this.onClick);
    }

    render() {
        return html` <button>${this.counter}</button> `;
    }
}

customElements.define("my-button", MyButton);
