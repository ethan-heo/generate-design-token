import { TOKEN_REF_REGEXP } from "../../constants/regexp";

/**
 * @description 토큰 객체의 필수 속성이 포함되어 있는지 확인한다
 * @returns
 */
export const shouldHaveRequiredProp = (value: {}): boolean => {
	const MUST_HAVE_PROPERTIES = ["$value"];
	return MUST_HAVE_PROPERTIES.every((prop) => prop in value);
};

/**
 * @description 객체 속성 모두 이름에 $를 prefix로 가지고 있는지 확인한다
 * @returns
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
 * @description 객체 속성 모두 이름에 $를 prefix로 가지고 있지 않은지 확인한다
 * @returns
 */
export const shouldNotHaveDollarPrefix = (value: {}): boolean => {
	let result = true;

	for (const prop in value) {
		if (prop.startsWith("$")) {
			result = false;
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
