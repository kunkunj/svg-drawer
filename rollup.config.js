import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript2";
//压缩工具
const { terser } = require("rollup-plugin-terser");
const packageJson = require("./package.json");
//清除工具
import clear from "rollup-plugin-clear";
export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: "dist/svg-drawer.min.js",
        format: "umd",
        sourcemap: false,
        name: packageJson.name,
      },
    ],
    plugins: [
      babel({
        exclude: "node_modules/**",
      }),
      resolve(),
      commonjs(),
      // terser(),
      typescript(),
      serve({
        open: true,
        openPage: "/demo/index.html",
      }),
      clear({
        targets: ["dist"], // 项目打包编译生成的目录
        watch: true, // 实时监听文件变化
      }),
    ],
  },
];
