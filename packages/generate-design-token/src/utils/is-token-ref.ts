import { Validate } from "@utils";

/**
 * 주어진 문자열이 토큰 참조값인지 확인합니다.
 *
 * @param {string} tokenRef - 토큰 참조 문자열
 * @returns {boolean} 토큰 참조 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const isTokenRef = (tokenRef: string) => {
	return Validate.format.shouldBeOnlyTokenRef(tokenRef);
};

export default isTokenRef;
