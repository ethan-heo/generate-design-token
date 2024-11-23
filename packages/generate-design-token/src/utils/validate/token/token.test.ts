import { expect, it } from "vitest";
import { Validate } from "@utils";

it(`Validator.tokenObj.dimension`, () => {
	expect(
		Validate.token.dimension({
			$type: "dimension",
			$value: {
				value: 10,
				unit: "px",
			},
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.dimension({
			$type: "dimension",
			$value: "10vw",
		} as any),
	).toThrowError();
	expect(() =>
		Validate.token.dimension({
			$type: "dimension",
			$value: {
				value: 10,
				unit: "vw",
			},
		} as any),
	).toThrowError();
	expect(() =>
		Validate.token.dimension({
			$type: "dimension",
			$value: {
				value: "10",
				unit: "rem",
			},
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.color`, () => {
	expect(
		Validate.token.color({
			$type: "color",
			$value: "#ff0000",
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.color({
			$type: "color",
			$value: "ff0000",
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.fontFamily`, () => {
	expect(
		Validate.token.fontFamily({
			$type: "fontFamily",
			$value: "Arial",
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.fontFamily({
			$type: "fontFamily",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.fontWeight`, () => {
	expect(
		Validate.token.fontWeight({
			$type: "fontWeight",
			$value: "bold",
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.fontWeight({
			$type: "fontWeight",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.duration`, () => {
	expect(
		Validate.token.duration({
			$type: "duration",
			$value: {
				value: 1000,
				unit: "ms",
			},
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.duration({
			$type: "duration",
			$value: 1000,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.cubicBezier`, () => {
	expect(
		Validate.token.cubicBezier({
			$type: "cubicBezier",
			$value: [1, 1, 1, 1],
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.cubicBezier({
			$type: "cubicBezier",
			$value: 1000,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.number`, () => {
	expect(
		Validate.token.number({
			$type: "number",
			$value: 10,
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.number({
			$type: "number",
			$value: "10",
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.string`, () => {
	expect(
		Validate.token.string({
			$type: "string",
			$value: "Hello, World!",
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.string({
			$type: "string",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.composite`, () => {
	expect(
		Validate.token.composite({
			$type: "composite",
			$value: {
				"aa.bb.cc": 43,
			},
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.composite({
			$type: "composite",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.strokeStyle`, () => {
	expect(
		Validate.token.strokeStyle({
			$type: "strokeStyle",
			$value: {
				lineCap: "round",
				dashArray: ["{border-width.1}", "{border-width.2}"],
			},
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.strokeStyle({
			$type: "strokeStyle",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.border`, () => {
	expect(
		Validate.token.border({
			$type: "border",
			$value: {
				width: "{border-width.1}",
				style: "solid",
				color: "#ff0000",
			},
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.border({
			$type: "border",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.transition`, () => {
	expect(
		Validate.token.transition({
			$type: "transition",
			$value: {
				duration: {
					value: 1000,
					unit: "ms",
				},
				delay: {
					value: 500,
					unit: "ms",
				},
				timingFunction: [1, 1, 1, 1],
			},
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.transition({
			$type: "transition",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.shadow`, () => {
	expect(
		Validate.token.shadow({
			$type: "shadow",
			$value: {
				offsetX: {
					value: 10,
					unit: "px",
				},
				offsetY: {
					value: 10,
					unit: "px",
				},
				blur: {
					value: 10,
					unit: "px",
				},
				spread: {
					value: 10,
					unit: "px",
				},
				color: "#000000",
			},
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.shadow({
			$type: "shadow",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.gradient`, () => {
	expect(
		Validate.token.gradient({
			$type: "gradient",
			$value: [
				{
					color: "#ff0000",
					position: 0,
				},
				{
					color: "#00ff00",
					position: 100,
				},
			],
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.gradient({
			$type: "gradient",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`Validator.tokenObj.typography`, () => {
	expect(
		Validate.token.typography({
			$type: "typography",
			$value: {
				fontFamily: "Arial",
				fontWeight: "bold",
				fontSize: {
					value: 10,
					unit: "px",
				},
				lineHeight: 10,
				letterSpacing: {
					value: 10,
					unit: "px",
				},
			},
		}),
	).toBeTruthy();
	expect(() =>
		Validate.token.typography({
			$type: "typography",
			$value: 42,
		} as any),
	).toThrowError();
});
