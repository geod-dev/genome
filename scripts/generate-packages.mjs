import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const template = JSON.parse(
    await fs.readFile(path.join(root, "package.template.json"), "utf8"),
);

const packages = await fs.readdir(path.join(root, "packages"), {
    withFileTypes: true,
});

for (const pkg of packages) {
    if (!pkg.isDirectory()) continue;

    const dir = path.join(root, "packages", pkg.name);

    const config = JSON.parse(
        await fs.readFile(path.join(dir, "package.config.json"), "utf8"),
    );

    const result = {
        ...config,
        ...template,

        scripts: {
            ...config.scripts,
            ...template.scripts,
        },

        dependencies: {
            ...config.dependencies,
            ...template.dependencies,
        },

        devDependencies: {
            ...config.devDependencies,
            ...template.devDependencies,
        },
    };

    await fs.writeFile(
        path.join(dir, "package.json"),
        JSON.stringify(result, null, 4) + "\n",
    );

    console.log(`Generated ${pkg.name}`);
}
