import { RollupOptions } from "rollup";
import tsPlugin from "@rollup/plugin-typescript";

const INPUT_PATH = "./src";
const OUTPUT_PATH = "./dist";

export default {
	input: INPUT_PATH + "/index.ts",
	output: {
		file: OUTPUT_PATH + "/index.esm.js",
		format: "esm",
		sourcemap: true,
	},
	plugins: [
		tsPlugin({
			declaration: true,
			declarationDir: OUTPUT_PATH,
		}),
	],
};
