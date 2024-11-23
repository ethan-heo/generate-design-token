import { defineConfig } from "vitest/config";
import paths from "../tsconfig.paths.json";
import path from "path";

const ROOT_PATH = path.resolve(__dirname, "../");

export default defineConfig({
	test: {
		cache: false,
	},
	resolve: {
		alias: Object.entries(paths.compilerOptions.paths).map(
			([alias, pathArr]) => {
				return {
					find: alias,
					replacement: path.resolve(ROOT_PATH, pathArr[0]),
				};
			},
		),
	},
});
