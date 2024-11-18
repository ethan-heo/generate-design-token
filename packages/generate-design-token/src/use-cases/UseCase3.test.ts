import { expect, it } from "vitest";
import Token, { TokenResult } from "../Token";
import * as Types from "@types";
import UseCase3 from "./UseCase3";
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
		},
	} as Types.TokenGroup,
].map((token) => new Token(token));

it.each([
	[
		{
			border: {
				"{color.white}": {
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
			"{color.white}": {
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
		[
			[
				["white", "thin"],
				{
					$type: "string",
					$value: "1px solid {color.white}",
				},
			],
			[
				["white", "large"],
				{
					$type: "string",
					$value: "2px solid {color.white}",
				},
			],
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
		],
	],
] as unknown as [Types.TokenGroup, TokenResult[]][])(
	`UseCase3.transformTokens() should transform tokens correctly`,
	(baseToken, expected) => {
		const token = new Token(baseToken);
		const useCase3 = new UseCase3();

		useCase3.transform(token, Tokens);

		expect(token.findAll((_, token) => isTokenObj(token))).toStrictEqual(
			expected,
		);
	},
);
