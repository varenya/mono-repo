// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */

import esbuild from "rollup-plugin-esbuild";
import nodeResolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import path from "path";

const outDir = "build/lib";

function buildConfig({ packageDir, src }) {
  const input = path.resolve(packageDir, src);
  return {
    input,
    output: [
      {
        format: "cjs",
        dir: `${packageDir}/${outDir}`,
        sourcemap: true,
        entryFileNames: "[name].js",
      },
      {
        format: "esm",
        dir: `${packageDir}/${outDir}`,
        sourcemap: true,
        entryFileNames: "[name].mjs",
      },
    ],
    plugins: [esbuild()],
  };
}

function buildDtsConfig({ packageDir, src }) {
  const input = path.resolve(packageDir, src);
  return {
    input,
    output: {
      dir: `${packageDir}/${outDir}`,
      format: "es",
      plugins: [dts()],
    },
  };
}

const config = [
  buildConfig({
    packageDir: "packages/query",
    src: "src/index.tsx",
  }),
];

export default config;
