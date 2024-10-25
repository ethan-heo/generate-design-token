import { expect, it } from "vitest";
import Token from "./Token";
import * as Types from "./types";

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
	const actual1 = token.findAll((tokenName) => {
		return tokenName === "primary" || tokenName === "secondary";
	});
	const expected1: Types.Token[] = [TOKEN.color.primary, TOKEN.color.secondary];

	expect(actual1.every((token) => expected1.includes(token))).toBeTruthy();

	const actual2 = token.findAll(/(primary)|(secondary)/);
	const expected2: Types.Token[] = [TOKEN.color.primary, TOKEN.color.secondary];

	expect(actual2.every((token) => expected2.includes(token))).toBeTruthy();
});

it(`토큰 유효성 검사를 진행한다.`, () => {
	expect(() => {
		new Token({
			color: {
				primary: {
					$type: "color",
					$value: "#ff0000",
				},
			},
		});
	}).not.toThrowError();
	expect(() => {
		new Token({
			color: {
				$primary: {
					$type: "color",
					$description: "#ff0000",
				},
			},
		});
	}).toThrowError();
	expect(() => {
		new Token({
			color: {
				primary: {
					$type: "color",
					$value: "#ff0000",
					description: "color",
				} as Types.TokenObj,
			},
		});
	}).not.toThrowError();
});
