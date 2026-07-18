import { ComponentRegistry } from "@/types/ComponentRegistry.js";

export interface GenomeContext {
    components?: Map<string, ComponentRegistry>;
}
