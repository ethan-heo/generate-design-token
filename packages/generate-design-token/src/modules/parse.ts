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

				return findValueBy(value, refTokens, circularRefMap);
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

const parse = (base: Token, refTokens: Token[]): Token => {
	const result = base.clone();

	for (const [, tokenObj] of result.findAll(
		(_, token) => isObject(token) && isTokenObj(token),
	) as TokenObjValue[]) {
		if (isString(tokenObj.$value) && isTokenRef(tokenObj.$value)) {
			const { $type, $value } = findTokenObj(
				takeOffBracketFromTokenRef(tokenObj.$value),
				[base, ...refTokens],
			);

			tokenObj.$type = $type;
			tokenObj.$value = recursiveTokenValue($value);
		} else {
			tokenObj.$value = recursiveTokenValue(tokenObj.$value);
		}
	}

	return result;

	/**
	 * 재귀적으로 참조된 토큰값을 찾아 값을 반환합니다.
	 * @param value - 찾을 토큰의 값
	 * @returns 찾은 토큰의 값
	 */
	function recursiveTokenValue(value: TokenObj["$value"]) {
		if (isString(value) && isTokenRef(value)) {
			return findValueBy(value, [base, ...refTokens]);
		} else {
			if (isArray(value)) {
				return mapArray(value, recursiveTokenValue);
			}

			if (isObject(value)) {
				return mapObject(value, recursiveTokenValue);
			}
		}

		return value;
	}

	/**
	 * 주어진 토큰 참조 문자열에 대한 토큰을 찾아 반환합니다.
	 * @param tokenRef - 토큰 참조 문자열
	 * @param refTokens - 참조 토큰 목록
	 * @returns 찾은 토큰
	 * @throws 토큰이 정의되지 않은 경우 에러를 throw합니다.
	 */
	function findTokenObj(tokenRef: string, refTokens: Token[]) {
		let tokenObj: TokenObj | undefined;

		for (const refToken of refTokens) {
			const foundResult = refToken.find(
				(props) => toTokenRef(props) === tokenRef,
			) as TokenObjValue;

			if (foundResult) {
				tokenObj = foundResult[1];
				break;
			}
		}

		if (!tokenObj) {
			throw new Error(`정의되지 않은 토큰입니다: ${tokenRef}`);
		}

		const { $value } = tokenObj;

		if (isString($value) && isTokenRef($value)) {
			return findTokenObj(takeOffBracketFromTokenRef($value), refTokens);
		}

		return tokenObj;
	}
};

export default parse;
