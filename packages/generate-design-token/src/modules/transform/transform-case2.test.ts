import { expect, it } from "vitest";
import { Token } from "@modules";
import useCase2 from "./transform-case2";
import transform from "./transform";
import { TokenGroup } from "@types";

const refTokens = [
	{
		color: {
			white: {
				$type: "color",
				$value: "#ffffff",
			},
			black: {
				$type: "color",
				$value: "#000000",
			},
			primary: {
				1: {
					$type: "color",
					$value: "#ff0000",
				},
				2: {
					$type: "color",
					$value: "#00ff00",
				},
			},
		},
	} as TokenGroup,
].map((token) => new Token(token));

it.each([
	[
		{
			border: {
				"{color}": {
					$type: "string",
					$value: "1px solid {$value}",
				},
			},
		},
		{
			border: {
				primary: {
					"1": {
						$type: "string",
						$value: "1px solid {color.primary.1}",
					},
					"2": { $type: "string", $value: "1px solid {color.primary.2}" },
				},
				black: { $type: "string", $value: "1px solid {color.black}" },
				white: { $type: "string", $value: "1px solid {color.white}" },
			},
		},
	],
])(`UseCase2.`, (actual, expected) => {
	const base = new Token(actual);

	expect(transform(base, refTokens, [useCase2]).getToken()).toStrictEqual(
		expected,
	);
});
