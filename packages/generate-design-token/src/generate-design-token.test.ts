import generateDesignToken from ".";
import { expect, it } from "vitest";

const Tokens = [
	{
		color: {
			white: {
				$type: "color",
				$value: "white",
			},
			black: {
				$type: "color",
				$value: "black",
			},
		},
	},
	{
		color: {
			primary: {
				$type: "color",
				$value: "#ff0000",
			},
		},
	},
];

it.each([
	[
		{
			"{color}": {
				$type: "string",
				$description: "hello world",
				$value: "1px solid {$value}",
			},
			border: {
				"{color}": {
					$type: "string",
					$value: "1px solid {$value}",
				},
				"{color.primary}": {
					$type: "string",
					$value: "1px solid {$value}",
				},
			},
		},
		{
			white: {
				$type: "string",
				$description: "hello world",
				$value: "1px solid white",
			},
			black: {
				$type: "string",
				$description: "hello world",
				$value: "1px solid black",
			},
			border: {
				white: {
					$type: "string",
					$value: "1px solid white",
				},
				black: {
					$type: "string",
					$value: "1px solid black",
				},
				primary: {
					$type: "string",
					$value: "1px solid #ff0000",
				},
			},
		},
	],
])(`generateDesignToken`, (actual, expected) => {
	expect(generateDesignToken(actual, Tokens)).toEqual(expected);
});
