import { expect, it } from "vitest";
import {
	isBorderToken,
	isColorToken,
	isCompositeToken,
	isCubicBezierToken,
	isDimensionToken,
	isDurationToken,
	isFontFamilyToken,
	isFontWeightToken,
	isGradientToken,
	isNumberToken,
	isShadowToken,
	isStringToken,
	isStrokeStyleToken,
	isTransitionToken,
	isTypographyToken,
	validate,
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
import { TokenGroup } from "../types/token.types";

it(`토큰 객체의 속성명은 모두 $가 prefix로 사용되어야 합니다.`, () => {
	const actual = {
		color: {
			primary: {
				type: "color",
				$value: "#ff0000",
			},
		},
	};

	expect(() => {
		validate(actual);
	}).toThrowError();
});

it(`validateDimensionToken`, () => {
	expect(() => {
		validate({
			border: {
				$type: "dimension",
				$value: {
					value: 10,
					unit: "px",
				},
			},
		});
	}).not.toThrowError();
	expect(() => {
		validate({
			border: {
				$type: "dimension",
				$value: "10vw",
			},
		});
	}).toThrowError();
	expect(() => {
		validate({
			border: {
				$type: "dimension",
				$value: {
					value: 10,
					unit: "vw",
				},
			},
		});
	}).toThrowError();
	expect(() => {
		validate({
			border: {
				$type: "dimension",
				$value: {
					value: "10",
					unit: "rem",
				},
			},
		});
	}).toThrowError();
});

it(`validateColorToken`, () => {
	expect(
		() => () =>
			validate({
				color: {
					$type: "color",
					$value: "#ff0000",
				},
			}),
	).not.toThrowError();
	expect(() =>
		validate({
			color: {
				$type: "color",
				$value: "ff0000",
			},
		}),
	).toThrowError();
});

it(`validateFontFamilyToken`, () => {
	expect(() =>
		validate({
			fontFamily: {
				$type: "fontFamily",
				$value: "Arial",
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			fontFamily: {
				$type: "fontFamily",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateFontWeightToken`, () => {
	expect(() =>
		validate({
			fontWeight: {
				$type: "fontWeight",
				$value: "bold",
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			fontWeight: {
				$type: "fontWeight",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateDurationToken`, () => {
	expect(() =>
		validate({
			duration: {
				$type: "duration",
				$value: {
					value: 1000,
					unit: "ms",
				},
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			duration: {
				$type: "duration",
				$value: 1000,
			},
		}),
	).toThrowError();
});

it(`validateCubicBezierToken`, () => {
	expect(() =>
		validate({
			cubicBezier: {
				$type: "cubicBezier",
				$value: [1, 1, 1, 1],
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			cubicBezier: {
				$type: "cubicBezier",
				$value: 1000,
			},
		}),
	).toThrowError();
});

it(`validateNumberToken`, () => {
	expect(() =>
		validate({
			number: {
				$type: "number",
				$value: 10,
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			number: {
				$type: "number",
				$value: "10",
			},
		}),
	).toThrowError();
});

it(`validateStringToken`, () => {
	expect(() =>
		validate({
			string: {
				$type: "string",
				$value: "Hello, World!",
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			string: {
				$type: "string",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateCompositeToken`, () => {
	expect(() =>
		validate({
			composite: {
				$type: "composite",
				$value: {
					"aa.bb.cc": 43,
				},
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			composite: {
				$type: "composite",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateStrokeStyleToken`, () => {
	expect(() =>
		validate({
			strokeStyle: {
				$type: "strokeStyle",
				$value: {
					lineCap: "round",
					dashArray: ["{border-width.1}", "{border-width.2}"],
				},
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			strokeStyle: {
				$type: "strokeStyle",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateBorderToken`, () => {
	expect(() =>
		validate({
			border: {
				$type: "border",
				$value: {
					width: "{border-width.1}",
					style: "solid",
					color: "#ff0000",
				},
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			border: {
				$type: "border",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateTransitionToken`, () => {
	expect(() =>
		validate({
			transition: {
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
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			transition: {
				$type: "transition",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateShadowToken`, () => {
	expect(() =>
		validate({
			shadow: {
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
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			shadow: {
				$type: "shadow",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateGradientToken`, () => {
	expect(() =>
		validate({
			gradient: {
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
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			gradient: {
				$type: "gradient",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateTypographyToken`, () => {
	expect(() =>
		validate({
			typography: {
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
			},
		}),
	).not.toThrowError();
	expect(() =>
		validate({
			typography: {
				$type: "typography",
				$value: 42,
			},
		}),
	).toThrowError();
});
