export function css(
    strings: TemplateStringsArray,
    ...values: never[]
): CSSStyleSheet {
    if (strings.length !== 1 || values.length !== 0) {
        throw new Error("css tag should not use dynamic template variables");
    }

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(strings[0]!);

    return sheet;
}
