import { expect, it } from "vitest";
import Token from "../Token";
import * as Types from "../types";
import UseCase2 from "./UseCase2";
import isTokenObj from "../isTokenObj";

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
	},
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
		[
			[
				["border", "white"],
				{
					$type: "string",
					$value: "1px solid {color.white}",
				},
			],
			[
				["border", "black"],
				{
					$type: "string",
					$value: "1px solid {color.black}",
				},
			],
			[
				["border", "primary", "2"],
				{
					$type: "string",
					$value: "1px solid {color.primary.2}",
				},
			],
			[
				["border", "primary", "1"],
				{
					$type: "string",
					$value: "1px solid {color.primary.1}",
				},
			],
		],
	],
] as [Types.Token, Types.TokenResult[]][])(`UseCase2.`, (actual, expected) => {
	const token = new Token(actual);
	const case2 = new UseCase2();

	case2.transform(token, Tokens);

	expect(token.findAll((_, token) => isTokenObj(token))).toStrictEqual(
		expected,
	);
});