import fs from "node:fs/promises";
import path from "node:path";

import { copyGeneratedFile } from "./utils/copy-generated-file.mjs";
import { generatePackageJson } from "./utils/generate-package-json.mjs";

const ROOT = process.cwd();

const PACKAGES_DIR = path.join(ROOT, "packages");
const SHARED_BASE_DIR = path.join(ROOT, "shared", "base");
const SHARED_TESTS_DIR = path.join(ROOT, "shared", "tests");

async function findPackages() {
    const entries = await fs.readdir(PACKAGES_DIR, {
        withFileTypes: true,
    });

    return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(PACKAGES_DIR, entry.name));
}

async function createPackageContext(packagePath) {
    const context = {
        path: packagePath,
        name: path.basename(packagePath),
        sources: [SHARED_BASE_DIR],
    };
    if (await exists(path.join(packagePath, "tests")))
        context.sources.push(SHARED_TESTS_DIR);
    return context;
}

async function generatePackage(context) {
    console.log(`Generating ${context.name}`);

    await generatePackageJson(context);

    await generateSharedFiles(context);
}

async function generateSharedFiles(context) {
    const files = await collectFiles(context.sources);
    for (const file of files) await copyGeneratedFile(file, context);
}

async function collectFiles(sources) {
    const files = new Map();

    for (const source of sources) {
        const entries = await fs.readdir(source, {
            withFileTypes: true,
        });

        for (const entry of entries) {
            if (entry.isDirectory()) continue;
            if (entry.name === "package.json") continue;
            files.set(entry.name, {
                name: entry.name,
                source: path.join(source, entry.name),
            });
        }
    }

    return [...files.values()];
}

async function exists(file) {
    try {
        await fs.access(file);
        return true;
    } catch {
        return false;
    }
}

const packages = await findPackages();

for (const packagePath of packages) {
    const context = await createPackageContext(packagePath);
    await generatePackage(context);
}

console.log("Done.");
