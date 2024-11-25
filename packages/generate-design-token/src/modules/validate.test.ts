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
	const dimensionValidator = (token: TokenGroup) => {
		return validate(token, {
			dimension: {
				is: isDimensionToken,
				validate: validateDimensionToken,
			},
		});
	};

	expect(() => {
		dimensionValidator({
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
		dimensionValidator({
			border: {
				$type: "dimension",
				$value: "10vw",
			},
		});
	}).toThrowError();
	expect(() => {
		dimensionValidator({
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
		dimensionValidator({
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
	const colorValidator = (token: TokenGroup) => {
		return validate(token, {
			color: {
				is: isColorToken,
				validate: validateColorToken,
			},
		});
	};
	expect(
		() => () =>
			colorValidator({
				color: {
					$type: "color",
					$value: "#ff0000",
				},
			}),
	).not.toThrowError();
	expect(() =>
		colorValidator({
			color: {
				$type: "color",
				$value: "ff0000",
			},
		}),
	).toThrowError();
});

it(`validateFontFamilyToken`, () => {
	const fontFamilyValidator = (token: TokenGroup) => {
		return validate(token, {
			fontFamily: {
				is: isFontFamilyToken,
				validate: validateFontFamilyToken,
			},
		});
	};
	expect(() =>
		fontFamilyValidator({
			fontFamily: {
				$type: "fontFamily",
				$value: "Arial",
			},
		}),
	).not.toThrowError();
	expect(() =>
		fontFamilyValidator({
			fontFamily: {
				$type: "fontFamily",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateFontWeightToken`, () => {
	const fontWeightValidator = (token: TokenGroup) => {
		return validate(token, {
			fontWeight: {
				is: isFontWeightToken,
				validate: validateFontWeightToken,
			},
		});
	};
	expect(() =>
		fontWeightValidator({
			fontWeight: {
				$type: "fontWeight",
				$value: "bold",
			},
		}),
	).not.toThrowError();
	expect(() =>
		fontWeightValidator({
			fontWeight: {
				$type: "fontWeight",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateDurationToken`, () => {
	const durationValidator = (token: TokenGroup) => {
		return validate(token, {
			duration: {
				is: isDurationToken,
				validate: validateDurationToken,
			},
		});
	};
	expect(() =>
		durationValidator({
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
		durationValidator({
			duration: {
				$type: "duration",
				$value: 1000,
			},
		}),
	).toThrowError();
});

it(`validateCubicBezierToken`, () => {
	const cubicBezierValidator = (token: TokenGroup) => {
		return validate(token, {
			cubicBezier: {
				is: isCubicBezierToken,
				validate: validateCubicBezierToken,
			},
		});
	};
	expect(() =>
		cubicBezierValidator({
			cubicBezier: {
				$type: "cubicBezier",
				$value: [1, 1, 1, 1],
			},
		}),
	).not.toThrowError();
	expect(() =>
		cubicBezierValidator({
			cubicBezier: {
				$type: "cubicBezier",
				$value: 1000,
			},
		}),
	).toThrowError();
});

it(`validateNumberToken`, () => {
	const numberValidator = (token: TokenGroup) => {
		return validate(token, {
			number: {
				is: isNumberToken,
				validate: validateNumberToken,
			},
		});
	};
	expect(() =>
		numberValidator({
			number: {
				$type: "number",
				$value: 10,
			},
		}),
	).not.toThrowError();
	expect(() =>
		numberValidator({
			number: {
				$type: "number",
				$value: "10",
			},
		}),
	).toThrowError();
});

it(`validateStringToken`, () => {
	const stringValidator = (token: TokenGroup) => {
		return validate(token, {
			string: {
				is: isStringToken,
				validate: validateStringToken,
			},
		});
	};
	expect(() =>
		stringValidator({
			string: {
				$type: "string",
				$value: "Hello, World!",
			},
		}),
	).not.toThrowError();
	expect(() =>
		stringValidator({
			string: {
				$type: "string",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateCompositeToken`, () => {
	const compositeValidator = (token: TokenGroup) => {
		return validate(token, {
			composite: {
				is: isCompositeToken,
				validate: validateCompositeToken,
			},
		});
	};
	expect(() =>
		compositeValidator({
			composite: {
				$type: "composite",
				$value: {
					"aa.bb.cc": 43,
				},
			},
		}),
	).not.toThrowError();
	expect(() =>
		compositeValidator({
			composite: {
				$type: "composite",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateStrokeStyleToken`, () => {
	const strokeStyleValidator = (token: TokenGroup) => {
		return validate(token, {
			strokeStyle: {
				is: isStrokeStyleToken,
				validate: validateStrokeStyleToken,
			},
		});
	};
	expect(() =>
		strokeStyleValidator({
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
		strokeStyleValidator({
			strokeStyle: {
				$type: "strokeStyle",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateBorderToken`, () => {
	const borderValidator = (token: TokenGroup) => {
		return validate(token, {
			border: {
				is: isBorderToken,
				validate: validateBorderToken,
			},
		});
	};
	expect(() =>
		borderValidator({
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
		borderValidator({
			border: {
				$type: "border",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateTransitionToken`, () => {
	const transitionValidator = (token: TokenGroup) => {
		return validate(token, {
			transition: {
				is: isTransitionToken,
				validate: validateTransitionToken,
			},
		});
	};
	expect(() =>
		transitionValidator({
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
		transitionValidator({
			transition: {
				$type: "transition",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateShadowToken`, () => {
	const shadowValidator = (token: TokenGroup) => {
		return validate(token, {
			shadow: {
				is: isShadowToken,
				validate: validateShadowToken,
			},
		});
	};
	expect(() =>
		shadowValidator({
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
		shadowValidator({
			shadow: {
				$type: "shadow",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateGradientToken`, () => {
	const gradientValidator = (token: TokenGroup) => {
		return validate(token, {
			gradient: {
				is: isGradientToken,
				validate: validateGradientToken,
			},
		});
	};
	expect(() =>
		gradientValidator({
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
		gradientValidator({
			gradient: {
				$type: "gradient",
				$value: 42,
			},
		}),
	).toThrowError();
});

it(`validateTypographyToken`, () => {
	const typographyValidator = (token: TokenGroup) => {
		return validate(token, {
			typography: {
				is: isTypographyToken,
				validate: validateTypographyToken,
			},
		});
	};
	expect(() =>
		typographyValidator({
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
		typographyValidator({
			typography: {
				$type: "typography",
				$value: 42,
			},
		}),
	).toThrowError();
});
