import { it } from "vitest";
import TokenProcessor from "../TokenProcessor";

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
])(`Usecase2. 유효성 검사를 진행한다`, () => {});

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
