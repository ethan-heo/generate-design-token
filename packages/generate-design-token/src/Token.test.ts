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
		token.find((props) => {
			return props.join('.') === "color.tertiary.1";
		}),
	).toStrictEqual([["color", "tertiary", "1"], TOKEN.color.tertiary[1]]);
});

it(`[Token.findAll] 특정 조건에 맞는 토큰을 모두 찾아 반환한다.`, () => {
	const token = new Token(TOKEN);

	expect(token.findAll((props) => {
		const tokenRef = props.join('.')
		return tokenRef === "color.primary" || tokenRef === "color.secondary";
	})).toStrictEqual([
		[["color", "secondary"], TOKEN.color.secondary],
		[["color", "primary"], TOKEN.color.primary],
	]);
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