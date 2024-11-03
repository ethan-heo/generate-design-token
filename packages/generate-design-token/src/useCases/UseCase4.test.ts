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
			[
				["border", "black", "thin"],
				{
					$type: "color",
					$value: "1px solid {color.black}",
				},
			],
			[
				["border", "black", "large"],
				{
					$type: "color",
					$value: "2px solid {color.black}",
				},
			],
		],
	],
])(
	`UseCase3.transformTokens() should transform tokens correctly`,
	(baseToken, expected) => {},
);
