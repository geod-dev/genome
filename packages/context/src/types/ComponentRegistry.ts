export interface ComponentRegistry {
    constructor: new () => HTMLElement;
    path: string;
    name: string;
    tag: string;
}
