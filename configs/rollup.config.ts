import tsPlugin from "@rollup/plugin-typescript";

const INPUT_PATH = "./src";
const OUTPUT_PATH = "./dist";

export default {
	input: INPUT_PATH + "/index.ts",
	output: {
		file: OUTPUT_PATH + "/index.js",
		format: "cjs",
		sourcemap: true,
	},
	plugins: [
		tsPlugin({
			declaration: true,
			declarationDir: OUTPUT_PATH,
		}),
	],
};
