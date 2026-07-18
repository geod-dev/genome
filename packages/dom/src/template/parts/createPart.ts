import { Part } from "@/template/parts/Part.js";

export function createPart<T extends Part>(
    constructor: new (...args: any[]) => T,
    ...args: any[]
): T {
    const part = new constructor(...args);
    part.init();
    part.update();
    return part;
}
