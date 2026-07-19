import fs from "node:fs/promises";
import path from "node:path";

export async function generatePackageJson(context) {
    const sources = [path.join(context.path, "package.config.json")];
    context.sources.forEach((source) => {
        sources.push(path.join(source, "package.json"));
    });
    let packageJson = await mergeJsonFiles(sources);

    packageJson = {
        _generated: {
            message: "This file is auto-generated. Do not edit it directly.",
            command: "pnpm generate-shared",
            sources: sources.map((source) =>
                path.relative(process.cwd(), source).replaceAll("\\", "/"),
            ),
        },
        ...packageJson,
    };

    await fs.writeFile(
        path.join(context.path, "package.json"),
        JSON.stringify(packageJson, null, 2) + "\n",
        "utf8",
    );
}

async function mergeJsonFiles(files) {
    let result = {};

    for (const file of files) {
        const content = JSON.parse(await fs.readFile(file, "utf8"));
        result = deepMerge(result, content);
    }

    return result;
}

function deepMerge(target, source) {
    const result = {
        ...target,
    };

    for (const [key, value] of Object.entries(source)) {
        if (isObject(result[key]) && isObject(value)) {
            result[key] = deepMerge(result[key], value);
        } else {
            result[key] = value;
        }
    }

    return result;
}

function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
