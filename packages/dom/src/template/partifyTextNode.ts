import { createPart } from "@/template/parts/createPart.js";
import { Part } from "@/template/parts/Part.js";
import { TextPart } from "@/template/parts/TextPart.js";
import { TemplateException } from "@/template/TemplateException.js";
import { Marker, MARKER_SUFFIX, MarkerPrefix } from "@/types/Marker.js";
import { PartSourceMap } from "@/types/PartSource.js";

function getMarker(text: string): Marker | undefined {
    for (const prefix of Object.values(MarkerPrefix)) {
        const start = text.indexOf(prefix);
        if (start == -1) continue;
        const remaining = text.slice(start + prefix.length);
        const idLength = remaining.indexOf(MARKER_SUFFIX);
        if (idLength == -1)
            throw new TemplateException(
                `No suffix found for marker prefix ${prefix}`,
            );
        const end = start + prefix.length + idLength + MARKER_SUFFIX.length;
        return text.slice(start, end) as Marker;
    }
}

export function partifyTextNode(
    node: Text,
    sources: PartSourceMap,
    parts: Part[],
) {
    const marker = getMarker(node.data);
    if (!marker) return parts;
    if (!sources.has(marker))
        throw new TemplateException(`No part found for marker ${marker}`);
    const start = node.data.indexOf(marker);
    const end = start + marker.length;

    const before = new Text(node.data.slice(0, start));
    const part = createPart(TextPart, sources.get(marker)!.value);
    parts.push(part);
    const after = new Text(node.data.slice(end));

    if (before.length) {
        node.parentNode?.insertBefore(before, node);
        partifyTextNode(before, sources, parts);
    }
    node.parentNode?.insertBefore(part.node, node);
    if (after.length) {
        node.parentNode?.insertBefore(after, node);
        partifyTextNode(after, sources, parts);
    }
    node.remove();
}
