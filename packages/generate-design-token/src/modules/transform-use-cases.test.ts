import { expect, it } from "vitest";
import transform from "./transform";
import { useCase1, useCase2, useCase3, useCase4 } from "./transform-use-cases";
import { TokenGroup } from "../types/token.types";
import Token from "./token";

it.each([
	[
		{
			"{color.white}": {
				$type: "string",
				$value: "1px solid {$value}",
			},
		},
		{
			white: {
				$type: "string",
				$value: "1px solid {color.white}",
			},
		},
	],
])(
	`UseCase1. 속성 이름이 토큰 참조값이 포함되어 있고 속성 값이 토큰 객체인 경우`,
	(actual, expected) => {
		const base = new Token(actual);
		const refTokens = [
			{
				color: {
					white: {
						$type: "color",
						$value: "#ffffff",
					},
					black: {
						$type: "color",
						$value: "#000000",
					},
				},
			} as TokenGroup,
		].map((token) => new Token(token));

		expect(transform(base, refTokens, [useCase1]).getToken()).toStrictEqual(
			expected,
		);
	},
);

it.each([
	[
		{
			border: {
				"{color}": {
					$type: "string",
					$value: "1px solid {$value}",
				},
			},
		},
		{
			border: {
				primary: {
					"1": {
						$type: "string",
						$value: "1px solid {color.primary.1}",
					},
					"2": { $type: "string", $value: "1px solid {color.primary.2}" },
				},
				black: { $type: "string", $value: "1px solid {color.black}" },
				white: { $type: "string", $value: "1px solid {color.white}" },
			},
		},
	],
])(`UseCase2.`, (actual, expected) => {
	const base = new Token(actual);
	const refTokens = [
		{
			color: {
				white: {
					$type: "color",
					$value: "#ffffff",
				},
				black: {
					$type: "color",
					$value: "#000000",
				},
				primary: {
					1: {
						$type: "color",
						$value: "#ff0000",
					},
					2: {
						$type: "color",
						$value: "#00ff00",
					},
				},
			},
		} as TokenGroup,
	].map((token) => new Token(token));

	expect(transform(base, refTokens, [useCase2]).getToken()).toStrictEqual(
		expected,
	);
});

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
		{
			border: {
				white: {
					large: { $type: "string", $value: "2px solid {color.white}" },
					thin: { $type: "string", $value: "1px solid {color.white}" },
				},
			},
			white: {
				large: { $type: "string", $value: "2px solid {color.white}" },
				thin: { $type: "string", $value: "1px solid {color.white}" },
			},
		},
	],
])(`UseCase3`, (baseToken, expected) => {
	const base = new Token(baseToken);
	const refTokens = [
		{
			color: {
				white: {
					$type: "color",
					$value: "#ffffff",
				},
				black: {
					$type: "color",
					$value: "#000000",
				},
			},
		} as TokenGroup,
	].map((token) => new Token(token));

	expect(transform(base, refTokens, [useCase3]).getToken()).toStrictEqual(
		expected,
	);
});

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
		{
			border: {
				black: {
					large: {
						$type: "string",
						$value: "2px solid {color.black}",
					},
					thin: {
						$type: "string",
						$value: "1px solid {color.black}",
					},
				},
				white: {
					large: {
						$type: "string",
						$value: "2px solid {color.white}",
					},
					thin: {
						$type: "string",
						$value: "1px solid {color.white}",
					},
				},
			},
		},
	],
])(
	`UseCase4.transformTokens() should transform tokens correctly`,
	(baseToken, expected) => {
		const base = new Token(baseToken);

		const refTokens = [
			{
				color: {
					white: {
						$type: "color",
						$value: "#ffffff",
					},
					black: {
						$type: "color",
						$value: "#000000",
					},
				},
			} as TokenGroup,
		].map((token) => new Token(token));

		expect(transform(base, refTokens, [useCase4]).getToken()).toStrictEqual(
			expected,
		);
	},
);
