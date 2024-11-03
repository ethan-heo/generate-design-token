import { it } from "vitest";
import Token from "../Token";

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
		},
		[
			[
				["border", "white", "thin"],
				{
					$type: "color",
					$value: "1px solid {color.white}",
				},
			],
			[
				["border", "white", "large"],
				{
					$type: "color",
					$value: "2px solid {color.white}",
				},
			],
		],
	],
])(
	`UseCase3.transformTokens() should transform tokens correctly`,
	(baseToken, expected) => {},
);
