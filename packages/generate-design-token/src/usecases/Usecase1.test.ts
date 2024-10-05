import { expect, it } from "vitest";
import Usecase1 from "./Usecase1";
import TokenProcessor from "../TokenProcessor";
import { TokenIterator } from "../types/token";

const baseTokens = [
	new TokenProcessor({
		color: { primary: { $type: "color", $value: "#ff0000" } },
	}),
];
const usecase1 = new Usecase1(baseTokens);

it.each([
	[
		[
			"border.{color.primary}",
			{
				$type: "color",
				$value: "2px solid {$value}",
			},
		],
		true,
	],
	[
		[
			"border.{color}",
			{
				$type: "color",
				$value: "2px solid {$value}",
			},
		],
		false,
	],
	[
		[
			"border.{color.white}",
			{
				$type: "color",
				$value: "2px solid {color.white}",
			},
		],
		false,
	],
	[
		[
			"border.{color.white}",
			{
				$type: "color",
				$value: "2px solid $value",
			},
		],
		false,
	],
] as [TokenIterator[number], boolean][])(
	`Usecase1. 유효성 검사를 진행한다. `,
	(actual, expected) => {
		expect(usecase1.validate(actual)).toBe(expected);
	},
);

it.each([
	[
		[
			"border.{color.white}",
			{
				$type: "color",
				$value: "2px solid {$value}",
			},
		],
		[
			[
				"border.white",
				{
					$type: "color",
					$value: "2px solid {color.white}",
				},
			],
		],
	],
] as [TokenIterator[number], TokenIterator][])(
	`Usecase1. 토큰을 변환한다`,
	(actual, expected) => {
		expect(usecase1.transform(actual)).toStrictEqual(expected);
	},
);
