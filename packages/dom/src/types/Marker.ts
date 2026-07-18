import { PartType } from "@/types/PartSource.js";

export enum MarkerPrefix {
    TEXT = "__TEXT_MARKER_",
    ATTR = "__ATTR_MARKER_",
}

export const MARKER_PREFIX = {
    [PartType.TEXT]: MarkerPrefix.TEXT,
    [PartType.ATTR]: MarkerPrefix.ATTR,
};

export const MARKER_SUFFIX = "__";

type UUID = ReturnType<typeof crypto.randomUUID>;
export type Marker = `${MarkerPrefix}${UUID}${typeof MARKER_SUFFIX}`;

export function isMarker(text: string): text is Marker {
    return Object.values(MarkerPrefix).some((prefix) =>
        text.startsWith(prefix),
    );
}

export function createMarker(type: PartType, id: UUID): Marker {
    return (MARKER_PREFIX[type] + id + MARKER_SUFFIX) as Marker;
}
