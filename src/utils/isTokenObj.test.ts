import { expect, it } from "vitest";
import isTokenObj from "./isTokenObj";

it.each([
	[
		{
			$type: "color",
			$value: "#0000ff",
		},
		true,
	],
	[
		{
			blue: {
				1: {
					$type: "color",
					$value: "#0000ff",
				},
			},
		},
		false,
	],
	[
		{
			$description: "주요 브랜드 색상을 나타냅니다.",
			$type: "color",
			$value: "{color.red.4}",
		},
		true,
	],
])(`isTokenObj(%o) => %s`, (value, expected) => {
	expect(isTokenObj(value)).toBe(expected);
});
