export class TemplateException extends Error {
    constructor(message?: string) {
        super("Failed to parse html template: " + message);
    }
}
