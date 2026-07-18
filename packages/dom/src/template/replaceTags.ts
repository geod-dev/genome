export function replaceTags(
    html: string,
    replacements: Record<string, string>,
): string {
    return html.replace(
        /<\/?([a-zA-Z][\w-]*)(\s[^>]*?)?>/g,
        (match, tagName, attrs = "") => {
            const isClosing = match.startsWith("</");
            const newTag = replacements[tagName] ?? tagName;

            return match.replace(tagName, newTag);
        },
    );
}
