import { PartSourceMap } from "@/types/PartSource.js";

export interface TemplateSource {
    html: string;
    parts: PartSourceMap;
}
