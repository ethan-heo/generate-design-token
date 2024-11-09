import { expect, it } from "vitest";
import Token, { TokenResult } from "../Token";
import UseCase4 from "./UseCase4";
import isTokenObj from "../isTokenObj";
import * as Types from "../types";

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
		},
	} as Types.Token,
].map((token) => new Token(token));

it.each([
	[
		{
			border: {
				"{color}": {
					thin: {
						$type: "string",
						$value: "1px solid {$value}",
					},
					large: {
						$type: "string",
						$value: "2px solid {$value}",
					},
				},
			},
		},
		[
			[
				["border", "white", "thin"],
				{
					$type: "string",
					$value: "1px solid {color.white}",
				},
			],
			[
				["border", "white", "large"],
				{
					$type: "string",
					$value: "2px solid {color.white}",
				},
			],
			[
				["border", "black", "thin"],
				{
					$type: "string",
					$value: "1px solid {color.black}",
				},
			],
			[
				["border", "black", "large"],
				{
					$type: "string",
					$value: "2px solid {color.black}",
				},
			],
		],
	],
] as unknown as [Types.AnyToken, TokenResult[]][])(
	`UseCase4.transformTokens() should transform tokens correctly`,
	(baseToken, expected) => {
		const token = new Token(baseToken);
		const useCase4 = new UseCase4();

		useCase4.transform(token, Tokens);

		expect(token.findAll((_, token) => isTokenObj(token))).toStrictEqual(
			expected,
		);
	},
);
