import { expect, it } from "vitest";
import parse from "./parse";
import Token from "./token";

it(`[parse] 순환 참조 테스트`, () => {
	const base = new Token({
		color: {
			primary: {
				$type: "color",
				$value: "{color.a}",
			},
		},
	});
	const refToken = new Token({
		color: {
			a: {
				$type: "color",
				$value: "{color.b}",
			},
			b: {
				$type: "color",
				$value: "{color.a}",
			},
		},
	});
	expect(() => parse(base, [refToken])).toThrowError();
});

it(`[parse] 파싱 테스트`, () => {
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
		b: {
			$type: "strokeStyle",
			$value: "{stroke}",
		},
	});
	const refToken = new Token({
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
	});
	expect(parse(base, [refToken]).getToken()).toStrictEqual({
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
		b: {
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
	});
});
