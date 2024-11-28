import { TokenGroup, TokenObj, TokenTypes } from "../types/token.types";
import { isTokenObj } from "../utils/token-obj";
import Token from "./token";
import { shouldNotHaveDollarPrefix } from "../utils/validate/format";
import { toTokenRef } from "../utils/token-ref";
import {
	Border,
	Color,
	Composite,
	CubicBezier,
	Dimension,
	Duration,
	FontFamily,
	FontWeight,
	Gradient,
	Number,
	Shadow,
	String,
	StrokeStyle,
	Transition,
	Typography,
} from "../types/token.types";
import { hasTokenRef, isTokenRef } from "../utils/token-ref";
import { isArray, isNumber, isObject, isString } from "../utils/type-checker";
import { shouldBeOnlyTokenRef } from "../utils/validate/format";

/**
 * 주어진 토큰 객체가 dimension 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 dimension 타입인지 여부
 */
export const isDimensionToken = (tokenObj: TokenObj): tokenObj is Dimension =>
	tokenObj.$type === "dimension";

/**
 * 주어진 토큰 객체가 Color 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Color 타입인지 여부
 */
export const isColorToken = (tokenObj: TokenObj): tokenObj is Color =>
	tokenObj.$type === "color";

/**
 * 주어진 토큰 객체가 FontFamily 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontFamily 타입인지 여부
 */
export const isFontFamilyToken = (tokenObj: TokenObj): tokenObj is FontFamily =>
	tokenObj.$type === "fontFamily";

/**
 * 주어진 토큰 객체가 FontWeight 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontWeight 타입인지 여부
 */
export const isFontWeightToken = (tokenObj: TokenObj): tokenObj is FontWeight =>
	tokenObj.$type === "fontWeight";

/**
 * 주어진 토큰 객체가 Duration 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Duration 타입인지 여부
 */
export const isDurationToken = (tokenObj: TokenObj): tokenObj is Duration =>
	tokenObj.$type === "duration";

/**
 * 주어진 토큰 객체가 CubicBezier 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 CubicBezier 타입인지 여부
 */
export const isCubicBezierToken = (
	tokenObj: TokenObj,
): tokenObj is CubicBezier => tokenObj.$type === "cubicBezier";

/**
 * 주어진 토큰 객체가 Number 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Number 타입인지 여부
 */
export const isNumberToken = (tokenObj: TokenObj): tokenObj is Number =>
	tokenObj.$type === "number";

/**
 * 주어진 토큰 객체가 String 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 String 타입인지 여부
 */
export const isStringToken = (tokenObj: TokenObj): tokenObj is String =>
	tokenObj.$type === "string";

/**
 * 주어진 토큰 객체가 Composite 타입인지 확인합니다.
 * Composite 타입은 key-value 형식의 토큰을 포함하는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Composite 타입인지 여부
 */
export const isCompositeToken = (tokenObj: TokenObj): tokenObj is Composite =>
	tokenObj.$type === "composite";

/**
 * 주어진 토큰 객체가 StrokeStyle 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 StrokeStyle 타입인지 여부
 */
export const isStrokeStyleToken = (
	tokenObj: TokenObj,
): tokenObj is StrokeStyle => tokenObj.$type === "strokeStyle";

/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 */
export const isBorderToken = (tokenObj: TokenObj): tokenObj is Border =>
	tokenObj.$type === "border";

/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 Duration, Delay, TimingFunction 세 가지 속성을 가지는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 */
export const isTransitionToken = (tokenObj: TokenObj): tokenObj is Transition =>
	tokenObj.$type === "transition";

/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 */
export const isShadowToken = (tokenObj: TokenObj): tokenObj is Shadow =>
	tokenObj.$type === "shadow";

/**
 * 주어진 토큰 객체가 Gradient 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Gradient 타입인지 여부
 */
export const isGradientToken = (tokenObj: TokenObj): tokenObj is Gradient =>
	tokenObj.$type === "gradient";

/**
 * 주어진 토큰 객체가 Typography 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 */
export const isTypographyToken = (tokenObj: TokenObj): tokenObj is Typography =>
	tokenObj.$type === "typography";

const HEX_REGEXP = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

const throwTypeError = (prefix: string) => (msg: string) => {
	throw new TypeError(`[${prefix}] ${msg}`);
};

const shouldHaveRequiredProps = (
	value: object,
	required: string[],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	const props = Object.keys(value);

	if (!required.every((v) => props.includes(v))) {
		throwError(`${required.join(",")}은 필수 속성입니다.`);
	}
};

const notAllowedProps = (
	value: object,
	required: string[],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	const props = Object.keys(value);

	if (!props.every((v) => required.includes(v))) {
		throwError(`${required.join(",")} 속성 외 사용된 속성이 있습니다.`);
	}
};

const validateTokenRefValue = (
	value: string,
	throwError: ReturnType<typeof throwTypeError>,
) => {
	if (value.includes("{$value}")) {
		return;
	}

	if (!isTokenRef(value)) {
		throwError(`토큰 참조값 이외에 다른 문자열은 사용할 수 없습니다. ${value}`);
	}
};

const validateDimensionValue = (
	value: Dimension["$value"],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	const UNITS = ["px", "rem"];

	if (isString(value)) {
		if (!UNITS.some((unit) => value.endsWith(unit))) {
			throwError(`value의 단위는 [${UNITS.join(",")}]이어야 합니다.`);
		}
	}

	if (isObject(value)) {
		if (!isNumber(value.value)) {
			throwError(`value의 값은 number 타입이어야 합니다.`);
		}

		if (!UNITS.includes(value.unit)) {
			throwError(`unit의 값은 [${UNITS.join(",")}]이어야 합니다.`);
		}
	}
};

const validateColorValue = (
	value: Color["$value"],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	if (!shouldBeOnlyTokenRef(value) && !HEX_REGEXP.test(value)) {
		throwError(
			`색상값은 토큰 참조값 또는 24 BIT RGB 또는 24 + 8 BIT RGBA 형식의 HEX값이어야 합니다.`,
		);
	}
};

const validateFontFamilyValue = (
	value: FontFamily["$value"],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	if (isArray(value)) {
		if (!value.some((v) => !isString(v))) {
			throwError(`요소의 값은 string 형식이어야 합니다.`);
		}
	}
};

const validateFontWeightValue = (
	value: FontWeight["$value"],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	const ACCEPTABLE_FONT_WEIGHT_VALUES: FontWeight["$value"][] = [
		100,
		200,
		300,
		400,
		500,
		600,
		700,
		800,
		900,
		1000,
		"thin",
		"hairline",
		"extra-light",
		"ultra-light",
		"light",
		"normal",
		"regular",
		"book",
		"medium",
		"semi-bold",
		"demi-bold",
		"bold",
		"extra-bold",
		"ultra-bold",
		"black",
		"heavy",
		"extra-black",
		"ultra-black",
	];

	if (!ACCEPTABLE_FONT_WEIGHT_VALUES.includes(value)) {
		throwError(
			`$value 값은 [${ACCEPTABLE_FONT_WEIGHT_VALUES.join(",")}] 중 하나여야 합니다.`,
		);
	}
};

const validateDurationValue = (
	value: Exclude<Duration["$value"], string>,
	throwError: ReturnType<typeof throwTypeError>,
) => {
	const UNITS = ["ms", "s"];

	if (!isNumber(value.value)) {
		throwError(`value값은 number 타입이어야 합니다.`);
	}

	if (!UNITS.includes(value.unit)) {
		throwError(`unit의 값은 [${UNITS.join(",")}] 중 하나여야 합니다.`);
	}
};

const validateCubicBezierValue = (
	value: Exclude<CubicBezier["$value"], string>,
	throwError: ReturnType<typeof throwTypeError>,
) => {
	if (value.some((v) => !isNumber(v))) {
		throwError(`요소의 값은 number 형식이어야 합니다.`);
	}

	if (value.length !== 4) {
		throwError(`value의 길이는 4개이어야 합니다.`);
	}
};

/**
 * Dimension의 유효성을 확인합니다.
 * @param tokenObj - Dimension TokenObj
 * @returns Dimension TokenObj의 유효성 여부
 * @throws "Dimension"에 대한 에러 메시지를 throw합니다.
 */
export const validateDimensionToken = (tokenObj: Dimension): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Dimension");

	if (!isString($value) && !isObject($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value)) {
		if (hasTokenRef($value)) {
			validateTokenRefValue($value, throwError);
		} else {
			validateDimensionValue($value, throwError);
		}
	} else {
		validateDimensionValue($value, throwError);
	}

	return true;
};

/**
 * Color의 유효성을 확인합니다.
 * @param tokenObj - Color TokenObj
 * @returns Color TokenObj의 유효성 여부
 * @throws "Color"에 대한 에러 메시지를 throw합니다.
 */
export const validateColorToken = (tokenObj: Color): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Color");

	if (!isString($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (hasTokenRef($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		validateColorValue($value, throwError);
	}

	return true;
};

/**
 * FontFamily의 유효성을 확인합니다.
 * @param tokenObj - FontFamily TokenObj
 * @returns FontFamily TokenObj의 유효성 여부
 * @throws "FontFamily"에 대한 에러 메시지를 throw합니다.
 */
export const validateFontFamilyToken = (tokenObj: FontFamily): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("FontFamily");

	if (!isString($value) && !isArray($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value) && hasTokenRef($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		validateFontFamilyValue($value, throwError);
	}

	return true;
};

/**
 * FontWeight의 유효성을 확인합니다.
 * @param tokenObj - FontWeight TokenObj
 * @returns FontWeight TokenObj의 유효성 여부
 * @throws "FontWeight"에 대한 에러 메시지를 throw합니다.
 */
export const validateFontWeightToken = (tokenObj: FontWeight): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("FontWeight");

	if (!isString($value) && !isNumber($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value) && hasTokenRef($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		validateFontWeightValue($value, throwError);
	}

	return true;
};

/**
 * Duration의 유효성을 확인합니다.
 * @param tokenObj - Duration TokenObj
 * @returns Duration TokenObj의 유효성 여부
 * @throws "Duration"에 대한 에러 메시지를 throw합니다.
 */
export const validateDurationToken = (tokenObj: Duration): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Duration");

	if (!isObject($value) && !isObject($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		validateDurationValue($value, throwError);
	}

	return true;
};

/**
 * CubicBezier의 유효성을 확인합니다.
 * @param tokenObj - CubicBezier TokenObj
 * @returns CubicBezier TokenObj의 유효성 여부
 * @throws "CubicBezier"에 대한 에러 메시지를 throw합니다.
 */
export const validateCubicBezierToken = (tokenObj: CubicBezier): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("CubicBezier");

	if (!isString($value) && !isArray($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value)) {
		if (hasTokenRef($value)) {
			validateTokenRefValue($value, throwError);
		}
	} else {
		validateCubicBezierValue($value, throwError);
	}

	return true;
};

/**
 * String의 유효성을 확인합니다.
 * @param tokenObj - String TokenObj
 * @returns String TokenObj의 유효성 여부
 * @throws "String"에 대한 에러 메시지를 throw합니다.
 */
export const validateStringToken = (tokenObj: String): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("String");

	if (!isString($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (hasTokenRef($value)) {
		validateTokenRefValue($value, throwError);
	}

	return true;
};

/**
 * Number의 유효성을 확인합니다.
 * @param tokenObj - Number TokenObj
 * @returns Number TokenObj의 유효성 여부
 * @throws "Number"에 대한 에러 메시지를 throw합니다.
 */
export const validateNumberToken = (tokenObj: Number): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Number");

	if (isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		if (!isNumber($value)) {
			throwError(
				`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
			);
		}
	}

	return true;
};

/**
 * Composite의 유효성을 확인합니다.
 * @param tokenObj - Composite TokenObj
 * @returns Composite TokenObj의 유효성 여부
 * @throws "Composite"에 대한 에러 메시지를 throw합니다.
 */
export const validateCompositeToken = (tokenObj: Composite): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Composite");

	if (!isObject($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	return true;
};

/**
 * StrokeStyle의 유효성을 확인합니다.
 * @param tokenObj - StrokeStyle TokenObj
 * @returns StrokeStyle TokenObj의 유효성 여부
 * @throws "StrokeStyle"에 대한 에러 메시지를 throw합니다.
 */
export const validateStrokeStyleToken = (tokenObj: StrokeStyle): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("StrokeStyle");

	if (!isString($value) && !isObject($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value)) {
		const ACCEPTABLE_VALUE: StrokeStyle["$value"][] = [
			"solid",
			"dashed",
			"dotted",
			"double",
			"groove",
			"ridge",
			"outset",
			"inset",
		];
		if (!ACCEPTABLE_VALUE.includes($value)) {
			throwError(
				`$value 값은 [${ACCEPTABLE_VALUE.join(",")}] 중 하나여야 합니다.`,
			);
		}

		if (hasTokenRef($value)) {
			validateTokenRefValue($value, throwError);
		}
	}

	if (isObject($value)) {
		const REQUIRED_PROPS = ["dashArray", "lineCap"];

		shouldHaveRequiredProps($value, REQUIRED_PROPS, throwError);
		notAllowedProps($value, REQUIRED_PROPS, throwError);

		if (isArray($value.dashArray)) {
			for (const value of $value.dashArray) {
				if (isObject(value)) {
					validateDimensionValue(value, throwError);
				} else {
					if (!isString(value)) {
						throwError(
							`dashArray 요소는 Dimension 또는 문자열 형식이어야 합니다.`,
						);
					} else {
						validateTokenRefValue(value, throwError);
					}
				}
			}
		} else {
			throwError(`dashArray는 배열 타입이어야 합니다.`);
		}

		if (isString($value.lineCap)) {
			const ACCEPTABLE_VALUE = ["butt", "round", "square"];

			if (!ACCEPTABLE_VALUE.includes($value.lineCap)) {
				throwError(
					`lineCap 값은 [${ACCEPTABLE_VALUE.join(",")}] 중 하나여야 합니다.`,
				);
			}
		}
	}
	return true;
};

/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * Border 타입은 'width', 'style', 'color' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 * @throws "Border"에 대한 에러 메시지를 throw합니다.
 */
export const validateBorderToken = (tokenObj: Border): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Border");

	if (!isString($value) && !isObject($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		const ACCEPTABLE_PROPS = ["width", "style", "color"];

		shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
		notAllowedProps($value, ACCEPTABLE_PROPS, throwError);

		if (isObject($value.width)) {
			validateDimensionValue($value.width, throwError);
		} else {
			if (!isString($value.width)) {
				throwError(`width는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.width, throwError);
			}
		}

		if (!isString($value.style)) {
			throwError(`style는 문자열 형식이어야 합니다.`);
		} else {
			if (hasTokenRef($value.style)) {
				validateTokenRefValue($value.style, throwError);
			}
		}

		if (!isString($value.color)) {
			throwError(`color는 문자열 형식이어야 합니다.`);
		} else {
			if (hasTokenRef($value.color)) {
				validateTokenRefValue($value.color, throwError);
			}
		}
	}

	return true;
};

/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 'duration', 'timingFunction', 'delay' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 * @throws "Transition"에 대한 에러 메시지를 throw합니다.
 */
export const validateTransitionToken = (tokenObj: Transition): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Transition");

	if (!isString($value) && !isObject($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		const ACCEPTABLE_PROPS = ["duration", "timingFunction", "delay"];

		shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
		notAllowedProps($value, ACCEPTABLE_PROPS, throwError);

		if (isObject($value.duration)) {
			validateDurationValue($value.duration, throwError);
		} else {
			if (!isString($value.duration)) {
				throwError(`duration는 Duration 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.duration, throwError);
			}
		}

		if (isObject($value.delay)) {
			validateDurationValue($value.delay, throwError);
		} else {
			if (!isString($value.delay)) {
				throwError(`delay는 Duration 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.delay, throwError);
			}
		}

		if (isArray($value.timingFunction)) {
			validateCubicBezierValue($value.timingFunction as any, throwError);
		} else {
			if (!isString($value.timingFunction)) {
				throwError(
					`timingFunction는 CubicBezier 또는 문자열 형식이어야 합니다.`,
				);
			} else {
				validateTokenRefValue($value.timingFunction, throwError);
			}
		}
	}
	return true;
};

/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * Shadow 타입은 'offsetX', 'offsetY', 'blur', 'spread', 'color' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 * @throws "Shadow"에 대한 에러 메시지를 throw합니다.
 */
export const validateShadowToken = (tokenObj: Shadow): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Shadow");

	if (!isString($value) && !isObject($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		const ACCEPTABLE_PROPS = ["offsetX", "offsetY", "blur", "spread", "color"];

		shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
		notAllowedProps($value, ACCEPTABLE_PROPS, throwError);

		if (isObject($value.offsetX)) {
			validateDimensionValue($value.offsetX, throwError);
		} else {
			if (!isString($value.offsetX)) {
				throwError(`offsetX는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.offsetX, throwError);
			}
		}

		if (isObject($value.offsetY)) {
			validateDimensionValue($value.offsetY, throwError);
		} else {
			if (!isString($value.offsetY)) {
				throwError(`offsetY는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.offsetY, throwError);
			}
		}

		if (isObject($value.blur)) {
			validateDimensionValue($value.blur, throwError);
		} else {
			if (!isString($value.blur)) {
				throwError(`blur는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.blur, throwError);
			}
		}

		if (isObject($value.spread)) {
			validateDimensionValue($value.spread, throwError);
		} else {
			if (!isString($value.spread)) {
				throwError(`spread는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.spread, throwError);
			}
		}

		if (!isString($value.color)) {
			validateColorValue($value.color, throwError);
		} else {
			if (!isString($value.color)) {
				throwError(`color는 Color 또는 문자열 형식이어야 합니다.`);
			} else {
				if (hasTokenRef($value.color)) {
					validateTokenRefValue($value.color, throwError);
				}
			}
		}
	}

	return true;
};

/**
 * 주어진 토큰 객체가 Gradient 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Gradient 타입인지 여부
 * @example
 * {
 *   $type: "gradient",
 *   $value: [
 *     {
 *       color: "#ff0000",
 *       position: 0,
 *     },
 *     {
 *       color: "#00ff00",
 *       position: 100,
 *     },
 *   ],
 * }
 */
export const validateGradientToken = (tokenObj: Gradient): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Gradient");

	if (!isString($value) && !isArray($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		for (const value of $value) {
			if (!isObject(value)) {
				throwError(
					`허용되지 않는 형식입니다. ${JSON.stringify(value, null, 2)}`,
				);
			}

			const ACCEPTABLE_PROPS = ["color", "position"];

			shouldHaveRequiredProps(value, ACCEPTABLE_PROPS, throwError);
			notAllowedProps(value, ACCEPTABLE_PROPS, throwError);

			if (isString(value.color)) {
				validateColorValue(value.color, throwError);

				if (hasTokenRef(value.color)) {
					validateTokenRefValue(value.color, throwError);
				}
			} else {
				throwError(`color는 Color 또는 문자열 형식이어야 합니다.`);
			}

			if (!isNumber(value.position)) {
				throwError(`position는 number 형식이어야 합니다.`);
			}
		}
	}

	return true;
};

/**
 * Typography 타입의 토큰을 확인합니다.
 * Typography 타입은 "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing" 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 * @throws "Typography"에 대한 에러 메시지를 throw합니다.
 */
export const validateTypographyToken = (tokenObj: Typography): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Typography");

	if (!isString($value) && !isObject($value)) {
		throwError(
			`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`,
		);
	}

	if (isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		const ACCEPTABLE_PROPS = [
			"fontFamily",
			"fontSize",
			"fontWeight",
			"lineHeight",
			"letterSpacing",
		];

		shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
		notAllowedProps($value, ACCEPTABLE_PROPS, throwError);

		if (!isString($value.fontFamily)) {
			validateFontFamilyValue($value.fontFamily, throwError);
		} else {
			if (hasTokenRef($value.fontFamily)) {
				validateTokenRefValue($value.fontFamily, throwError);
			}
		}

		if (!isString($value.fontWeight)) {
			validateFontWeightValue($value.fontWeight, throwError);
		} else {
			if (hasTokenRef($value.fontWeight)) {
				validateTokenRefValue($value.fontWeight, throwError);
			}
		}

		if (isObject($value.fontSize)) {
			validateDimensionValue($value.fontSize, throwError);
		} else {
			if (!isString($value.fontSize)) {
				throwError(`fontSize는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.fontSize, throwError);
			}
		}

		if (!isNumber($value.lineHeight)) {
			throwError(`lineHeight는 number 형식이어야 합니다.`);
		} else {
			if (isString($value.lineHeight)) {
				validateTokenRefValue($value.lineHeight, throwError);
			}
		}

		if (isObject($value.letterSpacing)) {
			validateDimensionValue($value.letterSpacing, throwError);
		} else {
			if (!isString($value.letterSpacing)) {
				throwError(`fontSize는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.letterSpacing, throwError);
			}
		}
	}

	return true;
};

type Validator<T extends string> = {
	[key in T]: {
		is: (token: TokenObj) => token is TokenObj & { $type: key };
		validate: <P extends TokenObj & { $type: key }>(token: P) => true;
	};
};

const defaultValidators: Validator<TokenTypes> = {
	shadow: {
		is: isShadowToken,
		validate: validateShadowToken,
	},
	gradient: {
		is: isGradientToken,
		validate: validateGradientToken,
	},
	typography: {
		is: isTypographyToken,
		validate: validateTypographyToken,
	},
	color: {
		is: isColorToken,
		validate: validateColorToken,
	},
	string: {
		is: isStringToken,
		validate: validateStringToken,
	},
	number: {
		is: isNumberToken,
		validate: validateNumberToken,
	},
	duration: {
		is: isDurationToken,
		validate: validateDurationToken,
	},
	cubicBezier: {
		is: isCubicBezierToken,
		validate: validateCubicBezierToken,
	},
	border: {
		is: isBorderToken,
		validate: validateBorderToken,
	},
	composite: {
		is: isCompositeToken,
		validate: validateCompositeToken,
	},
	strokeStyle: {
		is: isStrokeStyleToken,
		validate: validateStrokeStyleToken,
	},
	transition: {
		is: isTransitionToken,
		validate: validateTransitionToken,
	},
	fontFamily: {
		is: isFontFamilyToken,
		validate: validateFontFamilyToken,
	},
	fontWeight: {
		is: isFontWeightToken,
		validate: validateFontWeightToken,
	},
	dimension: {
		is: isDimensionToken,
		validate: validateDimensionToken,
	},
};

export const validate = (token: Token | TokenGroup) => {
	const validators = defaultValidators;
	let _token = token;

	if (!(_token instanceof Token)) {
		_token = new Token(_token);
	}

	_token.forEach((props, token) => {
		if (isObject(token) && isTokenObj(token)) {
			if (shouldNotHaveDollarPrefix(token)) {
				throw new Error(
					`토큰 객체의 속성값의 이름은 $가 prefix로 시작해야합니다. ${toTokenRef(props)}`,
				);
			}

			const validator = validators[token.$type];

			if (validator && validator.is(token)) {
				// TODO validate를 찾을 수 없는 에러 해결 필요
				(validator as any).validate(token);
			}
		}
	});
};
