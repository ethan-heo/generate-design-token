export const validateRequiredTokenProperties = (value: {}): boolean => {
	const MUST_HAVE_PROPERTIES = ["$type", "$value"];

	return MUST_HAVE_PROPERTIES.every((prop) => prop in value);
};

export const validateOptionalTokenProperties = (value: {}): boolean => {
	for (const prop in value) {
		const has$ = prop.startsWith("$");

		if (!has$) {
			return false;
		}
	}

	return true;
};
