import { TokenObj } from "@types";
import { mapArray, mapObject, TypeCheckers } from "@utils";

/**
 * {$value}을 포함하고 있는 문자열, 배열, 혹은 객체를
 * 실제 토큰 참조값으로 치환하여 반환합니다.
 *
 * @param {any} value
 * @param {string} tokenRef
 * @returns {any}
 */
const replaceValueToTokenRef = (value: any, tokenRef: string) => {
	if (TypeCheckers.isString(value)) {
		return value.replace(`{$value}`, `{${tokenRef}}`);
	}

	if (TypeCheckers.isArray(value)) {
		return mapArray(value, (v) => replaceValueToTokenRef(v, tokenRef));
	}

	if (TypeCheckers.isObject(value)) {
		return mapObject(value, (v) => replaceValueToTokenRef(v, tokenRef));
	}

	return value;
};

type UpdateData = {
	/**
	 * 변환할 토큰 그룹의 속성 경로
	 */
	props: string[];
	/**
	 * {$value} 문자열을 대체할 문자열
	 */
	replaceValue: string;
};

/**
 * @function transformTokenResult
 *
 * @description
 * 토큰 객체를 전달받아, {$value}을 포함하고 있는 문자열, 배열, 혹은
 * 객체를 실제 토큰 참조값으로 치환하는 함수
 *
 * @param {Types.TokenObj} base - 토큰 객체
 * @param {UpdateData} data - 치환할 토큰의 프로퍼티와 참조값
 * @returns {[string[], Types.TokenObj]} - TokenResult
 */
const transformTokenResult = (
	base: TokenObj,
	data: UpdateData,
): [string[], TokenObj] => {
	return [
		data.props,
		{
			...base,
			$value: replaceValueToTokenRef(base.$value, data.replaceValue),
		},
	];
};

export default transformTokenResult;
