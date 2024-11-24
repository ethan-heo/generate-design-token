import { TOKEN_REF_REGEXP } from "@constants";

/**
 * 주어진 문자열에 토큰 참조가 포함되어 있는지 확인하고
 * 토큰 참조를 추출하여 반환합니다.
 *
 * @param value - 확인할 문자열
 * @returns 토큰 참조를 추출하여 반환합니다. 없으면 null을 반환합니다.
 */
const findTokenRef = (value: string) => {
	return value.match(TOKEN_REF_REGEXP);
};

export default findTokenRef;
