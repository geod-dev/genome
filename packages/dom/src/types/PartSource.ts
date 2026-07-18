import { Marker } from "@/types/Marker.js";

export enum PartType {
    ATTR = "attr",
    TEXT = "text",
}

export interface PartSource {
    id: string;
    marker: Marker;
    type: PartType;
    value: any;
}

export type PartSourceMap = Map<Marker, PartSource>;
