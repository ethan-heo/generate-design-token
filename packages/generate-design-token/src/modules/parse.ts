import { TokenObj } from "../types/token.types";
import { mapArray, mapObject } from "../utils/map";
import { isTokenObj } from "../utils/token-obj";
import {
	isTokenRef,
	takeOffBracketFromTokenRef,
	toTokenRef,
} from "../utils/token-ref";
import { isArray, isObject, isString } from "../utils/type-checker";
import Token from "./token";

type TokenObjValue = [string[], TokenObj];

const findValueBy = (
	tokenRef: string,
	refTokens: Token[],
	circularRefMap = new Map<string, string>(),
): TokenObj["$value"] => {
	let token: TokenObjValue | null = null;
	const _tokenRef = takeOffBracketFromTokenRef(tokenRef);

	for (const raw of refTokens) {
		const foundTokenObj = raw.find(
			(props) => toTokenRef(props) === _tokenRef,
		) as TokenObjValue;

		if (foundTokenObj) {
			token = foundTokenObj!;
			break;
		}
	}

	if (!token) {
		throw new Error(`정의되지 않은 토큰입니다: ${tokenRef}`);
	}

	const [, tokenObj] = token;

	return recursiveFindValueBy(tokenRef, tokenObj.$value);

	/**
	 * 참조하는 토큰 키와 참조되는 토큰 키가 서로 순환 참조하고 있는지 확인합니다.
	 * 순환 참조가 발견되면 Error를 throw합니다.
	 * @param referringKey - 참조하는 토큰 키
	 * @param referredKey - 참조되는 토큰 키
	 */
	function checkCircularRef(referringKey: string, referredKey: string) {
		let temp: string | undefined = referredKey;

		circularRefMap.set(referringKey, referredKey);

		while (temp && temp !== referringKey) {
			temp = circularRefMap.get(temp!);
		}

		if (temp === referringKey) {
			throw new Error(
				`${referringKey}와 ${referredKey}가 서로 순환 참조하고 있습니다`,
			);
		}
	}

	/**
	 * 참조된 토큰값을 재귀적으로 찾아 값을 반환합니다.
	 * @param referringTokenRef - 참조하는 토큰 키
	 * @param value - 찾을 토큰의 값
	 * @returns 찾은 토큰의 값
	 */
	function recursiveFindValueBy<T extends TokenObj["$value"]>(
		referringTokenRef: string,
		value: T,
	) {
		if (isString(value)) {
			if (isTokenRef(value)) {
				checkCircularRef(referringTokenRef, value);

				return findValueBy(value, refTokens, circularRefMap) as string;
			} else {
				return value;
			}
		}

		if (isArray(value)) {
			return mapArray(value, (_value) => {
				return recursiveFindValueBy(referringTokenRef, _value);
			});
		}

		if (isObject(value)) {
			return mapObject(value, (_value) => {
				return recursiveFindValueBy(referringTokenRef, _value);
			});
		}

		return value;
	}
};

/**
 * 재귀적으로 참조된 토큰값을 찾아 값을 반환합니다.
 * @param base - 기본 토큰
 * @param refTokens - 참조 토큰
 * @returns 찾은 토큰의 값
 */
const parse = (base: Token, refTokens: Token[]): Token => {
	const result = base.clone();

	for (const [, tokenObj] of result.findAll((_, token) =>
		isTokenObj(token),
	) as TokenObjValue[]) {
		tokenObj.$value = recursiveParse(tokenObj.$value) as TokenObj["$value"];
	}

	return result;

	/**
	 * 재귀적으로 참조된 토큰값을 찾아 값을 반환합니다.
	 * @param value - 찾을 토큰의 값
	 * @returns 찾은 토큰의 값
	 */
	function recursiveParse(value: TokenObj["$value"]) {
		if (isString(value) && isTokenRef(value)) {
			return findValueBy(value, [base, ...refTokens]);
		} else {
			if (isArray(value)) {
				return mapArray(value, recursiveParse);
			}

			if (isObject(value)) {
				return mapObject(value, recursiveParse);
			}
		}

		return value;
	}
};

export default parse;
