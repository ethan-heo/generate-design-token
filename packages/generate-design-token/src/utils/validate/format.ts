import { TOKEN_REF_REGEXP } from "../../constants/regexp";

/**
 * 주어진 객체가 토큰 객체의 필수 속성을 모두 포함하고 있는지 확인합니다.
 * @param {object} value - 확인할 객체
 * @returns 주어진 객체가 토큰 객체의 필수 속성을 모두 포함하고 있으면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const shouldHaveRequiredProp = (value: {}): boolean => {
	const MUST_HAVE_PROPERTIES = ["$value"];
	return MUST_HAVE_PROPERTIES.every((prop) => prop in value);
};

/**
 * @description 주어진 객체의 속성명이 모두 $로 시작하는지 확인합니다.
 * @param {object} value - 확인할 객체
 * @returns 주어진 객체의 모든 속성명이 $로 시작하면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const shouldHaveDollarPrefix = (value: {}): boolean => {
	let result = true;

	for (const prop in value) {
		if (!prop.startsWith("$")) {
			result = false;
			break;
		}
	}

	return result;
};

/**
 * @description 주어진 객체의 속셩명 중 하나라도 $를 prefix로 가지고 있지 않은 속성명이 있는지 확인합니다.
 * @param {object} value - 확인할 객체
 * @returns 주어진 객체의 속셩명 중 하나라도 $를 prefix로 가지고 있지 않으면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const shouldNotHaveDollarPrefix = (value: {}): boolean => {
	let result = false;

	for (const prop in value) {
		if (!prop.startsWith("$")) {
			result = true;
			break;
		}
	}

	return result;
};

/**
 * @description 주어진 문자열이 토큰 참조값만 포함되어 있는지 확인한다.
 * @param {string} tokenRef
 * @returns {boolean} 토큰 참조가 포함된 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
export const shouldBeOnlyTokenRef = (tokenRef: string) => {
	const matchedTokenRef = tokenRef.match(TOKEN_REF_REGEXP);

	if (!matchedTokenRef) {
		return false;
	}

	return matchedTokenRef[0] === tokenRef;
};
