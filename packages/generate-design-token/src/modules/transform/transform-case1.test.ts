import { expect, it } from "vitest";
import Token, { TokenResult } from "../../token";
import * as Types from "@types";
import useCase1 from "./transform-case1";
import transform from "./transform";

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
	} as Types.TokenGroup,
].map((token) => new Token(token));

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
] as unknown as [Types.TokenGroup, TokenResult][])(
	`UseCase1. 속성 이름이 토큰 참조값이 포함되어 있고 속성 값이 토큰 객체인 경우`,
	(actual, expected) => {
		const base = new Token(actual);

		expect(transform(base, refTokens, [useCase1]).getToken()).toStrictEqual(
			expected,
		);
	},
);
