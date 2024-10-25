export const hasRequiredProp = (value: {}): boolean => {
	const MUST_HAVE_PROPERTIES = ["$type", "$value"];

	return MUST_HAVE_PROPERTIES.every((prop) => prop in value);
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

export const hasNotTokenObjOrNotTokenStructure = (value: {}): boolean => {
	if (typeof value === "object") {
		// 토큰 객체인지 검사
		if (hasRequiredProp(value) && !hasDollarPrefix(value)) {
			return false;
		}

		// 토큰 구조 객체인지 검사
		if (!hasRequiredProp(value) && !hasNotDollarPrefix(value)) {
			return false;
		}
	} else {
		return false;
	}

	return true;
};
