import { expect, it } from "vitest";
import {
	validateOptionalTokenProperties,
	validateRequiredTokenProperties,
} from "./validation";

it.each([
	[{}, false],
	[{ $type: "color", $value: "#ff0000" }, true],
])(`토큰 객체의 필수 속성을 검사한다`, (tokenObj, expected) => {
	expect(validateRequiredTokenProperties(tokenObj)).toBe(expected);
});

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
])(`토큰 객체의 필수 속성을 검사한다`, (tokenObj, expected) => {
	expect(validateOptionalTokenProperties(tokenObj)).toBe(expected);
});
