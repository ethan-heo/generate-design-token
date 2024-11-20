import * as Types from "@types";

/**
 * 주어진 토큰 객체가 dimension 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 dimension 타입인지 여부
 */
export const dimension = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Dimension => tokenObj.$type === "dimension";

/**
 * 주어진 토큰 객체가 Color 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Color 타입인지 여부
 */
export const color = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Color => tokenObj.$type === "color";

/**
 * 주어진 토큰 객체가 FontFamily 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontFamily 타입인지 여부
 */
export const fontFamily = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.FontFamily => tokenObj.$type === "fontFamily";

/**
 * 주어진 토큰 객체가 FontWeight 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontWeight 타입인지 여부
 */
export const fontWeight = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.FontWeight => tokenObj.$type === "fontWeight";

/**
 * 주어진 토큰 객체가 Duration 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Duration 타입인지 여부
 */
export const duration = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Duration => tokenObj.$type === "duration";

/**
 * 주어진 토큰 객체가 CubicBezier 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 CubicBezier 타입인지 여부
 */
export const cubicBezier = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.CubicBezier => tokenObj.$type === "cubicBezier";

/**
 * 주어진 토큰 객체가 Number 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Number 타입인지 여부
 */
export const number = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Number => tokenObj.$type === "number";

/**
 * 주어진 토큰 객체가 String 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 String 타입인지 여부
 */
export const string = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.String => tokenObj.$type === "string";

/**
 * 주어진 토큰 객체가 Composite 타입인지 확인합니다.
 * Composite 타입은 key-value 형식의 토큰을 포함하는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Composite 타입인지 여부
 */
export const composite = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Composite => tokenObj.$type === "composite";

/**
 * 주어진 토큰 객체가 StrokeStyle 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 StrokeStyle 타입인지 여부
 */
export const strokeStyle = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.StrokeStyle => tokenObj.$type === "strokeStyle";

/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 */
export const border = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Border => tokenObj.$type === "border";

/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 Duration, Delay, TimingFunction 세 가지 속성을 가지는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 */
export const transition = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Transition => tokenObj.$type === "transition";

/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 */
export const shadow = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Shadow => tokenObj.$type === "shadow";

/**
 * 주어진 토큰 객체가 Gradient 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Gradient 타입인지 여부
 */
export const gradient = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Gradient => tokenObj.$type === "gradient";

/**
 * 주어진 토큰 객체가 Typography 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 */
export const typography = (
	tokenObj: Types.TokenObj,
): tokenObj is Types.TokenObjs.Typography => tokenObj.$type === "typography";
