import { expect, it } from "vitest";
import findValueToToken from "./findValueToToken";

const GLOBAL_TOKEN = {
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

const REFERRED_TOKEN = {
	color: {
		primary: {
			$type: "color",
			$value: "{color.white}",
		},
		secondary: {
			$type: "color",
			$value: "{color.black.2}",
		},
		text: {
			$type: "color",
			$value: "{color.black.1}",
		},
	},
};

it.each([
	[
		"color.white",
		{
			$type: "color",
			$value: "#ffffff",
		},
	],
	[
		"color.black.1",
		{
			$type: "color",
			$value: "#000000",
		},
	],
	[
		"color.black.2",
		{
			$type: "color",
			$value: "#333333",
		},
	],
])(`findValueToToken(%s) => %o`, (value, expected) => {
	expect(
		findValueToToken(value.split("."), [REFERRED_TOKEN, GLOBAL_TOKEN]),
	).toStrictEqual(expected);
});
