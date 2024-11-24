import { expect, it } from "vitest";
import Token, { TokenResult } from "../../token";
import * as Types from "@types";
import useCase3 from "./transform-case3";
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
] as unknown as [Types.TokenGroup, TokenResult[]][])(
	`UseCase3.transformTokens() should transform tokens correctly`,
	(baseToken, expected) => {
		const base = new Token(baseToken);

		expect(transform(base, refTokens, [useCase3]).getToken()).toStrictEqual(
			expected,
		);
	},
);
