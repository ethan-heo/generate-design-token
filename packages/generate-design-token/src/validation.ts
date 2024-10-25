export const hasRequiredProp = (value: {}): boolean => {
	const MUST_HAVE_PROPERTIES = ["$type", "$value"];

	return MUST_HAVE_PROPERTIES.every((prop) => prop in value);
};

export const hasNotRequiredProp = (value: {}): boolean => {
	const MUST_HAVE_PROPERTIES = ["$type", "$value"];

	return MUST_HAVE_PROPERTIES.some((prop) => !(prop in value));
};

/**
 * @description 객체 속성 모두 이름에 $를 prefix로 가지고 있는지 확인한다
 * @returns
 */
export const hasDollarPrefix = (value: {}): boolean => {
	for (const prop in value) {
		if (!prop.startsWith("$")) {
			return false;
		}
	}

	return true;
};

/**
 * @description 객체 속성 모두 이름에 $를 prefix로 가지고 있지 않은지 확인한다
 * @returns
 */
export const hasNotDollarPrefix = (value: {}): boolean => {
	for (const prop in value) {
		if (prop.startsWith("$")) {
			return false;
		}
	}

	return true;
};
