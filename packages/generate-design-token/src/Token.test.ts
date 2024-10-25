import { expect, it } from "vitest";
import Token from "./Token";
import * as Types from "./TokenGenerator.types";

const TOKEN = {
	color: {
		primary: {
			$type: "color",
			$value: "#ff0000",
		},
		secondary: {
			$type: "color",
			$value: "#00ff00",
		},
		tertiary: {
			1: {
				$type: "color",
				$value: "#0000ff",
			},
		},
	},
	border: {
		small: {
			$type: "string",
			$value: "1px solid #ff0000",
		},
		medium: {
			$type: "string",
			$value: "2px solid #00ff00",
		},
		large: {
			$type: "string",
			$value: "3px solid #0000ff",
		},
	},
};

it(`[Token.find] 특정 조건에 맞는 토큰을 찾아 반환한다.`, () => {
	const token = new Token(TOKEN);

	expect(
		token.find((tokenName) => {
			return tokenName === "1";
		}),
	).toStrictEqual(TOKEN.color.tertiary[1]);

	expect(token.find("color.primary")).toStrictEqual(TOKEN.color.primary);
	expect(token.find("color.primary.1")).toStrictEqual(undefined);
});

it(`[Token.findAll] 특정 조건에 맞는 토큰을 모두 찾아 반환한다.`, () => {
	const token = new Token(TOKEN);
	const expected: Types.Token[] = [TOKEN.color.primary, TOKEN.color.secondary];
	const actual = token.findAll((tokenName) => {
		return tokenName === "primary" || tokenName === "secondary";
	});

	expect(actual.every((token) => expected.includes(token))).toBeTruthy();
});
