/**
 * @description 토큰 객체의 필수 속성이 포함되어 있는지 확인한다
 * @returns
 */
export const shouldHaveRequiredProp = (value: {}): boolean => {
	const MUST_HAVE_PROPERTIES = ["$type", "$value"];

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
