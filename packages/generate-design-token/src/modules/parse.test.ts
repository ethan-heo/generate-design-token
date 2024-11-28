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
		b: {
			$type: "string",
			$value: "{stroke}",
		},
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
				$value: "{border-width.3}",
			},
			3: {
				$type: "dimension",
				$value: {
					value: 3,
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
					{ value: 3, unit: "rem" },
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
					{ value: 3, unit: "rem" },
					{ value: 3, unit: "rem" },
				],
				lineCap: "solid",
			},
		},
	});
});

it(`토큰 객체의 값이 참조값일 때 참조값이 또 다른 참조값을 가리키고 있는 경우`, () => {
	const base = new Token({
		color: {
			primary: {
				$type: "string",
				$value: "{a.b}",
			},
		},
	});
	const refToken = new Token({
		a: {
			b: {
				$type: "color",
				$value: "{a.c}",
			},
			c: {
				$type: "dimension",
				$value: {
					value: 1,
					unit: "px",
				},
			},
		},
	});
	expect(parse(base, [refToken]).getToken()).toStrictEqual({
		color: {
			primary: {
				$type: "dimension",
				$value: {
					value: 1,
					unit: "px",
				},
			},
		},
	});
});
