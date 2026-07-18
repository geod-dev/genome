import { Template } from "@/template/Template.js";
import { TemplateSource } from "@/template/TemplateSource.js";

export function html(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Template {
    const source = new TemplateSource(strings, values);
    return new Template(source);
}
