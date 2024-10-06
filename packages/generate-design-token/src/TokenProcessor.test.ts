import { expect, it } from "vitest";
import TokenProcessor from "./TokenProcessor";

const BASE_TOKEN = {
	color: {
		primary: {
			$type: "color",
			$value: "#ff0000",
		},
		secondary: {
			$type: "color",
			$value: "#00ff00",
		},
		teritary: {
			1: {
				$type: "color",
				$value: "#0000ff",
			},
			2: {
				$type: "color",
				$value: "#00f0f0",
			},
		},
	},
} as const;

it(`입력된 토큰을 이터레이터 형태로 변경한다.`, () => {
	const tokenProcessor = new TokenProcessor(BASE_TOKEN);
	const expected = [
		["color.teritary.2", { $type: "color", $value: "#00f0f0" }],
		["color.teritary.1", { $type: "color", $value: "#0000ff" }],
		["color.secondary", { $type: "color", $value: "#00ff00" }],
		["color.primary", { $type: "color", $value: "#ff0000" }],
	];

	expect(tokenProcessor.getToken()).toStrictEqual(expected);
});

it(`참조 토큰을 통해 토큰 객체를 찾는다.`, () => {
	const tokenProcessor = new TokenProcessor(BASE_TOKEN);
	const actual = "color.primary";
	const expected = BASE_TOKEN.color.primary;

	expect(tokenProcessor.findTokenObj(actual)).toStrictEqual(expected);
});

it(`참조 토큰을 통해 토큰 구조 객체를 찾는다.`, () => {
	const tokenProcessor = new TokenProcessor(BASE_TOKEN);
	const actual1 = "color.teritary";
	const expected1 = BASE_TOKEN.color.teritary;

	expect(tokenProcessor.findTokenStructureObj(actual1)).toStrictEqual(
		expected1,
	);

	const actual2 = "color.teritary.1";

	expect(tokenProcessor.findTokenStructureObj(actual2)).toBeNull();
});
