import { TemplateException } from "@/template/TemplateException.js";
import { createMarker } from "@/types/Marker.js";
import { PartSource, PartSourceMap, PartType } from "@/types/PartSource.js";

const BANNED_TAGS = ["script", "style"];

export class TemplateSource {
    html: string = "";
    parts: PartSourceMap = new Map();
    inTag: boolean = false;
    attributeQuote: "'" | '"' | null = null;

    constructor(strings: TemplateStringsArray, values: unknown[]) {
        for (let i = 0; i < strings.length; i++) {
            this.html += strings[i]!;
            this.updateState(strings[i]!);

            if (i < values.length) this.createPartSource(values[i]);
        }
    }

    private createPartSource(value: any) {
        const type: PartType = this.inTag ? PartType.ATTR : PartType.TEXT;
        const needQuotes = type === PartType.ATTR && !this.attributeQuote;
        const id = crypto.randomUUID();
        const part: PartSource = {
            id,
            marker: createMarker(type, id),
            type,
            value,
        };
        if (needQuotes) this.html += '"';
        this.html += part.marker;
        if (needQuotes) this.html += '"';
        this.parts.set(part.marker, part);
    }

    private isQuote(char: string): char is '"' | "'" {
        return ['"', "'"].includes(char);
    }

    private getTag(htmlPart: string): string {
        const match = htmlPart.match(/^<\/?\s*([^\s/>]+)/);
        if (!match || match.length < 2)
            throw new TemplateException("invalid tag");
        return match[1]!.toLowerCase();
    }

    private updateState(htmlPart: string) {
        for (let i = 0; i < htmlPart.length; i++) {
            const char: string = htmlPart[i]!;
            if (this.inTag) {
                if (this.attributeQuote === char) this.attributeQuote = null;
                if (!this.attributeQuote && this.isQuote(char))
                    this.attributeQuote = char;
            }
            if (char == "<" && !this.attributeQuote) {
                if (this.inTag) throw new TemplateException(`unexpected "<"`);
                this.inTag = true;
                const tag = this.getTag(htmlPart.slice(i));
                if (BANNED_TAGS.includes(tag))
                    throw new TemplateException(`Tag ${tag} not allowed.`);
            }
            if (char == ">" && !this.attributeQuote) this.inTag = false;
        }
        if (this.attributeQuote)
            throw new TemplateException(`unexpected "${this.attributeQuote}"`);
    }
}
