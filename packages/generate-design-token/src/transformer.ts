import {
	NormalizedTransformerData,
	USE_CASES,
	UseCase,
} from "./constants/use-cases";
import {
	TOKEN_KEY_SEPERATOR,
	TOKEN_REF_SEPERATOR,
} from "./constants/seperator";
import { SequenceFunction, Token, TokenObj } from "./generateToken.types";
import assignToken from "./utils/assignToken";
import findToken from "./utils/findToken";
import isTokenObj from "./utils/isTokenObj";
import isTokenRef from "./utils/isTokenRef";
import iterateToken from "./utils/iterateToken";
import parseTokenRef from "./utils/parseTokenRef";
import matchTokenRefs from "./utils/matchTokenRefs";

/**
 * TODO
 * - 리팩토링 필요
 */
const transformer: SequenceFunction = (token, baseTokens) => {
	// 1. 참조값으로 구성된 키를 가진 객체를 수집한다.
	const data = iterateToken({
		data: new Map<string, NormalizedTransformerData>(),
		iterateCallback: (objPaths, token, data) => {
			const tokenKey = objPaths.at(-1)!;

			if (isTokenRef(tokenKey)) {
				// 2. 수집한 객체는 상위 뎁스까지 포함되며 뎁스는 '/'를 기준으로 문자열로 구성되며 키값으로 설정된다. 값은 토큰 객체 및 토큰 구조 객체가 설정된다.
				const [tokenRef] = matchTokenRefs(tokenKey);
				const foundToken = findToken(tokenRef, baseTokens);

				if (!foundToken) {
					throw new Error("토큰 찾을 수 없음.");
				}

				let useCase: UseCase | undefined;

				switch (true) {
					case isTokenObj(token) && isTokenObj(foundToken):
						useCase = USE_CASES.CASE1;
						break;
					case isTokenObj(token) && !isTokenObj(foundToken):
						useCase = USE_CASES.CASE2;
						break;
					case !isTokenObj(token) && isTokenObj(foundToken):
						useCase = USE_CASES.CASE3;
						break;
					case !isTokenObj(token) && !isTokenObj(foundToken):
					default:
						useCase = USE_CASES.CASE4;
				}

				data.set(objPaths.join(TOKEN_KEY_SEPERATOR), {
					case: useCase,
					value: token,
					token: foundToken,
				});
			}
		},
	})(token);

	// 2. 각 케이스별 변환을 한다.
	data.forEach((data, objPath) => {
		switch (data.case) {
			case USE_CASES.CASE1:
				transformCase1(token, objPath, data);
				break;
			case USE_CASES.CASE2:
				transformCase2(token, objPath, data);
				break;
			case USE_CASES.CASE3:
				transformCase3(token, objPath, data);
				break;
			case USE_CASES.CASE4:
				transformCase4(token, objPath, data);
				break;
		}
	});

	return token;
};

export default transformer;

function replaceTokenValue(token: TokenObj, replacer: string) {
	return {
		...token,
		$value: token.$value.replace("$value", replacer),
	};
}

function deleteTokenObj(originalToken: Token, tokenRef: string) {
	let foundTokenRefObj = originalToken;
	let tokenKeys = tokenRef.split(TOKEN_KEY_SEPERATOR);
	const foundTokenRefIndex = tokenKeys.findIndex((tokenKey) =>
		isTokenRef(tokenKey),
	);
	const willDeleteKey = tokenKeys[foundTokenRefIndex];

	tokenKeys = tokenKeys.splice(0, foundTokenRefIndex);

	for (const key of tokenKeys) {
		foundTokenRefObj = foundTokenRefObj[key] as Token;
	}

	delete foundTokenRefObj[willDeleteKey];
}

export function transformCase1(
	originalToken: Token,
	objPath: string,
	data: NormalizedTransformerData,
) {
	deleteTokenObj(originalToken, objPath);

	const parentPaths = objPath.split(TOKEN_KEY_SEPERATOR);
	const tokenRef = parentPaths.pop()!;

	parentPaths.push(parseTokenRef(tokenRef).at(-1)!);

	assignToken(
		parentPaths,
		originalToken,
		replaceTokenValue(data.value as TokenObj, matchTokenRefs(tokenRef).at(0)!),
	);
}

export function transformCase2(
	originalToken: Token,
	objPath: string,
	data: NormalizedTransformerData,
) {
	deleteTokenObj(originalToken, objPath);

	const parentPaths = objPath.split(TOKEN_KEY_SEPERATOR);
	const parsedTokenRef = parseTokenRef(parentPaths.pop()!);

	// 1. data.token이 토큰 구조 객체이기 때문에 내부의 토큰 객체를 찾아 data.value값으로 치환해주어야 함.
	const transformedToken = iterateToken({
		data: new Map<string, TokenObj>(),
		foundTokenObjCallback: (objPaths, _, _data) => {
			const objPath = [...parentPaths, ...objPaths].join(TOKEN_KEY_SEPERATOR);
			const tokenRef = [...parsedTokenRef, ...objPaths].join(
				TOKEN_REF_SEPERATOR,
			);

			_data.set(objPath, replaceTokenValue(data.value as TokenObj, tokenRef));
		},
	})(data.token as Token);

	// 2. 변환된 결과물을 originalToken 객체에 override 한다.
	transformedToken.forEach((tokenObj, objPath) => {
		assignToken(objPath.split(TOKEN_KEY_SEPERATOR), originalToken, tokenObj);
	});
}

export function transformCase3(
	originalToken: Token,
	objPath: string,
	data: NormalizedTransformerData,
) {
	deleteTokenObj(originalToken, objPath);

	let parentPaths = objPath.split(TOKEN_KEY_SEPERATOR);
	const foundTokenRefIndex = parentPaths.findIndex((tokenKey) =>
		isTokenRef(tokenKey),
	);
	const parsedTokenRef = parseTokenRef(parentPaths[foundTokenRefIndex]);

	parentPaths = parentPaths.splice(0, foundTokenRefIndex);

	// 1. data.value가 토큰 구조 객체이기 때문에 내부의 토큰 객체를 찾아 data.token의 토큰 객체로 변경한다.
	const transformedValue = iterateToken({
		data: new Map<string, TokenObj>(),
		foundTokenObjCallback: (objPaths, token, _data) => {
			const objPath = [...parentPaths, parsedTokenRef.at(-1), ...objPaths];

			_data.set(
				objPath.join(TOKEN_KEY_SEPERATOR),
				replaceTokenValue(token, parsedTokenRef.join(TOKEN_REF_SEPERATOR)),
			);
		},
	})(data.value as Token);

	transformedValue.forEach((tokenObj, objPath) => {
		assignToken(objPath.split(TOKEN_KEY_SEPERATOR), originalToken, tokenObj);
	});
}

export function transformCase4(
	originalToken: Token,
	objPath: string,
	data: NormalizedTransformerData,
) {
	deleteTokenObj(originalToken, objPath);

	let parentPaths = objPath.split(TOKEN_KEY_SEPERATOR);
	const foundTokenRefIndex = parentPaths.findIndex((tokenKey) =>
		isTokenRef(tokenKey),
	);
	const parsedTokenRef = parseTokenRef(parentPaths[foundTokenRefIndex]);

	parentPaths = parentPaths.splice(0, foundTokenRefIndex);

	// 1. data.token이 토큰 구조 객체를 키(objPath), 값(토큰 객체) 형태로 바꾼다.
	const transformedToken = iterateToken({
		data: new Map<string, TokenObj>(),
		foundTokenObjCallback: (objPaths, token, _data) => {
			_data.set(objPaths.join(TOKEN_KEY_SEPERATOR), token);
		},
	})(data.token as Token);

	// 2. transformedToken의 값을 정의한다.
	const transformedValue = iterateToken({
		data: new Map<string, TokenObj>(),
		foundTokenObjCallback: (valueObjPaths, token, _data) => {
			transformedToken.forEach((_, objPath) => {
				const newObjPaths = objPath.split(TOKEN_KEY_SEPERATOR);
				const _objPath = [
					...parentPaths,
					...newObjPaths,
					...valueObjPaths,
				].join(TOKEN_KEY_SEPERATOR);
				const tokenValue = [...parsedTokenRef, ...newObjPaths].join(
					TOKEN_REF_SEPERATOR,
				);

				_data.set(_objPath, replaceTokenValue(token, tokenValue));
			});
		},
	})(data.value as Token);

	transformedValue.forEach((tokenObj, objPath) => {
		assignToken(objPath.split(TOKEN_KEY_SEPERATOR), originalToken, tokenObj);
	});
}
