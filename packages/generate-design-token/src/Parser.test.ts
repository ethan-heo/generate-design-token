import { it } from "vitest";
import Parser from "./Parser";
import Token from "./Token";
import * as Types from "./types";

const Tokens = [
	{
		color: {
			white: {
				$type: "color",
				$value: [
					{
						color: "{color.primary.2}",
					},
				],
			},
			black: {
				$type: "color",
				$value: "#000000",
			},
		},
	} as unknown as Types.TokenGroup,
	{
		color: {
			primary: {
				1: {
					$type: "color",
					$value: "{color.secondary.1}",
				},
				2: {
					$type: "color",
					$value: "#00ff00",
				},
			},
		},
	} as unknown as Types.TokenGroup,
	{
		color: {
			secondary: {
				1: {
					$type: "color",
					$value: "#0000ff",
				},
				2: {
					$type: "color",
					$value: "#f000f0",
				},
			},
		},
	} as Types.TokenGroup,
].map((token) => new Token(token));

it(`Parser.findTOkenValue`, () => {
	const parser = new Parser(new Token({}), Tokens);

	console.log(parser.findTokenValue("color.white"));
});
