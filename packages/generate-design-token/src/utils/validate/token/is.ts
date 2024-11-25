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
	TokenObj,
	Transition,
	Typography,
} from "../../../types/token.types";

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
