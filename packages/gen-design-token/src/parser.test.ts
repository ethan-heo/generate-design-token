import { expect, it } from "vitest";
import parser from "./parser";

const TOKEN = {
	color: {
		white: {
			$type: "color",
			$value: "#ffffff",
		},
		black: {
			1: {
				$type: "color",
				$value: "#000000",
			},
			2: {
				$type: "color",
				$value: "#333333",
			},
		},
	},
};

it(`파싱을 한다`, () => {
	const value = {
		"color-primary": {
			$type: "color",
			$value: "{color.white}",
		},
		"color-secondary": {
			$type: "color",
			$value: "{color.black.2}",
		},
		"color-text": {
			$type: "color",
			$value: "{color.black.1}",
		},
	};

	const expected = {
		"color-primary": {
			$type: "color",
			$value: "#ffffff",
		},
		"color-secondary": {
			$type: "color",
			$value: "#333333",
		},
		"color-text": {
			$type: "color",
			$value: "#000000",
		},
	};

	expect(parser(value, [TOKEN])).toStrictEqual(expected);
});
