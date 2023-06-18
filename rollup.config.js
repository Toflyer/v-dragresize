// rollup.config.js
const packageJson = require("./package.json");
const babel = require("@rollup/plugin-babel");
const terser = require('@rollup/plugin-terser');
const del = require('rollup-plugin-delete');

let plugins = [
    babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"]
    }),
    terser(),
];
module.exports = [
    {
        input: "src/index.js",
        output: {
            file: packageJson.module,
            format: "esm",
        },
        plugins: [
            del({
                targets: packageJson.module,
            }),
            ...plugins,
        ],
    },
    {
        input: "src/index.js",
        output: {
            file: packageJson.main,
            format: "cjs",
        },
        plugins: [
            del({
                targets: packageJson.main,
            }),
            ...plugins,
        ],
    }
];
