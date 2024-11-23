import { expect, it } from "vitest";
import Token, { TokenResult } from "../token";
import * as Types from "@types";
import UseCase2 from "./use-case2";
import { isTokenObj } from "@utils";

const Tokens = [
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
	} as Types.TokenGroup,
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
] as unknown as [Types.TokenGroup, TokenResult[]][])(
	`UseCase2.`,
	(actual, expected) => {
		const token = new Token(actual);
		const case2 = new UseCase2();

		case2.transform(token, Tokens);

		expect(token.findAll((_, token) => isTokenObj(token))).toStrictEqual(
			expected,
		);
	},
);
