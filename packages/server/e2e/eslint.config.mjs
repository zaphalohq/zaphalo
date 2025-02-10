import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import nxEslintPlugin from "@nx/eslint-plugin";
const compat = new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
    recommendedConfig: js.configs.recommended,
});

export default [
    { plugins: { "@nx": nxEslintPlugin } },
    ...compat.config({
        extends: [
            "plugin:@nx/typescript"
        ]
    }).map(config => ({
        ...config,
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts"
        ],
        rules: {
            ...config.rules
        }
    })),
    ...compat.config({
        extends: [
            "plugin:@nx/javascript"
        ]
    }).map(config => ({
        ...config,
        files: [
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        rules: {
            ...config.rules
        }
    }))
];
