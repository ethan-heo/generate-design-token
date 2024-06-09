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
		}
	});

	console.log(data);

	// 3. 할당한다.

	return {};

	// const skipobjPath: string[][] = [];

	// return iterateToken<Token>({
	// 	data: {},
	// 	iterateCallback: (objPath, token, data) => {
	// 		const _objPath = [...objPath];
	// 		const _tokenName = _objPath.pop()!;

	// 		if (isTokenRef(_tokenName)) {
	// 			let _token = token;
	// 			const matchedTokenRef = matchTokenRefs(_tokenName)[0];
	// 			const foundToken = findToken(matchedTokenRef, baseTokens);

	// 			if (foundToken === undefined) {
	// 				throw new Error(`토큰을 찾을 수 없습니다. [${_tokenName}]`);
	// 			}

	// 			const splitedMatchedTokenRef =
	// 				matchedTokenRef.split(TOKEN_REF_SEPERATOR);

	// 			if (isTokenObj(foundToken) && isTokenObj(token)) {
	// 				splitedMatchedTokenRef.shift();

	// 				assignToken(
	// 					splitedMatchedTokenRef,
	// 					(_token = {}),
	// 					replaceTokenValue(token, matchedTokenRef),
	// 				);
	// 			}
	// 			if (isTokenObj(foundToken) && !isTokenObj(token)) {
	// 				splitedMatchedTokenRef.shift();

	// 				_token = iterateToken<Token>({
	// 					data: {},
	// 					foundTokenObjCallback: (__objPath, __token, __data) => {
	// 						assignToken(
	// 							[...splitedMatchedTokenRef, ...__objPath],
	// 							__data,
	// 							replaceTokenValue(__token, matchedTokenRef),
	// 						);
	// 					},
	// 				})(token);
	// 			}
	// 			if (!isTokenObj(foundToken) && isTokenObj(token)) {
	// 				_token = iterateToken<Token>({
	// 					data: {},
	// 					foundTokenObjCallback: (__objPath, __token, __data) => {
	// 						assignToken(
	// 							__objPath,
	// 							__data,
	// 							replaceTokenValue(
	// 								token,
	// 								[...splitedMatchedTokenRef, __objPath].join(
	// 									TOKEN_REF_SEPERATOR,
	// 								),
	// 							),
	// 						);
	// 					},
	// 				})(foundToken);
	// 			}
	// 			if (!isTokenObj(foundToken) && !isTokenObj(token)) {
	// 				_token = iterateToken<Token>({
	// 					data: {},
	// 					foundTokenObjCallback: (__objPath, __token, __data) => {
	// 						iterateToken<Token>({
	// 							data: {},
	// 							foundTokenObjCallback: (___objPath, ___token, ___data) => {
	// 								assignToken(
	// 									[...__objPath, ...___objPath],
	// 									__data,
	// 									replaceTokenValue(
	// 										___token,
	// 										[...splitedMatchedTokenRef, __objPath].join(
	// 											TOKEN_REF_SEPERATOR,
	// 										),
	// 									),
	// 								);
	// 							},
	// 						})(token);
	// 					},
	// 				})(foundToken);
	// 			}

	// 			if (_tokenName.length === 0 && isTokenObj(_token)) {
	// 				throw new Error(
	// 					`최상위 레벨에 토큰 객체를 정의할 수 없습니다. ${objPath.join(".")}`,
	// 				);
	// 			}

	// 			deleteToken(objPath, data);
	// 			assignToken(_objPath, data, _token);
	// 			skipobjPath.push([...objPath]);
	// 		} else {
	// 			if (!skipAssignToken(objPath)) {
	// 				assignToken(objPath, data, token);
	// 			}
	// 		}
	// 	},
	// })(token);

	// function deleteToken(objPath: string[], data: Token) {
	// 	const _objPath = [...objPath];
	// 	let target = _objPath.pop()!;

	// 	for (const tokenName of _objPath) {
	// 		if (data[tokenName] === undefined) {
	// 			data[tokenName] = {};
	// 		}

	// 		data = data[tokenName] as Token;
	// 	}

	// 	delete data[target];
	// }

	// function skipAssignToken(objPath: string[]) {
	// 	const objPathStr = objPath.join(TOKEN_REF_SEPERATOR);

	// 	return skipobjPath.some((skipTokenName) =>
	// 		objPathStr.includes(skipTokenName.join(TOKEN_REF_SEPERATOR)),
	// 	);
	// }
};

export default transformer;

function replaceTokenValue(token: TokenObj, replacer: string) {
	return {
		...token,
		$value: token.$value.replace("$value", replacer),
	};
}

function deleteTokenObj(originToken: Token, tokenRef: string) {
	let foundTokenRefObj = originToken;
	const tokenKeys = tokenRef.split(TOKEN_KEY_SEPERATOR);
	const willDeleteKey = tokenKeys.pop()!;

	for (const key of tokenKeys) {
		foundTokenRefObj = foundTokenRefObj[key] as Token;
	}

	delete foundTokenRefObj[willDeleteKey];
}

export function transformCase1(
	originToken: Token,
	objPath: string,
	data: NormalizedTransformerData,
) {
	deleteTokenObj(originToken, objPath);

	const splitedTokenName = objPath.split(TOKEN_KEY_SEPERATOR);
	const tokenRef = splitedTokenName.pop()!;

	splitedTokenName.push(...parseTokenRef(tokenRef));

	assignToken(
		splitedTokenName,
		originToken,
		replaceTokenValue(data.value as TokenObj, matchTokenRefs(tokenRef).at(0)!),
	);
}

export function transformCase2(
	originToken: Token,
	objPath: string,
	data: NormalizedTransformerData,
) {
	deleteTokenObj(originToken, objPath);

	const originalSplitedObjPath = objPath.split(TOKEN_KEY_SEPERATOR);
	const parsedTokenRef = parseTokenRef(originalSplitedObjPath.pop()!);

	// 1. data.token이 토큰 구조 객체이기 때문에 내부의 토큰 객체를 찾아 data.value값으로 치환해주어야 함.
	const transformedToken = iterateToken({
		data: new Map<string, TokenObj>(),
		foundTokenObjCallback: (objPaths, _, _data) => {
			const _objPath = [...parsedTokenRef, ...objPaths];

			_data.set(
				_objPath.join(TOKEN_KEY_SEPERATOR),
				replaceTokenValue(
					data.value as TokenObj,
					_objPath.join(TOKEN_REF_SEPERATOR),
				),
			);
		},
	})(data.token as Token);

	// 2. 변환된 결과물을 originalToken 객체에 override 한다.
	transformedToken.forEach((tokenObj, objPath) => {
		assignToken(
			[...originalSplitedObjPath, ...objPath.split(TOKEN_KEY_SEPERATOR)],
			originToken,
			tokenObj,
		);
	});
}
