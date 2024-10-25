import { expect, it } from "vitest";
import {
	shouldHaveDollarPrefix,
	shouldNotHaveDollarPrefix,
	shouldHaveRequiredProp,
} from "./validation";

it.each([
	[{}, false],
	[{ $type: "color", $value: "#ff0000" }, true],
])(
	`토큰 객체의 필수 속성이 모두 포함되어 있는지 검사한다`,
	(tokenObj, expected) => {
		expect(shouldHaveRequiredProp(tokenObj)).toBe(expected);
	},
);

it.each([
	[
		{
			$name: "primary",
			$description: "Primary color",
		},
		true,
	],
	[
		{
			name: "primary",
			description: "Primary color",
		},
		false,
	],
])(
	`객체 속성에 $가 prefix로 설정되어 있는지 확인한다`,
	(tokenObj, expected) => {
		expect(shouldHaveDollarPrefix(tokenObj)).toBe(expected);
	},
);

it.each([
	[
		{
			primary: {
				$type: "color",
				$value: "#ff0000",
			},
			secondary: {
				$type: "color",
				$value: "#00ff00",
			},
		},
		true,
	],
	[
		{
			$primary: {
				$type: "color",
				$value: "#ff0000",
			},
			$secondary: {
				$type: "color",
				$value: "#00ff00",
			},
		},
		false,
	],
])(
	`객체 속성에 $가 prefix로 설정되어 있지 않은지 확인한다`,
	(tokenObj, expected) => {
		expect(shouldNotHaveDollarPrefix(tokenObj)).toBe(expected);
	},
);
