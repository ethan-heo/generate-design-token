import { expect, it } from "vitest";
import assignToken from "./assignToken";

it.each([
	[
		["color", "red"],
		{
			a: {
				$type: "test",
				$value: "test",
			},
		},
		{
			$type: "color",
			$value: "#ff0000",
		},
		{
			a: {
				$type: "test",
				$value: "test",
			},
			color: {
				red: {
					$type: "color",
					$value: "#ff0000",
				},
			},
		},
	],
	[
		[],
		{},
		{
			red: {
				$type: "color",
				$value: "#ff0000",
			},
			yellow: {
				$type: "color",
				$value: "#f0f000",
			},
		},
		{
			red: {
				$type: "color",
				$value: "#ff0000",
			},
			yellow: {
				$type: "color",
				$value: "#f0f000",
			},
		},
	],
])(`assignToken(%o) => %o`, (tokenNames, data, tokenObj, expected) => {
	assignToken(tokenNames, data, tokenObj);
	expect(data).toStrictEqual(expected);
});
