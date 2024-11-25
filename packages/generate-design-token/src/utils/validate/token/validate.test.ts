import { expect, it } from "vitest";
import {
	validateBorderToken,
	validateColorToken,
	validateCompositeToken,
	validateCubicBezierToken,
	validateDimensionToken,
	validateDurationToken,
	validateFontFamilyToken,
	validateFontWeightToken,
	validateGradientToken,
	validateNumberToken,
	validateShadowToken,
	validateStringToken,
	validateStrokeStyleToken,
	validateTransitionToken,
	validateTypographyToken,
} from "./validate";

it(`validateDimensionToken`, () => {
	expect(
		validateDimensionToken({
			$type: "dimension",
			$value: {
				value: 10,
				unit: "px",
			},
		}),
	).toBeTruthy();
	expect(() =>
		validateDimensionToken({
			$type: "dimension",
			$value: "10vw",
		} as any),
	).toThrowError();
	expect(() =>
		validateDimensionToken({
			$type: "dimension",
			$value: {
				value: 10,
				unit: "vw",
			},
		} as any),
	).toThrowError();
	expect(() =>
		validateDimensionToken({
			$type: "dimension",
			$value: {
				value: "10",
				unit: "rem",
			},
		} as any),
	).toThrowError();
});

it(`validateColorToken`, () => {
	expect(
		validateColorToken({
			$type: "color",
			$value: "#ff0000",
		}),
	).toBeTruthy();
	expect(() =>
		validateColorToken({
			$type: "color",
			$value: "ff0000",
		} as any),
	).toThrowError();
});

it(`validateFontFamilyToken`, () => {
	expect(
		validateFontFamilyToken({
			$type: "fontFamily",
			$value: "Arial",
		}),
	).toBeTruthy();
	expect(() =>
		validateFontFamilyToken({
			$type: "fontFamily",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`validateFontWeightToken`, () => {
	expect(
		validateFontWeightToken({
			$type: "fontWeight",
			$value: "bold",
		}),
	).toBeTruthy();
	expect(() =>
		validateFontWeightToken({
			$type: "fontWeight",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`validateDurationToken`, () => {
	expect(
		validateDurationToken({
			$type: "duration",
			$value: {
				value: 1000,
				unit: "ms",
			},
		}),
	).toBeTruthy();
	expect(() =>
		validateDurationToken({
			$type: "duration",
			$value: 1000,
		} as any),
	).toThrowError();
});

it(`validateCubicBezierToken`, () => {
	expect(
		validateCubicBezierToken({
			$type: "cubicBezier",
			$value: [1, 1, 1, 1],
		}),
	).toBeTruthy();
	expect(() =>
		validateCubicBezierToken({
			$type: "cubicBezier",
			$value: 1000,
		} as any),
	).toThrowError();
});

it(`validateNumberToken`, () => {
	expect(
		validateNumberToken({
			$type: "number",
			$value: 10,
		}),
	).toBeTruthy();
	expect(() =>
		validateNumberToken({
			$type: "number",
			$value: "10",
		} as any),
	).toThrowError();
});

it(`validateStringToken`, () => {
	expect(
		validateStringToken({
			$type: "string",
			$value: "Hello, World!",
		}),
	).toBeTruthy();
	expect(() =>
		validateStringToken({
			$type: "string",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`validateCompositeToken`, () => {
	expect(
		validateCompositeToken({
			$type: "composite",
			$value: {
				"aa.bb.cc": 43,
			},
		}),
	).toBeTruthy();
	expect(() =>
		validateCompositeToken({
			$type: "composite",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`validateStrokeStyleToken`, () => {
	expect(
		validateStrokeStyleToken({
			$type: "strokeStyle",
			$value: {
				lineCap: "round",
				dashArray: ["{border-width.1}", "{border-width.2}"],
			},
		}),
	).toBeTruthy();
	expect(() =>
		validateStrokeStyleToken({
			$type: "strokeStyle",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`validateBorderToken`, () => {
	expect(
		validateBorderToken({
			$type: "border",
			$value: {
				width: "{border-width.1}",
				style: "solid",
				color: "#ff0000",
			},
		}),
	).toBeTruthy();
	expect(() =>
		validateBorderToken({
			$type: "border",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`validateTransitionToken`, () => {
	expect(
		validateTransitionToken({
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
		validateTransitionToken({
			$type: "transition",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`validateShadowToken`, () => {
	expect(
		validateShadowToken({
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
		validateShadowToken({
			$type: "shadow",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`validateGradientToken`, () => {
	expect(
		validateGradientToken({
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
		validateGradientToken({
			$type: "gradient",
			$value: 42,
		} as any),
	).toThrowError();
});

it(`validateTypographyToken`, () => {
	expect(
		validateTypographyToken({
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
		validateTypographyToken({
			$type: "typography",
			$value: 42,
		} as any),
	).toThrowError();
});
