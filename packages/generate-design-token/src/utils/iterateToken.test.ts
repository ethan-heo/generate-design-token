import { expect, it } from "vitest";
import iterateToken from "./iterateToken";

it.each([
	[
		{
			color: {
				red: {
					$type: "color",
					$value: "#ff0000",
				},
				blue: {
					$type: "color",
					$value: "#0000ff",
				},
				yellow: {
					1: {
						$type: "color",
						$value: "#f0f000",
					},
				},
			},
		},
		{
			"color.red": {
				$type: "color",
				$value: "#ff0000",
			},
			"color.blue": {
				$type: "color",
				$value: "#0000ff",
			},
			"color.yellow.1": {
				$type: "color",
				$value: "#f0f000",
			},
		},
	],
	[
		{
			thin: {
				$type: "string",
				$value: "1px solid {$value}",
			},
		},
		{
			thin: {
				$type: "string",
				$value: "1px solid {$value}",
			},
		},
	],
])(`토큰을 순회한다.`, (token, expected) => {
	const mapToToken = iterateToken({
		data: {},
		foundTokenObjCallback: (tokenNames, token, data) => {
			data[tokenNames.join(".")] = token;
		},
	});

	expect(mapToToken(token)).toStrictEqual(expected);
});
