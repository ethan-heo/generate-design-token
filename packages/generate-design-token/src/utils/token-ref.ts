import { TOKEN_REF_REGEXP } from "../constants/regexp";
import { shouldBeOnlyTokenRef } from "./validate/format";

/**
 * 주어진 문자열에 토큰 참조가 포함되어 있는지 확인하고
 * 토큰 참조를 추출하여 반환합니다.
 *
 * @param value - 확인할 문자열
 * @returns 토큰 참조를 추출하여 반환합니다. 없으면 null을 반환합니다.
 */
export const findTokenRef = (value: string) => {
	return value.match(TOKEN_REF_REGEXP);
};

/**
 * 주어진 문자열에 토큰 참조값이 포함되어 있는지 확인합니다.
 *
 * @param tokenRef - 확인할 문자열
 * @returns 토큰 참조 문자열이 포함되어 있으면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const hasTokenRef = (str: string) => {
	return !!str.match(TOKEN_REF_REGEXP);
};

/**
 * 주어진 문자열이 토큰 참조값인지 확인합니다.
 *
 * @param {string} tokenRef - 토큰 참조 문자열
 * @returns {boolean} 토큰 참조 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const isTokenRef = (tokenRef: string) => {
	if (tokenRef.includes("{$value}")) {
		return false;
	}

	return shouldBeOnlyTokenRef(tokenRef);
};

/**
 * 주어진 토큰 경로를 문자열로 변환하여 반환합니다.
 * @param props - 토큰 경로
 * @returns 토큰 경로를 문자열로 변환한 결과
 */
export const toTokenRef = (props: string[]) => {
	return props.join(".");
};

/**
 * 주어진 토큰 참조 문자열을 토큰 경로의 배열로 변환합니다.
 *
 * @param tokenRef - 토큰 참조 문자열
 * @returns 토큰 경로의 배열
 */
export const fromTokenRef = (tokenRef: string) => {
	return tokenRef.split(".");
};

/**
 * 주어진 토큰 참조 문자열에 포함된 중괄호를 삭제하여 반환합니다.
 * @param tokenRef - 토큰 참조 문자열
 * @returns 중괄호를 삭제한 토큰 참조 문자열
 */
export const takeOffBracketFromTokenRef = (tokenRef: string): string => {
	return tokenRef.replace(/[\{\}]/g, "");
};
