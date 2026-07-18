import { Component } from "@/Component.js";

export function getInheritedStylesheets(component: Component): CSSStyleSheet[] {
    const stylesheets: CSSStyleSheet[] = [];

    let constructor = component.constructor as typeof Component;
    while (constructor !== Component) {
        if (Object.hasOwn(constructor, "styles") && constructor.styles)
            stylesheets.unshift(constructor.styles);
        constructor = Object.getPrototypeOf(constructor);
    }
    return stylesheets;
}
