import { expect, it } from "vitest";
import Parser from "./parser";
import Token from "./token";

const Tokens = [
	{
		color: {
			white: {
				$type: "color",
				$value: "{color.primary.2}",
			},
			black: {
				$type: "color",
				$value: "#000000",
			},
			a: {
				$type: "color",
				$value: "{color.b}",
			},
		},
	},
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
			b: {
				$type: "color",
				$value: "{color.c}",
			},
		},
	},
	{
		color: {
			secondary: {
				1: {
					$type: "color",
					$value: "#0000ff",
				},
				2: {
					$type: "color",
					$value: "{color.a}",
				},
			},
			c: {
				$type: "color",
				$value: "{color.b}",
			},
		},
	},
	{
		"border-width": {
			1: {
				$type: "dimension",
				$value: {
					value: 1,
					unit: "rem",
				},
			},
			2: {
				$type: "dimension",
				$value: {
					value: 2,
					unit: "rem",
				},
			},
		},
		border: {
			style: {
				$type: "strokeStyle",
				$value: "groove",
			},
		},
	},
].map((token) => new Token(token));

it.each([
	["{color.white}", "#00ff00"],
	["{color.secondary.1}", "#0000ff"],
])(`Parser.findValueBy(%o)`, (tokenRef, expected) => {
	const parser = new Parser();

	expect(parser.findValueBy(tokenRef, Tokens)).toStrictEqual(expected);
});

it.each([["{color.a}"]])(
	`Parser.findValueBy 순환 참조 에러 발생`,
	(tokenRef) => {
		const parser = new Parser();

		expect(() => parser.findValueBy(tokenRef, Tokens)).toThrowError();
	},
);

it(`Parser.parse()`, () => {
	const base = new Token({
		stroke: {
			$type: "strokeStyle",
			$value: {
				dashArray: [
					`{border-width.1}`,
					`{border-width.2}`,
					{ value: 3, unit: "rem" },
				],
				lineCap: "{border.style}",
			},
		},
		border: {
			style: {
				$type: "strokeStyle",
				$value: "solid",
			},
		},
	});

	expect(new Parser().parse(base, Tokens).getToken()).toStrictEqual({
		stroke: {
			$type: "strokeStyle",
			$value: {
				dashArray: [
					{ value: 1, unit: "rem" },
					{ value: 2, unit: "rem" },
					{ value: 3, unit: "rem" },
				],
				lineCap: "solid",
			},
		},
		border: {
			style: {
				$type: "strokeStyle",
				$value: "solid",
			},
		},
	});
});
