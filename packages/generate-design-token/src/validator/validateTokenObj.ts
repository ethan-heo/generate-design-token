const MUST_HAVE_PROPERTIES = ["$type", "$value"];

const validateTokenObj = (tokenObj: any) => {
	const checkType = (value: any) =>
		Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

	// 1. 입력받은 값이 객체 형식인지 확인한다.
	if (checkType(tokenObj) !== "object") {
		throw new Error(
			`입력받은 값이 객체형태가 아닙니다. ${checkType(tokenObj)}`,
		);
	}

	for (const prop of MUST_HAVE_PROPERTIES) {
		// 2. 필수 속성이 포함되어 있는지 확인한다.
		if (!tokenObj.hasOwnProperty(prop)) {
			throw new Error(`필수 속성이 정의되어 있지 않습니다. ${prop}`);
		}
		// 3. 필수 속성의 값은 오직 문자열이어야 한다.
		if (typeof tokenObj[prop] !== "string") {
			throw new Error(
				`필수 속성값이 문자열이 아닙니다. ${prop} - ${typeof tokenObj[prop]}`,
			);
		}
	}
};

export default validateTokenObj;
