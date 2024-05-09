import tsPlugin from "@rollup/plugin-typescript";

const INPUT_PATH = "./src";
const OUTPUT_PATH = "./dist";

export default {
	input: INPUT_PATH + "/index.ts",
	output: [
    {
      file: OUTPUT_PATH + "/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: OUTPUT_PATH + "/index.es.js",
      format: "es",
      sourcemap: true,
    }
  ],
	plugins: [
		tsPlugin({
      
    }),
	],
};
