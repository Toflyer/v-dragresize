// rollup.config.js
const packageJson = require("./package.json");
const babel = require("@rollup/plugin-babel");
const terser = require('@rollup/plugin-terser');

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
            file: packageJson.main,
            format: "cjs",
        },
        plugins,
    },
    {
        input: "src/index.js",
        output: {
            file: packageJson.module,
            format: "esm",
        },
        plugins,
    },
];
