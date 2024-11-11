import { expect, it } from "vitest";
import UseCase1 from "./UseCase1";
import Token, { TokenResult } from "../Token";
import * as Types from "../types";
import transformPropsToTokenRef from "../transformPropsToTokenRef";

const Tokens = [
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
		[
			["white"],
			{
				$type: "string",
				$value: "1px solid {color.white}",
			},
		],
	],
] as unknown as [Types.TokenGroup, TokenResult][])(
	`UseCase1. 속성 이름이 토큰 참조값이 포함되어 있고 속성 값이 토큰 객체인 경우`,
	(actual, expected) => {
		const token = new Token(actual);
		const case1 = new UseCase1();

		case1.transform(token, Tokens);

		expect(
			token.find((props) => transformPropsToTokenRef(props) === "white"),
		).toStrictEqual(expected);
	},
);
