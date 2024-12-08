import { expect, it } from "vitest";
import Token from "./token";
import { TokenGroup, TokenObj } from "../types/token.types";
import { toTokenRef } from "../utils/token-ref";
import { isTokenObj } from "../utils/token-obj";

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
			2: {
				$type: "color",
				$value: "#00f0ff",
			},
		},
	},
} as const;

it(`[Token.find] 특정 조건에 맞는 토큰을 찾아 반환한다.`, () => {
	const token = new Token(TOKEN);

	expect(
		token.find((props) => {
			return props.join(".") === "color.tertiary.1";
		}),
	).toStrictEqual([["color", "tertiary", "1"], TOKEN.color.tertiary[1]]);
});

it(`[Token.findAll] 특정 조건에 맞는 토큰을 모두 찾아 반환한다.`, () => {
	const token = new Token(TOKEN);

	expect(token.findAll((_, token) => isTokenObj(token))).toStrictEqual([
		[["color", "primary"], TOKEN.color.primary],
		[["color", "secondary"], TOKEN.color.secondary],
		[["color", "tertiary", "1"], TOKEN.color.tertiary[1]],
		[["color", "tertiary", "2"], TOKEN.color.tertiary[2]],
	]);
});

it(`[Token.add] 토큰 속성을 추가한다`, () => {
	const token = new Token(TOKEN);
	const actual = {
		props: ["color", "tertiary", "2"],
		token: {
			$type: "color",
			$value: "#0000ff",
		} as TokenObj,
	};
	const expected = [
		["color", "tertiary", "2"],
		{
			$type: "color",
			$value: "#0000ff",
		},
	];

	token.add(actual.props, actual.token);

	expect(
		token.find((props) => toTokenRef(props) === "color.tertiary.2"),
	).toStrictEqual(expected);
});

it(`[Token.delete] 토큰 속성을 삭제한다`, () => {
	const TOKEN = {
		color: {
			tertiary: {
				1: {
					$type: "color",
					$value: "#0000ff",
				},
			},
		},
	} as const;
	const token = new Token(TOKEN);

	token.delete(["color", "tertiary", "1"]);

	expect(
		token.find((props) => toTokenRef(props) === "color.tertiary.1"),
	).toBeUndefined();
});

it(`[Token.clone] 토큰을 복제한다`, () => {
	const TOKEN = {
		color: {
			tertiary: {
				1: {
					$type: "color",
					$value: "#0000ff",
				},
			},
		},
	} as const;
	const token = new Token(TOKEN);
	const cloneToken = token.clone();
	const actual = cloneToken.find(
		(props) => toTokenRef(props) === "color.tertiary.1",
	)!;

	expect(actual[1] === TOKEN.color.tertiary[1]).toBeFalsy();
});

it(`[Token.map] 토큰을 변환하여 반환한다.`, () => {
	const TOKEN = {
		color: {
			tertiary: {
				1: {
					$type: "color",
					$value: "#0000ff",
				},
			},
		},
	} as const;
	const token = new Token(TOKEN);
	const expected = [
		[
			["color"],
			{
				tertiary: {
					1: {
						$type: "string",
						$value: "1px solid {color.tertiary.1}",
					},
				},
			},
		],
		[
			["color", "tertiary"],
			{
				1: {
					$type: "string",
					$value: "1px solid {color.tertiary.1}",
				},
			},
		],
		[
			["color", "tertiary", "1"],
			{
				$type: "string",
				$value: "1px solid {color.tertiary.1}",
			},
		],
	];

	expect(
		token.map((props, token) => {
			if (isTokenObj(token)) {
				token.$type = "string";
				token.$value = "1px solid {color.tertiary.1}";
				return [props, token];
			}

			return [props, token];
		}),
	).toStrictEqual(expected);
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
				primary: {
					$type: "hello",
					$description: "#ff0000",
				} as TokenGroup,
			},
		});
	}).not.toThrowError();
	expect(() => {
		new Token({
			color: {
				primary: {
					$type: "color",
					$value: "#ff0000",
					description: "color",
				} as TokenObj,
			},
		});
	}).not.toThrowError();
});
