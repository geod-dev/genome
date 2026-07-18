import { AttributePart } from "@/template/parts/AttributePart.js";
import { createPart } from "@/template/parts/createPart.js";
import { EventPart } from "@/template/parts/EventPart.js";
import { Part } from "@/template/parts/Part.js";
import { TemplateException } from "@/template/TemplateException.js";
import { isMarker } from "@/types/Marker.js";
import { PartSourceMap } from "@/types/PartSource.js";

function partifyAttribute(
    attribute: Attr,
    sources: PartSourceMap,
): Part | undefined {
    if (!isMarker(attribute.value)) return;
    const source = sources.get(attribute.value);
    if (!source)
        throw new TemplateException(
            `No part found for marker ${attribute.value}`,
        );
    const isEvent = attribute.name.startsWith("@");
    return createPart(
        isEvent ? EventPart : AttributePart,
        attribute,
        source.value,
    );
}

export function partifyElementAttributes(
    element: Element,
    sources: PartSourceMap,
    parts: Part[],
) {
    for (const attribute of element.attributes) {
        const part = partifyAttribute(attribute, sources);
        if (part) parts.push(part);
    }
}
