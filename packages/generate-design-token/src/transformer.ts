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

type UseCase = "Case1" | "Case2" | "Case3" | "Case4";

type Data = {
	case: UseCase;
	value: Token | TokenObj;
	token: Token | TokenObj;
};

const USE_CASES: Record<Uppercase<UseCase>, UseCase> = {
	CASE1: "Case1",
	CASE2: "Case2",
	CASE3: "Case3",
	CASE4: "Case4",
};

/**
 * TODO
 * - 리팩토링 필요
 */
const transformer: SequenceFunction = (token, baseTokens) => {
	// 1. 참조값으로 구성된 키를 가진 객체를 수집한다.
	const data = iterateToken({
		data: new Map<string, Data>(),
		iterateCallback: (tokenNames, token, data) => {
			const tokenName = tokenNames.at(-1)!;

			if (isTokenRef(tokenName)) {
				// 2. 수집한 객체는 상위 뎁스까지 포함되며 뎁스는 '/'를 기준으로 문자열로 구성되며 키값으로 설정된다. 값은 토큰 객체 및 토큰 구조 객체가 설정된다.
				const [tokenRef] = matchTokenRefs(tokenName);
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

				data.set(tokenNames.join(TOKEN_KEY_SEPERATOR), {
					case: useCase,
					value: token,
					token: foundToken,
				});
			}
		},
	})(token);

	// 2. 각 케이스별 변환을 한다.
	data.forEach((data, tokenNames) => {
		switch (data.case) {
			case USE_CASES.CASE1:
				transformCase1(token, tokenNames, data);
				console.log(JSON.stringify(token, null, 2));
				break;
		}
	});

	console.log(data);

	// 3. 할당한다.

	return {};

	// const skipTokenNames: string[][] = [];

	// return iterateToken<Token>({
	// 	data: {},
	// 	iterateCallback: (tokenNames, token, data) => {
	// 		const _tokenNames = [...tokenNames];
	// 		const _tokenName = _tokenNames.pop()!;

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
	// 					foundTokenObjCallback: (__tokenNames, __token, __data) => {
	// 						assignToken(
	// 							[...splitedMatchedTokenRef, ...__tokenNames],
	// 							__data,
	// 							replaceTokenValue(__token, matchedTokenRef),
	// 						);
	// 					},
	// 				})(token);
	// 			}
	// 			if (!isTokenObj(foundToken) && isTokenObj(token)) {
	// 				_token = iterateToken<Token>({
	// 					data: {},
	// 					foundTokenObjCallback: (__tokenNames, __token, __data) => {
	// 						assignToken(
	// 							__tokenNames,
	// 							__data,
	// 							replaceTokenValue(
	// 								token,
	// 								[...splitedMatchedTokenRef, __tokenNames].join(
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
	// 					foundTokenObjCallback: (__tokenNames, __token, __data) => {
	// 						iterateToken<Token>({
	// 							data: {},
	// 							foundTokenObjCallback: (___tokenNames, ___token, ___data) => {
	// 								assignToken(
	// 									[...__tokenNames, ...___tokenNames],
	// 									__data,
	// 									replaceTokenValue(
	// 										___token,
	// 										[...splitedMatchedTokenRef, __tokenNames].join(
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
	// 					`최상위 레벨에 토큰 객체를 정의할 수 없습니다. ${tokenNames.join(".")}`,
	// 				);
	// 			}

	// 			deleteToken(tokenNames, data);
	// 			assignToken(_tokenNames, data, _token);
	// 			skipTokenNames.push([...tokenNames]);
	// 		} else {
	// 			if (!skipAssignToken(tokenNames)) {
	// 				assignToken(tokenNames, data, token);
	// 			}
	// 		}
	// 	},
	// })(token);

	// function deleteToken(tokenNames: string[], data: Token) {
	// 	const _tokenNames = [...tokenNames];
	// 	let target = _tokenNames.pop()!;

	// 	for (const tokenName of _tokenNames) {
	// 		if (data[tokenName] === undefined) {
	// 			data[tokenName] = {};
	// 		}

	// 		data = data[tokenName] as Token;
	// 	}

	// 	delete data[target];
	// }

	// function skipAssignToken(tokenNames: string[]) {
	// 	const tokenNamesStr = tokenNames.join(TOKEN_REF_SEPERATOR);

	// 	return skipTokenNames.some((skipTokenName) =>
	// 		tokenNamesStr.includes(skipTokenName.join(TOKEN_REF_SEPERATOR)),
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
	tokenNames: string,
	data: Data,
) {
	deleteTokenObj(originToken, tokenNames);

	const splitedTokenName = tokenNames.split(TOKEN_KEY_SEPERATOR);
	const tokenRef = splitedTokenName.pop()!;

	splitedTokenName.push(...parseTokenRef(tokenRef));

	assignToken(
		splitedTokenName,
		originToken,
		replaceTokenValue(data.value as TokenObj, matchTokenRefs(tokenRef).at(0)!),
	);
}
