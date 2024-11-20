import * as Types from "@types";
import { hasTokenRef, isTokenRef, TypeCheckers, Validate } from "@utils";

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
	if (!isTokenRef(value)) {
		throwError(`토큰 참조값 이외에 다른 문자열은 사용할 수 없습니다.`);
	}
};

const validateDimensionValue = (
	value: Types.TokenObjs.Dimension["$value"],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	const UNITS = ["px", "rem"];

	if (TypeCheckers.isString(value)) {
		if (!UNITS.some((unit) => value.endsWith(unit))) {
			throwError(`value의 단위는 [${UNITS.join(",")}]이어야 핕인.`);
		}
	}

	if (TypeCheckers.isObject(value)) {
		if (!TypeCheckers.isNumber(value.value)) {
			throwError(`value의 값은 number 타입이어야 합니다.`);
		}

		if (!UNITS.includes(value.unit)) {
			throwError(`unit의 값은 [${UNITS.join(",")}]이어야 합니다.`);
		}
	}
};

const validateColorValue = (
	value: Types.TokenObjs.Color["$value"],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	if (!Validate.format.shouldBeOnlyTokenRef(value) && !HEX_REGEXP.test(value)) {
		throwError(
			`색상값은 토큰 참조값 또는 24 BIT RGB 또는 24 + 8 BIT RGBA 형식의 HEX값이어야 합니다.`,
		);
	}
};

const validateFontFamilyValue = (
	value: Types.TokenObjs.FontFamily["$value"],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	if (TypeCheckers.isArray(value)) {
		if (!value.some((v) => !TypeCheckers.isString(v))) {
			throwError(`요소의 값은 string 형식이어야 합니다.`);
		}
	}
};

const validateFontWeightValue = (
	value: Types.TokenObjs.FontWeight["$value"],
	throwError: ReturnType<typeof throwTypeError>,
) => {
	const ACCEPTABLE_FONT_WEIGHT_VALUES: Types.TokenObjs.FontWeight["$value"][] =
		[
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
	value: Exclude<Types.TokenObjs.Duration["$value"], string>,
	throwError: ReturnType<typeof throwTypeError>,
) => {
	const UNITS = ["ms", "s"];

	if (!TypeCheckers.isNumber(value.value)) {
		throwError(`value값은 number 타입이어야 합니다.`);
	}

	if (!UNITS.includes(value.unit)) {
		throwError(`unit의 값은 [${UNITS.join(",")}] 중 하나여야 합니다.`);
	}
};

const validateCubicBezierValue = (
	value: Exclude<Types.TokenObjs.CubicBezier["$value"], string>,
	throwError: ReturnType<typeof throwTypeError>,
) => {
	if (value.some((v) => !TypeCheckers.isNumber(v))) {
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
export const dimension = (tokenObj: Types.TokenObjs.Dimension): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Dimension");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isObject($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value)) {
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
export const color = (tokenObj: Types.TokenObjs.Color): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Color");

	if (!TypeCheckers.isString($value)) {
		throwError(`허용되지 않는 형식입니다.`);
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
export const fontFamily = (tokenObj: Types.TokenObjs.FontFamily): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("FontFamily");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isArray($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value) && hasTokenRef($value)) {
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
export const fontWeight = (tokenObj: Types.TokenObjs.FontWeight): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("FontWeight");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isNumber($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value) && hasTokenRef($value)) {
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
export const duration = (tokenObj: Types.TokenObjs.Duration): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Duration");

	if (!TypeCheckers.isObject($value) && !TypeCheckers.isObject($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value)) {
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
export const cubicBezier = (tokenObj: Types.TokenObjs.CubicBezier): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("CubicBezier");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isArray($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value)) {
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
export const string = (tokenObj: Types.TokenObjs.String): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("String");

	if (!TypeCheckers.isString($value)) {
		throwError(`허용되지 않는 형식입니다.`);
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
export const number = (tokenObj: Types.TokenObjs.Number): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Number");

	if (TypeCheckers.isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		if (!TypeCheckers.isNumber($value)) {
			throwError(`허용되지 않는 형식입니다.`);
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
export const composite = (tokenObj: Types.TokenObjs.Composite): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Composite");

	if (!TypeCheckers.isObject($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	return true;
};

/**
 * StrokeStyle의 유효성을 확인합니다.
 * @param tokenObj - StrokeStyle TokenObj
 * @returns StrokeStyle TokenObj의 유효성 여부
 * @throws "StrokeStyle"에 대한 에러 메시지를 throw합니다.
 */
export const strokeStyle = (tokenObj: Types.TokenObjs.StrokeStyle): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("StrokeStyle");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isObject($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value)) {
		const ACCEPTABLE_VALUE: Types.TokenObjs.StrokeStyle["$value"][] = [
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

	if (TypeCheckers.isObject($value)) {
		const REQUIRED_PROPS = ["dashArray", "lineCap"];

		shouldHaveRequiredProps($value, REQUIRED_PROPS, throwError);
		notAllowedProps($value, REQUIRED_PROPS, throwError);

		if (TypeCheckers.isArray($value.dashArray)) {
			for (const value of $value.dashArray) {
				if (TypeCheckers.isObject(value)) {
					validateDimensionValue(value, throwError);
				} else {
					if (!TypeCheckers.isString(value)) {
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

		if (TypeCheckers.isString($value.lineCap)) {
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
export const border = (tokenObj: Types.TokenObjs.Border): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Border");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isObject($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		const ACCEPTABLE_PROPS = ["width", "style", "color"];

		shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
		notAllowedProps($value, ACCEPTABLE_PROPS, throwError);

		if (TypeCheckers.isObject($value.width)) {
			validateDimensionValue($value.width, throwError);
		} else {
			if (!TypeCheckers.isString($value.width)) {
				throwError(`width는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.width, throwError);
			}
		}

		if (!TypeCheckers.isString($value.style)) {
			throwError(`style는 문자열 형식이어야 합니다.`);
		} else {
			if (hasTokenRef($value.style)) {
				validateTokenRefValue($value.style, throwError);
			}
		}

		if (!TypeCheckers.isString($value.color)) {
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
export const transition = (tokenObj: Types.TokenObjs.Transition): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Transition");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isObject($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		const ACCEPTABLE_PROPS = ["duration", "timingFunction", "delay"];

		shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
		notAllowedProps($value, ACCEPTABLE_PROPS, throwError);

		if (TypeCheckers.isObject($value.duration)) {
			validateDurationValue($value.duration, throwError);
		} else {
			if (!TypeCheckers.isString($value.duration)) {
				throwError(`duration는 Duration 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.duration, throwError);
			}
		}

		if (TypeCheckers.isObject($value.delay)) {
			validateDurationValue($value.delay, throwError);
		} else {
			if (!TypeCheckers.isString($value.delay)) {
				throwError(`delay는 Duration 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.delay, throwError);
			}
		}

		if (TypeCheckers.isArray($value.timingFunction)) {
			validateCubicBezierValue($value.timingFunction as any, throwError);
		} else {
			if (!TypeCheckers.isString($value.timingFunction)) {
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
export const shadow = (tokenObj: Types.TokenObjs.Shadow): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Shadow");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isObject($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		const ACCEPTABLE_PROPS = ["offsetX", "offsetY", "blur", "spread", "color"];

		shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
		notAllowedProps($value, ACCEPTABLE_PROPS, throwError);

		if (TypeCheckers.isObject($value.offsetX)) {
			validateDimensionValue($value.offsetX, throwError);
		} else {
			if (!TypeCheckers.isString($value.offsetX)) {
				throwError(`offsetX는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.offsetX, throwError);
			}
		}

		if (TypeCheckers.isObject($value.offsetY)) {
			validateDimensionValue($value.offsetY, throwError);
		} else {
			if (!TypeCheckers.isString($value.offsetY)) {
				throwError(`offsetY는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.offsetY, throwError);
			}
		}

		if (TypeCheckers.isObject($value.blur)) {
			validateDimensionValue($value.blur, throwError);
		} else {
			if (!TypeCheckers.isString($value.blur)) {
				throwError(`blur는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.blur, throwError);
			}
		}

		if (TypeCheckers.isObject($value.spread)) {
			validateDimensionValue($value.spread, throwError);
		} else {
			if (!TypeCheckers.isString($value.spread)) {
				throwError(`spread는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.spread, throwError);
			}
		}

		if (!TypeCheckers.isString($value.color)) {
			validateColorValue($value.color, throwError);
		} else {
			if (!TypeCheckers.isString($value.color)) {
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
export const gradient = (tokenObj: Types.TokenObjs.Gradient): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Gradient");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isArray($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value)) {
		validateTokenRefValue($value, throwError);
	} else {
		for (const value of $value) {
			if (!TypeCheckers.isObject(value)) {
				throwError(`허용되지 않는 형식입니다.`);
			}

			const ACCEPTABLE_PROPS = ["color", "position"];

			shouldHaveRequiredProps(value, ACCEPTABLE_PROPS, throwError);
			notAllowedProps(value, ACCEPTABLE_PROPS, throwError);

			if (TypeCheckers.isString(value.color)) {
				validateColorValue(value.color, throwError);

				if (hasTokenRef(value.color)) {
					validateTokenRefValue(value.color, throwError);
				}
			} else {
				throwError(`color는 Color 또는 문자열 형식이어야 합니다.`);
			}

			if (!TypeCheckers.isNumber(value.position)) {
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
export const typography = (tokenObj: Types.TokenObjs.Typography): true => {
	const { $value } = tokenObj;
	const throwError = throwTypeError("Typography");

	if (!TypeCheckers.isString($value) && !TypeCheckers.isObject($value)) {
		throwError(`허용되지 않는 형식입니다.`);
	}

	if (TypeCheckers.isString($value)) {
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

		if (!TypeCheckers.isString($value.fontFamily)) {
			validateFontFamilyValue($value.fontFamily, throwError);
		} else {
			if (hasTokenRef($value.fontFamily)) {
				validateTokenRefValue($value.fontFamily, throwError);
			}
		}

		if (!TypeCheckers.isString($value.fontWeight)) {
			validateFontWeightValue($value.fontWeight, throwError);
		} else {
			if (hasTokenRef($value.fontWeight)) {
				validateTokenRefValue($value.fontWeight, throwError);
			}
		}

		if (TypeCheckers.isObject($value.fontSize)) {
			validateDimensionValue($value.fontSize, throwError);
		} else {
			if (!TypeCheckers.isString($value.fontSize)) {
				throwError(`fontSize는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.fontSize, throwError);
			}
		}

		if (!TypeCheckers.isNumber($value.lineHeight)) {
			throwError(`lineHeight는 number 형식이어야 합니다.`);
		} else {
			if (TypeCheckers.isString($value.lineHeight)) {
				validateTokenRefValue($value.lineHeight, throwError);
			}
		}

		if (TypeCheckers.isObject($value.letterSpacing)) {
			validateDimensionValue($value.letterSpacing, throwError);
		} else {
			if (!TypeCheckers.isString($value.letterSpacing)) {
				throwError(`fontSize는 Dimension 또는 문자열 형식이어야 합니다.`);
			} else {
				validateTokenRefValue($value.letterSpacing, throwError);
			}
		}
	}

	return true;
};
