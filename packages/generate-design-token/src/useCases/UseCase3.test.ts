import { expect, it } from "vitest";
import Token from "../Token";
import UseCase3 from "./UseCase3";
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
		},
	},
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
])(
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
