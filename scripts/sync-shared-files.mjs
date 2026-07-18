import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const sharedDir = path.join(root, "shared");
const packagesDir = path.join(root, "packages");

async function copyDirectory(source, destination) {
    await fs.mkdir(destination, { recursive: true });

    const entries = await fs.readdir(source, {
        withFileTypes: true,
    });

    for (const entry of entries) {
        const srcPath = path.join(source, entry.name);
        const destPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

const packages = await fs.readdir(packagesDir, {
    withFileTypes: true,
});

for (const pkg of packages) {
    if (!pkg.isDirectory()) continue;

    const packagePath = path.join(packagesDir, pkg.name);

    await copyDirectory(sharedDir, packagePath);

    console.log(`Synced shared files -> ${pkg.name}`);
}

console.log("Done.");
