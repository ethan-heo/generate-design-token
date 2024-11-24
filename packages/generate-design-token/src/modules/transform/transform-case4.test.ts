import { expect, it } from "vitest";
import Token, { TokenResult } from "../../token";
import useCase4 from "./transform-case4";
import * as Types from "@types";
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
] as unknown as [Types.TokenGroup, TokenResult[]][])(
	`UseCase4.transformTokens() should transform tokens correctly`,
	(baseToken, expected) => {
		const base = new Token(baseToken);

		expect(transform(base, refTokens, [useCase4]).getToken()).toStrictEqual(
			expected,
		);
	},
);
