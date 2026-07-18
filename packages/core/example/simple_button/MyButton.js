import { Component } from "../../dist/index.js";

function createStyles() {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(`
    button {
        color: red;
    }
    `);
    return sheet;
}

class MyButton extends Component {
    static styles = createStyles()

    render() {
        return '<button><slot></slot></button>'
    }
}

customElements.define('my-button', MyButton);
