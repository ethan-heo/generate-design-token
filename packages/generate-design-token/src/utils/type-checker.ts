type Result =
	| "string"
	| "number"
	| "bigint"
	| "boolean"
	| "undefined"
	| "symbol"
	| "null"
	| "object"
	| "array"
	| "function";

/**
 * 주어진 값의 타입을 반환합니다.
 * @param value 타입을 확인할 값
 * @returns 주어진 값의 타입
 */
export const getType = (value: any) => {
	return Object.prototype.toString
		.call(value)
		.slice(8, -1)
		.toLowerCase() as Result;
};

/**
 * 주어진 값이 배열인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 배열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const isArray = (value: unknown): value is [] => {
	return getType(value) === "array";
};

/**
 * 주어진 값이 숫자인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 숫자이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const isNumber = (value: unknown): value is number => {
	return getType(value) === "number";
};

/**
 * 주어진 값이 객체인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 객체이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const isObject = (value: unknown): value is object => {
	return getType(value) === "object";
};

/**
 * 주어진 값이 문자열인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const isString = (value: unknown): value is string => {
	return getType(value) === "string";
};

/**
 * 주어진 값이 undefined인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 undefined이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const isUndefined = (value: unknown): value is undefined => {
	return getType(value) === "undefined";
};
