import { expect, it } from "vitest";
import TokenProcessor from "../TokenProcessor";
import Usecase2 from "./Usecase2";
import { TokenIterator } from "../types/token";

const baseTokens = [
	new TokenProcessor({
		color: {
			primary: {
				1: { $type: "color", $value: "#ff0000" },
				2: { $type: "color", $value: "#00ff00" },
			},
			secondary: { $type: "color", $value: "#0000ff" },
		},
	}),
];
const usecase2 = new Usecase2(baseTokens);

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
			"border.{color.teritary}",
			{
				$type: "color",
				$value: "2px solid {$value}",
			},
		],
		false,
	],
	[
		[
			"border.{color.primary.1}",
			{
				$type: "color",
				$value: "2px solid {$value}",
			},
		],
		false,
	],
	[
		[
			"border.primary.1",
			{
				$type: "color",
				$value: "2px solid {$value}",
			},
		],
		false,
	],
	[
		[
			"border.primary.1",
			{
				$type: "color",
				$value: "2px solid #ff0000",
			},
		],
		false,
	],
] as [TokenIterator[number], boolean][])(
	`Usecase2. 유효성 검사를 진행한다`,
	(actual, expected) => {
		expect(usecase2.validate(actual)).toStrictEqual(expected);
	},
);

it.each([
	[
		[
			`border.{color.primary}`,
			{ $type: "demansion", $value: "1px solid {$value}" },
		],
		[
			[
				`border.primary.1`,
				{ $type: "demansion", $value: "1px solid {color.primary.1}" },
			],
			[
				`border.primary.2`,
				{ $type: "demansion", $value: "1px solid {color.primary.2}" },
			],
		],
	],
	[
		[`border.{color}`, { $type: "demansion", $value: "1px solid {$value}" }],
		[
			[
				`border.primary.1`,
				{ $type: "demansion", $value: "1px solid {color.primary.1}" },
			],
			[
				`border.primary.2`,
				{ $type: "demansion", $value: "1px solid {color.primary.2}" },
			],
			[
				`border.secondary`,
				{ $type: "demansion", $value: "1px solid {color.secondary}" },
			],
		],
	],
])(`Usecase2. 토큰을 변환한다`, () => {});
